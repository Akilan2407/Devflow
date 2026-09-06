import { Types } from 'mongoose';
import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { ProjectModel } from '../models/project.model.js';
import { TaskModel } from '../models/task.model.js';
import { IssueModel } from '../models/issue.model.js';
import { SprintModel } from '../models/sprint.model.js';
import { UserModel } from '../models/user.model.js';
import { CommentModel } from '../models/comment.model.js';

export type SearchType = 'PROJECT' | 'TASK' | 'ISSUE' | 'SPRINT' | 'USER' | 'COMMENT';
export type SearchOptions = { query: string; userId: string; page: number; limit: number; type?: SearchType };
type SearchResult = { type: SearchType; id: string; title: string; subtitle?: string; score: number; projectId?: string; entityType?: string; entityId?: string };
const escape = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const objectIds = (values: { organizationId: Types.ObjectId }[]): Types.ObjectId[] => values.map((value) => value.organizationId);
const score = (field: string, query: string) => ({ $add: [{ $cond: [{ $regexMatch: { input: { $ifNull: [`$${field}`, ''] }, regex: `^${escape(query)}$`, options: 'i' } }, 10, 0] }, { $cond: [{ $regexMatch: { input: { $ifNull: [`$${field}`, ''] }, regex: `^${escape(query)}`, options: 'i' } }, 5, 0] }, 1] });
const match = (fields: string[], query: string, organizationIds?: Types.ObjectId[]) => ({ $match: { ...(organizationIds ? { organizationId: { $in: organizationIds } } : {}), $or: fields.map((field) => ({ [field]: { $regex: escape(query), $options: 'i' } })) } });

export const searchService = {
  async search(options: SearchOptions) {
    const memberships = await OrganizationMemberModel.find({ userId: options.userId }).select('organizationId').lean();
    const organizationIds = objectIds(memberships);
    if (!organizationIds.length) return { items: [], pagination: { page: options.page, limit: options.limit, total: 0, pages: 0 } };
    const types = options.type ? [options.type] : ['PROJECT', 'TASK', 'ISSUE', 'SPRINT', 'USER', 'COMMENT'] as SearchType[];
    const query = options.query.trim();
    const searches: Promise<SearchResult[]>[] = [];
    if (types.includes('PROJECT')) searches.push(ProjectModel.aggregate([match(['name', 'key', 'description'], query, organizationIds), { $addFields: { score: { $add: [score('name', query), score('key', query)] } } }, { $project: { _id: 1, title: '$name', subtitle: '$key', score: 1, projectId: '$_id', type: { $literal: 'PROJECT' } } }, { $limit: 100 }]));
    if (types.includes('TASK')) searches.push(TaskModel.aggregate([match(['title', 'description', 'labels'], query, organizationIds), { $addFields: { score: score('title', query) } }, { $project: { _id: 1, title: 1, subtitle: '$status', score: 1, projectId: 1, type: { $literal: 'TASK' } } }, { $limit: 100 }]));
    if (types.includes('ISSUE')) searches.push(IssueModel.aggregate([match(['title', 'description', 'labels'], query, organizationIds), { $addFields: { score: score('title', query) } }, { $project: { _id: 1, title: 1, subtitle: '$status', score: 1, projectId: 1, type: { $literal: 'ISSUE' } } }, { $limit: 100 }]));
    if (types.includes('SPRINT')) searches.push(SprintModel.aggregate([match(['name', 'goal'], query, organizationIds), { $addFields: { score: score('name', query) } }, { $project: { _id: 1, title: '$name', subtitle: '$status', score: 1, projectId: 1, type: { $literal: 'SPRINT' } } }, { $limit: 100 }]));
    if (types.includes('USER')) searches.push(UserModel.aggregate([{ $match: { _id: { $in: (await OrganizationMemberModel.find({ organizationId: { $in: organizationIds } }).distinct('userId')) }, $or: [{ name: { $regex: escape(query), $options: 'i' } }, { email: { $regex: escape(query), $options: 'i' } }], isActive: true } }, { $addFields: { score: score('name', query) } }, { $project: { _id: 1, title: '$name', subtitle: '$email', score: 1, type: { $literal: 'USER' } } }, { $limit: 100 }]));
    if (types.includes('COMMENT')) searches.push(CommentModel.aggregate([match(['content'], query, organizationIds), { $addFields: { score: score('content', query) } }, { $project: { _id: 1, title: '$content', subtitle: '$entityType', score: 1, entityType: 1, entityId: 1, type: { $literal: 'COMMENT' } } }, { $limit: 100 }]));
    const allItems = (await Promise.all(searches)).flat().sort((left, right) => right.score - left.score);
    const comments = allItems.filter((item) => item.type === 'COMMENT');
    const taskIds = comments.filter((item) => item.entityType === 'TASK').map((item) => item.entityId);
    const issueIds = comments.filter((item) => item.entityType === 'ISSUE').map((item) => item.entityId);
    const [commentTasks, commentIssues] = await Promise.all([TaskModel.find({ _id: { $in: taskIds } }).select('_id projectId').lean(), IssueModel.find({ _id: { $in: issueIds } }).select('_id projectId').lean()]);
    const projectByEntity = new Map([...commentTasks, ...commentIssues].map((item) => [item._id.toString(), item.projectId.toString()]));
    for (const item of comments) item.projectId = item.entityType === 'PROJECT' ? item.entityId : projectByEntity.get(item.entityId ?? '');
    const items = allItems.slice((options.page - 1) * options.limit, options.page * options.limit);
    return { items, pagination: { page: options.page, limit: options.limit, total: allItems.length, pages: Math.ceil(allItems.length / options.limit) } };
  },
};
