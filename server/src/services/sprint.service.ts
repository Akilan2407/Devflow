import { TaskModel } from '../models/task.model.js';
import { SprintModel, type SprintDocument } from '../models/sprint.model.js';
import { AppError } from '../utils/app-error.js';
import { CACHE_TTL, deleteCachePattern, getCache, setCache } from '../utils/cache.js';
import type { CreateSprintInput, UpdateSprintInput } from '../validators/sprint.validators.js';

const assertDates = (startDate: Date, endDate: Date): void => {
  if (endDate < startDate) throw new AppError(400, 'Sprint end date must be on or after its start date');
};

export const sprintService = {
  async create(organizationId: string, projectId: string, userId: string, input: CreateSprintInput): Promise<SprintDocument> {
    assertDates(input.startDate, input.endDate);
    const sprint = await SprintModel.create({ ...input, organizationId, projectId, createdBy: userId });
    await deleteCachePattern(`devflow:sprints:${projectId}:*`);
    await deleteCachePattern(`devflow:analytics:${projectId}:*`);
    return sprint;
  },

  async list(projectId: string): Promise<SprintDocument[]> {
    const key = `devflow:sprints:${projectId}:list`;
    const cached = await getCache<SprintDocument[]>(key);
    if (cached) return cached;
    const sprints = await SprintModel.find({ projectId }).sort({ startDate: -1 });
    await setCache(key, sprints, CACHE_TTL.list);
    return sprints;
  },

  async get(sprint: SprintDocument) {
    const key = `devflow:sprints:${sprint.projectId}:detail:${sprint._id}`;
    const cached = await getCache<unknown>(key);
    if (cached) return cached;
    const [tasks, totalStoryPoints, completedStoryPoints] = await Promise.all([
      TaskModel.find({ sprintId: sprint._id }).sort({ position: 1, createdAt: 1 }),
      TaskModel.aggregate([{ $match: { sprintId: sprint._id } }, { $group: { _id: null, total: { $sum: { $ifNull: ['$storyPoints', 0] } } } }]),
      TaskModel.aggregate([{ $match: { sprintId: sprint._id, status: 'DONE' } }, { $group: { _id: null, total: { $sum: { $ifNull: ['$storyPoints', 0] } } } }]),
    ]);
    const total = totalStoryPoints[0]?.total ?? 0;
    const completed = completedStoryPoints[0]?.total ?? 0;
    const result = { sprint, tasks, metrics: { totalStoryPoints: total, completedStoryPoints: completed, remainingStoryPoints: Math.max(total - completed, 0), completionPercentage: total ? Math.round((completed / total) * 100) : 0 } };
    await setCache(key, result, CACHE_TTL.detail);
    return result;
  },

  async update(sprint: SprintDocument, input: UpdateSprintInput): Promise<SprintDocument> {
    const startDate = input.startDate ?? sprint.startDate;
    const endDate = input.endDate ?? sprint.endDate;
    assertDates(startDate, endDate);
    Object.assign(sprint, input);
    const updated = await sprint.save();
    await deleteCachePattern(`devflow:sprints:${sprint.projectId}:*`);
    await deleteCachePattern(`devflow:analytics:${sprint.projectId}:*`);
    return updated;
  },

  async start(sprint: SprintDocument): Promise<SprintDocument> {
    if (sprint.status === 'COMPLETED') throw new AppError(400, 'A completed sprint cannot be started');
    const activeSprint = await SprintModel.exists({ projectId: sprint.projectId, status: 'ACTIVE', _id: { $ne: sprint._id } });
    if (activeSprint) throw new AppError(409, 'This project already has an active sprint');
    sprint.status = 'ACTIVE';
    const updated = await sprint.save();
    await deleteCachePattern(`devflow:sprints:${sprint.projectId}:*`);
    await deleteCachePattern(`devflow:analytics:${sprint.projectId}:*`);
    return updated;
  },

  async complete(sprint: SprintDocument): Promise<SprintDocument> {
    if (sprint.status !== 'ACTIVE') throw new AppError(400, 'Only an active sprint can be completed');
    sprint.status = 'COMPLETED';
    const updated = await sprint.save();
    await deleteCachePattern(`devflow:sprints:${sprint.projectId}:*`);
    await deleteCachePattern(`devflow:analytics:${sprint.projectId}:*`);
    return updated;
  },

  async delete(sprint: SprintDocument): Promise<void> {
    await TaskModel.updateMany({ sprintId: sprint._id }, { $set: { sprintId: null } });
    await SprintModel.deleteOne({ _id: sprint._id, projectId: sprint.projectId, organizationId: sprint.organizationId });
    await deleteCachePattern(`devflow:sprints:${sprint.projectId}:*`);
    await deleteCachePattern(`devflow:tasks:${sprint.projectId}:*`);
    await deleteCachePattern(`devflow:analytics:${sprint.projectId}:*`);
  },

  async addTask(sprint: SprintDocument, taskId: string): Promise<void> {
    const task = await TaskModel.findOne({ _id: taskId, projectId: sprint.projectId, organizationId: sprint.organizationId });
    if (!task) throw new AppError(404, 'Task not found in this project');
    task.sprintId = sprint._id;
    await task.save();
    await deleteCachePattern(`devflow:sprints:${sprint.projectId}:*`);
    await deleteCachePattern(`devflow:tasks:${sprint.projectId}:*`);
    await deleteCachePattern(`devflow:analytics:${sprint.projectId}:*`);
  },

  async removeTask(sprint: SprintDocument, taskId: string): Promise<void> {
    const result = await TaskModel.updateOne({ _id: taskId, projectId: sprint.projectId, organizationId: sprint.organizationId, sprintId: sprint._id }, { $set: { sprintId: null } });
    if (!result.modifiedCount) throw new AppError(404, 'Task is not in this sprint');
    await deleteCachePattern(`devflow:sprints:${sprint.projectId}:*`);
    await deleteCachePattern(`devflow:tasks:${sprint.projectId}:*`);
    await deleteCachePattern(`devflow:analytics:${sprint.projectId}:*`);
  },
};