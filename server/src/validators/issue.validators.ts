import { z } from 'zod';
import { issuePriorities, issueSeverities, issueStatuses, issueTypes } from '../models/issue.model.js';

const objectId = z.string().regex(/^[a-f\d]{24}$/i);
const nullableObjectId = objectId.nullable().optional();

export const createIssueSchema = z.object({
  title: z.string().trim().min(1).max(240),
  description: z.string().trim().max(10000).optional().default(''),
  type: z.enum(issueTypes).optional().default('BUG'),
  status: z.enum(issueStatuses).optional().default('OPEN'),
  priority: z.enum(issuePriorities).optional().default('MEDIUM'),
  severity: z.enum(issueSeverities).optional().default('MEDIUM'),
  assigneeId: nullableObjectId,
  labels: z.array(z.string().trim().min(1).max(50)).max(30).optional().default([]),
  sprintId: nullableObjectId,
});
export const updateIssueSchema = createIssueSchema.partial();
export const issueCommentSchema = z.object({ body: z.string().trim().min(1).max(5000) });
export const issueLabelsSchema = z.object({ labels: z.array(z.string().trim().min(1).max(50)).max(30) });
export const issueStatusSchema = z.object({ status: z.enum(issueStatuses) });
export const issuePrioritySchema = z.object({ priority: z.enum(issuePriorities) });
export const issueSeveritySchema = z.object({ severity: z.enum(issueSeverities) });
export const issueAssigneeSchema = z.object({ assigneeId: nullableObjectId });
export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;