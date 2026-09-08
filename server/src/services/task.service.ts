import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { TaskModel, type TaskDocument } from '../models/task.model.js';
import { AppError } from '../utils/app-error.js';
import { CACHE_TTL, deleteCachePattern, getCache, setCache } from '../utils/cache.js';
import type { CreateTaskInput, UpdateTaskInput } from '../validators/task.validators.js';

const ensureOrganizationUser = async (organizationId: string, userId: string | null | undefined): Promise<void> => {
  if (userId && !(await OrganizationMemberModel.exists({ organizationId, userId }))) {
    throw new AppError(400, 'User must belong to the organization');
  }
};

export const taskService = {
  async create(organizationId: string, projectId: string, reporterId: string, input: CreateTaskInput): Promise<TaskDocument> {
    await ensureOrganizationUser(organizationId, input.assigneeId);
    const task = await TaskModel.create({ ...input, organizationId, projectId, reporterId });
    await deleteCachePattern(`devflow:tasks:${projectId}:*`);
    await deleteCachePattern(`devflow:sprints:${projectId}:*`);
    await deleteCachePattern(`devflow:analytics:${projectId}:*`);
    return task;
  },

  async list(projectId: string, options: { page: number; limit: number; search?: string; status?: string; priority?: string; type?: string; assigneeId?: string; label?: string; sprintId?: string; sort: string }) {
    const key = `devflow:tasks:${projectId}:${JSON.stringify(options)}`;
    const cached = await getCache<{ items: TaskDocument[]; pagination: { page: number; limit: number; total: number; pages: number } }>(key);
    if (cached) return cached;
    const filter: Record<string, unknown> = { projectId };
    if (options.search) filter.$or = [
      { title: { $regex: options.search, $options: 'i' } },
      { description: { $regex: options.search, $options: 'i' } },
      { labels: { $regex: options.search, $options: 'i' } },
    ];
    if (options.status) filter.status = options.status;
    if (options.priority) filter.priority = options.priority;
    if (options.type) filter.type = options.type;
    if (options.assigneeId) filter.assigneeId = options.assigneeId;
    if (options.label) filter.labels = options.label;
    if (options.sprintId) filter.sprintId = options.sprintId;
    const sort: Record<string, 1 | -1> = options.sort === 'title' ? { title: 1 } : options.sort === '-title' ? { title: -1 } : options.sort === 'priority' ? { priority: 1 } : { position: 1, createdAt: 1 };
    const [items, total] = await Promise.all([
      TaskModel.find(filter).sort(sort).skip((options.page - 1) * options.limit).limit(options.limit),
      TaskModel.countDocuments(filter),
    ]);
    const result = { items, pagination: { page: options.page, limit: options.limit, total, pages: Math.ceil(total / options.limit) } };
    await setCache(key, result, CACHE_TTL.list);
    return result;
  },

  async update(task: TaskDocument, organizationId: string, input: UpdateTaskInput): Promise<TaskDocument> {
    await ensureOrganizationUser(organizationId, input.assigneeId);
    Object.assign(task, input);
    const updated = await task.save();
    await deleteCachePattern(`devflow:tasks:${task.projectId}:*`);
    await deleteCachePattern(`devflow:sprints:${task.projectId}:*`);
    await deleteCachePattern(`devflow:analytics:${task.projectId}:*`);
    return updated;
  },

  async delete(task: TaskDocument): Promise<void> {
    await TaskModel.deleteOne({ _id: task._id, projectId: task.projectId, organizationId: task.organizationId });
    await deleteCachePattern(`devflow:tasks:${task.projectId}:*`);
    await deleteCachePattern(`devflow:sprints:${task.projectId}:*`);
    await deleteCachePattern(`devflow:analytics:${task.projectId}:*`);
  },

  async assign(task: TaskDocument, organizationId: string, assigneeId: string | null | undefined): Promise<TaskDocument> {
    await ensureOrganizationUser(organizationId, assigneeId);
    task.assigneeId = assigneeId as never;
    const updated = await task.save();
    await deleteCachePattern(`devflow:tasks:${task.projectId}:*`);
    await deleteCachePattern(`devflow:analytics:${task.projectId}:*`);
    return updated;
  },

  async patch(task: TaskDocument, values: Partial<Pick<TaskDocument, 'priority' | 'status' | 'position' | 'labels' | 'dueDate' | 'storyPoints'>>): Promise<TaskDocument> {
    Object.assign(task, values);
    const updated = await task.save();
    await deleteCachePattern(`devflow:tasks:${task.projectId}:*`);
    await deleteCachePattern(`devflow:sprints:${task.projectId}:*`);
    await deleteCachePattern(`devflow:analytics:${task.projectId}:*`);
    return updated;
  },
};