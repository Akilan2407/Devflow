import type { Task } from './task';

export type SprintStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED';
export type Sprint = { _id: string; organizationId: string; projectId: string; name: string; goal: string; startDate: string; endDate: string; status: SprintStatus; createdBy: string; createdAt: string; updatedAt: string };
export type SprintDetails = { sprint: Sprint; tasks: Task[]; metrics: { totalStoryPoints: number; completedStoryPoints: number; remainingStoryPoints: number; completionPercentage: number } };