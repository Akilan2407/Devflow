import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { TaskModel, type TaskDocument } from '../models/task.model.js';
import { AppError } from '../utils/app-error.js';
import type { CreateTaskInput, UpdateTaskInput } from '../validators/task.validators.js';

const ensureOrganizationUser = async (organizationId: string, userId: string | null | undefined): Promise<void> => {
  if (userId && !(await OrganizationMemberModel.exists({ organizationId, userId }))) {
    throw new AppError(400, 'User must belong to the organization');
  }
};

export const taskService = {
  async create(organizationId: string, projectId: string, reporterId: string, input: CreateTaskInput): Promise<TaskDocument> {
    await ensureOrganizationUser(organizationId, input.assigneeId);
    return TaskModel.create({ ...input, organizationId, projectId, reporterId });
  },

  async list(projectId: string, options: { page: number; limit: number; search?: string; status?: string; priority?: string; type?: string; assigneeId?: string; sort: string }) {
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
    const sort: Record<string, 1 | -1> = options.sort === 'title' ? { title: 1 } : options.sort === '-title' ? { title: -1 } : options.sort === 'priority' ? { priority: 1 } : { position: 1, createdAt: 1 };
    const [items, total] = await Promise.all([
      TaskModel.find(filter).sort(sort).skip((options.page - 1) * options.limit).limit(options.limit),
      TaskModel.countDocuments(filter),
    ]);
    return { items, pagination: { page: options.page, limit: options.limit, total, pages: Math.ceil(total / options.limit) } };
  },

  async update(task: TaskDocument, organizationId: string, input: UpdateTaskInput): Promise<TaskDocument> {
    await ensureOrganizationUser(organizationId, input.assigneeId);
    Object.assign(task, input);
    return task.save();
  },

  async delete(task: TaskDocument): Promise<void> {
    await TaskModel.deleteOne({ _id: task._id, projectId: task.projectId, organizationId: task.organizationId });
  },

  async assign(task: TaskDocument, organizationId: string, assigneeId: string | null | undefined): Promise<TaskDocument> {
    await ensureOrganizationUser(organizationId, assigneeId);
    task.assigneeId = assigneeId as never;
    return task.save();
  },

  async patch(task: TaskDocument, values: Partial<Pick<TaskDocument, 'priority' | 'status' | 'position' | 'labels' | 'dueDate' | 'storyPoints'>>): Promise<TaskDocument> {
    Object.assign(task, values);
    return task.save();
  },
};