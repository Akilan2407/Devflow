import { ActivityLogModel, type ActivityAction } from '../models/activity-log.model.js';

export type ActivityLogInput = { organizationId?: string | null; userId: string; action: ActivityAction; entityType: string; entityId?: string | null; description: string; metadata?: Record<string, unknown> };
export const createActivityLog = async (input: ActivityLogInput): Promise<void> => {
  await ActivityLogModel.create(input);
};
export const activityLogService = {
  async list(organizationId: string, options: { page: number; limit: number; action?: string; userId?: string; entityType?: string; entityId?: string; from?: Date; to?: Date }) {
    const filter: Record<string, unknown> = { organizationId };
    if (options.action) filter.action = options.action;
    if (options.userId) filter.userId = options.userId;
    if (options.entityType) filter.entityType = options.entityType;
    if (options.entityId) filter.entityId = options.entityId;
    if (options.from || options.to) filter.timestamp = { ...(options.from ? { $gte: options.from } : {}), ...(options.to ? { $lte: options.to } : {}) };
    const [items, total] = await Promise.all([ActivityLogModel.find(filter).sort({ timestamp: -1 }).skip((options.page - 1) * options.limit).limit(options.limit).populate('userId', 'name email avatar'), ActivityLogModel.countDocuments(filter)]);
    return { items, pagination: { page: options.page, limit: options.limit, total, pages: Math.ceil(total / options.limit) } };
  },
};
