import type { NextFunction, Request, Response } from 'express';
import type { OrganizationRequest } from '../types/organization.types.js';
import { activityActions } from '../models/activity-log.model.js';
import { activityLogService } from '../services/activity-log.service.js';
const value = (input: unknown): string | undefined => typeof input === 'string' && input.length ? input : undefined;
export const getActivityLogs = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const organizationId = (request as unknown as OrganizationRequest).organization._id.toString();
    const action = value(request.query.action);
    if (action && !activityActions.includes(action as (typeof activityActions)[number])) { response.status(400).json({ error: { message: 'Invalid activity action' } }); return; }
    const parseDate = (input: unknown): Date | undefined => { const raw = value(input); if (!raw) return undefined; const date = new Date(raw); if (Number.isNaN(date.valueOf())) throw new Error('Invalid date filter'); return date; };
    const page = Math.max(Number(request.query.page) || 1, 1); const limit = Math.min(Math.max(Number(request.query.limit) || 20, 1), 100);
    response.json({ data: await activityLogService.list(organizationId, { page, limit, action, userId: value(request.query.userId), entityType: value(request.query.entityType), entityId: value(request.query.entityId), from: parseDate(request.query.from), to: parseDate(request.query.to) }) });
  } catch (error) { next(error); }
};
