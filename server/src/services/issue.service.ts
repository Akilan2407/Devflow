import { CommentModel } from '../models/comment.model.js';
import { IssueHistoryModel } from '../models/issue-history.model.js';
import { IssueModel, type IssueDocument } from '../models/issue.model.js';
import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { SprintModel } from '../models/sprint.model.js';
import { TaskModel } from '../models/task.model.js';
import { AppError } from '../utils/app-error.js';
import { CACHE_TTL, deleteCache, deleteCachePattern, getCache, setCache } from '../utils/cache.js';
import type { CreateIssueInput, UpdateIssueInput } from '../validators/issue.validators.js';

const ensureMember = async (organizationId: string, userId: string | null | undefined): Promise<void> => {
  if (userId && !(await OrganizationMemberModel.exists({ organizationId, userId }))) throw new AppError(400, 'User must belong to the organization');
};
const ensureSprint = async (organizationId: string, projectId: string, sprintId: string | null | undefined): Promise<void> => {
  if (sprintId && !(await SprintModel.exists({ _id: sprintId, organizationId, projectId }))) throw new AppError(400, 'Sprint must belong to this project');
};

const record = async (organizationId: string, issueId: string, actorId: string, action: string, field?: string, from?: unknown, to?: unknown): Promise<void> => {
  await IssueHistoryModel.create({ organizationId, issueId, actorId, action, field, from, to });
};

export const issueService = {
  async create(organizationId: string, projectId: string, reporterId: string, input: CreateIssueInput): Promise<IssueDocument> {
    await ensureMember(organizationId, input.assigneeId);
    await ensureSprint(organizationId, projectId, input.sprintId);
    const issue = await IssueModel.create({ ...input, organizationId, projectId, reporterId });
    await record(organizationId, issue._id.toString(), reporterId, 'CREATED');
    await deleteCachePattern(`devflow:issues:${projectId}:*`);
    await deleteCachePattern(`devflow:analytics:${projectId}:*`);
    return issue;
  },
  async list(projectId: string, options: { page: number; limit: number; search?: string; type?: string; status?: string; priority?: string; severity?: string; assigneeId?: string; label?: string; sprintId?: string; sort: string }) {
    const key = `devflow:issues:${projectId}:${JSON.stringify(options)}`;
    const cached = await getCache<{ items: IssueDocument[]; pagination: { page: number; limit: number; total: number; pages: number } }>(key);
    if (cached) return cached;
    const filter: Record<string, unknown> = { projectId };
    if (options.search) filter.$or = [{ title: { $regex: options.search, $options: 'i' } }, { description: { $regex: options.search, $options: 'i' } }, { labels: { $regex: options.search, $options: 'i' } }];
    if (options.type) filter.type = options.type;
    if (options.status) filter.status = options.status;
    if (options.priority) filter.priority = options.priority;
    if (options.severity) filter.severity = options.severity;
    if (options.assigneeId) filter.assigneeId = options.assigneeId;
    if (options.label) filter.labels = options.label;
    if (options.sprintId) filter.sprintId = options.sprintId;
    const sort: Record<string, 1 | -1> = options.sort === 'title' ? { title: 1 } : options.sort === '-title' ? { title: -1 } : options.sort === 'priority' ? { priority: 1 } : { createdAt: -1 };
    const [items, total] = await Promise.all([IssueModel.find(filter).sort(sort).skip((options.page - 1) * options.limit).limit(options.limit).populate('assigneeId', 'name email avatar').populate('reporterId', 'name email avatar'), IssueModel.countDocuments(filter)]);
    const result = { items, pagination: { page: options.page, limit: options.limit, total, pages: Math.ceil(total / options.limit) } };
    await setCache(key, result, CACHE_TTL.list);
    return result;
  },
  async update(issue: IssueDocument, organizationId: string, actorId: string, input: UpdateIssueInput): Promise<IssueDocument> {
    await ensureMember(organizationId, input.assigneeId);
    await ensureSprint(organizationId, issue.projectId.toString(), input.sprintId);
    const changes = Object.entries(input) as [string, unknown][];
    Object.assign(issue, input);
    await issue.save();
    await Promise.all(changes.map(([field, to]) => record(organizationId, issue._id.toString(), actorId, 'UPDATED', field, undefined, to)));
    await deleteCachePattern(`devflow:issues:${issue.projectId}:*`);
    await deleteCachePattern(`devflow:analytics:${issue.projectId}:*`);
    await deleteCache(`devflow:issues:${issue._id}:history`);
    return issue;
  },
  async delete(issue: IssueDocument, organizationId: string, actorId: string): Promise<void> {
    await Promise.all([CommentModel.deleteMany({ entityType: 'ISSUE', entityId: issue._id }), IssueHistoryModel.deleteMany({ issueId: issue._id }), IssueModel.deleteOne({ _id: issue._id, organizationId })]);
    await record(organizationId, issue._id.toString(), actorId, 'DELETED');
    await deleteCachePattern(`devflow:issues:${issue.projectId}:*`);
    await deleteCachePattern(`devflow:analytics:${issue.projectId}:*`);
    await deleteCache(`devflow:issues:${issue._id}:history`);
    await deleteCache(`devflow:issues:${issue._id}:comments`);
    await deleteCache(`devflow:issues:${issue._id}:history`);
  },
  async action(issue: IssueDocument, organizationId: string, actorId: string, field: 'status' | 'priority' | 'severity' | 'assigneeId' | 'labels', value: unknown): Promise<IssueDocument> {
    if (field === 'assigneeId') await ensureMember(organizationId, value as string | null | undefined);
    const from = issue[field];
    (issue as unknown as Record<string, unknown>)[field] = value;
    await issue.save();
    await record(organizationId, issue._id.toString(), actorId, `CHANGED_${field.toUpperCase()}`, field, from, value);
    await deleteCachePattern(`devflow:issues:${issue.projectId}:*`);
    await deleteCachePattern(`devflow:analytics:${issue.projectId}:*`);
    return issue;
  },
  async comments(issueId: string) {
    const key = `devflow:issues:${issueId}:comments`;
    const cached = await getCache<unknown[]>(key);
    if (cached) return cached;
    const comments = await CommentModel.find({ entityType: 'ISSUE', entityId: issueId }).sort({ createdAt: 1 }).populate('authorId', 'name email avatar');
    await setCache(key, comments, CACHE_TTL.detail);
    return comments;
  },
  async addComment(issue: IssueDocument, organizationId: string, authorId: string, body: string) { const comment = await CommentModel.create({ entityType: 'ISSUE', entityId: issue._id, organizationId, authorId, content: body, mentions: [] }); await record(organizationId, issue._id.toString(), authorId, 'COMMENTED'); await deleteCache(`devflow:issues:${issue._id}:comments`); await deleteCachePattern(`devflow:analytics:${issue.projectId}:*`); return comment.populate('authorId', 'name email avatar'); },
  async history(issueId: string) {
    const key = `devflow:issues:${issueId}:history`;
    const cached = await getCache<unknown[]>(key);
    if (cached) return cached;
    const history = await IssueHistoryModel.find({ issueId }).sort({ createdAt: -1 }).populate('actorId', 'name email avatar');
    await setCache(key, history, CACHE_TTL.detail);
    return history;
  },
  async linkTask(issue: IssueDocument, taskId: string): Promise<void> { if (!(await TaskModel.exists({ _id: taskId, projectId: issue.projectId, organizationId: issue.organizationId }))) throw new AppError(404, 'Task not found in this project'); },
};