import { Types } from 'mongoose';
import { TaskModel } from '../models/task.model.js';
import { IssueModel } from '../models/issue.model.js';
import { SprintModel } from '../models/sprint.model.js';
import { ActivityLogModel } from '../models/activity-log.model.js';
import { CACHE_TTL, getCache, setCache } from '../utils/cache.js';

export type AnalyticsFilters = { from?: Date; to?: Date; sprintId?: string; developerId?: string };
type SprintAnalytics = { items: Array<Record<string, unknown>>; totalVelocity: number };
const objectId = (value: string): Types.ObjectId => new Types.ObjectId(value);
const dateMatch = (filters: AnalyticsFilters): Record<string, unknown> => filters.from || filters.to ? { ...(filters.from ? { $gte: filters.from } : {}), ...(filters.to ? { $lte: filters.to } : {}) } : {};
const taskMatch = (projectId: string, filters: AnalyticsFilters): Record<string, unknown> => ({ projectId: objectId(projectId), ...(filters.sprintId ? { sprintId: objectId(filters.sprintId) } : {}), ...(filters.developerId ? { assigneeId: objectId(filters.developerId) } : {}), ...(filters.from || filters.to ? { createdAt: dateMatch(filters) } : {}) });
const issueMatch = (projectId: string, filters: AnalyticsFilters): Record<string, unknown> => ({ projectId: objectId(projectId), ...(filters.sprintId ? { sprintId: objectId(filters.sprintId) } : {}), ...(filters.developerId ? { assigneeId: objectId(filters.developerId) } : {}), ...(filters.from || filters.to ? { createdAt: dateMatch(filters) } : {}) });

export const analyticsService = {
  async project(projectId: string, filters: AnalyticsFilters) {
    const key = `devflow:analytics:${projectId}:project:${JSON.stringify(filters)}`;
    const cached = await getCache<{ sprintVelocity: Array<Record<string, unknown>> }>(key);
    if (cached) return cached;
    const tasks = await TaskModel.aggregate([
      { $match: taskMatch(projectId, filters) },
      { $facet: {
        totals: [{ $group: { _id: null, total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ['$status', 'DONE'] }, 1, 0] } }, pointsCompleted: { $sum: { $cond: [{ $eq: ['$status', 'DONE'] }, { $ifNull: ['$storyPoints', 0] }, 0] } }, pointsTotal: { $sum: { $ifNull: ['$storyPoints', 0] } } } }],
        statuses: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
      } },
    ]);
    const issues = await IssueModel.aggregate([{ $match: issueMatch(projectId, filters) }, { $facet: { totals: [{ $group: { _id: null, open: { $sum: { $cond: [{ $in: ['$status', ['OPEN', 'IN_PROGRESS', 'REOPENED']] }, 1, 0] } }, resolved: { $sum: { $cond: [{ $in: ['$status', ['RESOLVED', 'CLOSED']] }, 1, 0] } } } }], distribution: [{ $group: { _id: '$status', count: { $sum: 1 } } }] } }]);
    const [activity, velocity] = await Promise.all([this.activity(projectId, filters), this.sprints(projectId, filters)]);
    const total = tasks[0]?.totals[0]?.total ?? 0; const completed = tasks[0]?.totals[0]?.completed ?? 0;
    const result = { totalTasks: total, completedTasks: completed, openTasks: total - completed, taskCompletionPercentage: total ? Math.round((completed / total) * 100) : 0, projectCompletion: total ? Math.round((completed / total) * 100) : 0, openIssues: issues[0]?.totals[0]?.open ?? 0, resolvedIssues: issues[0]?.totals[0]?.resolved ?? 0, taskStatuses: tasks[0]?.statuses ?? [], issueDistribution: issues[0]?.distribution ?? [], storyPointsCompleted: tasks[0]?.totals[0]?.pointsCompleted ?? 0, storyPointsRemaining: Math.max((tasks[0]?.totals[0]?.pointsTotal ?? 0) - (tasks[0]?.totals[0]?.pointsCompleted ?? 0), 0), sprintVelocity: velocity.items, activityTrends: activity };
    await setCache(key, result, CACHE_TTL.analytics);
    return result;
  },
  async tasks(projectId: string, filters: AnalyticsFilters) {
    const key = `devflow:analytics:${projectId}:tasks:${JSON.stringify(filters)}`;
    const cached = await getCache<unknown>(key);
    if (cached) return cached;
    const result = await TaskModel.aggregate([{ $match: taskMatch(projectId, filters) }, { $facet: { totals: [{ $group: { _id: null, total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ['$status', 'DONE'] }, 1, 0] } }, pointsCompleted: { $sum: { $cond: [{ $eq: ['$status', 'DONE'] }, { $ifNull: ['$storyPoints', 0] }, 0] } }, pointsTotal: { $sum: { $ifNull: ['$storyPoints', 0] } } } }], statuses: [{ $group: { _id: '$status', count: { $sum: 1 } } }], trends: [{ $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ['$status', 'DONE'] }, 1, 0] } } } }, { $sort: { '_id': 1 } }] } }]).then((result) => result[0]);
    await setCache(key, result, CACHE_TTL.analytics);
    return result;
  },
  async issues(projectId: string, filters: AnalyticsFilters) {
    const key = `devflow:analytics:${projectId}:issues:${JSON.stringify(filters)}`;
    const cached = await getCache<SprintAnalytics>(key);
    if (cached) return cached;
    const result = await IssueModel.aggregate([{ $match: issueMatch(projectId, filters) }, { $facet: { totals: [{ $group: { _id: null, open: { $sum: { $cond: [{ $in: ['$status', ['OPEN', 'IN_PROGRESS', 'REOPENED']] }, 1, 0] } }, resolved: { $sum: { $cond: [{ $in: ['$status', ['RESOLVED', 'CLOSED']] }, 1, 0] } } } }], distribution: [{ $group: { _id: '$status', count: { $sum: 1 } } }], types: [{ $group: { _id: '$type', count: { $sum: 1 } } }] } }]).then((result) => result[0]);
    await setCache(key, result, CACHE_TTL.analytics);
    return result;
  },
  async sprints(projectId: string, filters: AnalyticsFilters) {
    const key = `devflow:analytics:${projectId}:sprints:${JSON.stringify(filters)}`;
    const cached = await getCache<SprintAnalytics>(key);
    if (cached) return cached;
    const match: Record<string, unknown> = { projectId: objectId(projectId), ...(filters.sprintId ? { _id: objectId(filters.sprintId) } : {}) };
    const items = await SprintModel.aggregate([{ $match: match }, { $lookup: { from: 'tasks', localField: '_id', foreignField: 'sprintId', as: 'tasks' } }, { $project: { _id: 1, name: 1, status: 1, startDate: 1, endDate: 1, velocity: { $sum: { $map: { input: { $filter: { input: '$tasks', as: 'task', cond: { $eq: ['$$task.status', 'DONE'] } } }, as: 'task', in: { $ifNull: ['$$task.storyPoints', 0] } } } }, storyPointsCompleted: { $sum: { $map: { input: { $filter: { input: '$tasks', as: 'task', cond: { $eq: ['$$task.status', 'DONE'] } } }, as: 'task', in: { $ifNull: ['$$task.storyPoints', 0] } } } }, storyPointsTotal: { $sum: { $map: { input: '$tasks', as: 'task', in: { $ifNull: ['$$task.storyPoints', 0] } } } } } }, { $sort: { startDate: 1 } }]);
    const result = { items, totalVelocity: items.reduce((sum, item) => sum + (item.velocity ?? 0), 0) };
    await setCache(key, result, CACHE_TTL.analytics);
    return result;
  },
  async team(projectId: string, filters: AnalyticsFilters) {
    const key = `devflow:analytics:${projectId}:team:${JSON.stringify(filters)}`;
    const cached = await getCache<unknown[]>(key);
    if (cached) return cached;
    const result = await TaskModel.aggregate([{ $match: { ...taskMatch(projectId, filters), assigneeId: { $ne: null } } }, { $group: { _id: '$assigneeId', tasks: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ['$status', 'DONE'] }, 1, 0] } }, storyPoints: { $sum: { $ifNull: ['$storyPoints', 0] } }, completedPoints: { $sum: { $cond: [{ $eq: ['$status', 'DONE'] }, { $ifNull: ['$storyPoints', 0] }, 0] } } } }, { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } }, { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } }, { $project: { _id: 1, tasks: 1, completed: 1, storyPoints: 1, completedPoints: 1, name: '$user.name', email: '$user.email' } }, { $sort: { tasks: -1 } }]);
    await setCache(key, result, CACHE_TTL.analytics);
    return result;
  },
  async activity(projectId: string, filters: AnalyticsFilters) {
    const match: Record<string, unknown> = { 'metadata.projectId': projectId, ...(filters.from || filters.to ? { timestamp: dateMatch(filters) } : {}) };
    const key = `devflow:analytics:${projectId}:activity:${JSON.stringify(filters)}`;
    const cached = await getCache<unknown[]>(key);
    if (cached) return cached;
    const result = await ActivityLogModel.aggregate([{ $match: match }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, count: { $sum: 1 } } }, { $sort: { '_id': 1 } }]);
    await setCache(key, result, CACHE_TTL.analytics);
    return result;
  },
};
