import type { NextFunction, Request, Response } from 'express';
import type { ProjectRequest } from '../middleware/project.middleware.js';
import { githubService } from '../services/github.service.js';
import { repositoryService } from '../services/repository.service.js';
import { workflowRunIdSchema } from '../validators/ci.validators.js';

const projectId = (request: Request): string => (request as unknown as ProjectRequest).project._id.toString();
const githubData = (request: Request, response: Response, next: NextFunction, operation: (owner: string, name: string) => Promise<unknown>): void => {
  void repositoryService.githubData(projectId(request), operation).then((data) => response.json({ data })).catch(next);
};

export const listWorkflows = (request: Request, response: Response, next: NextFunction): void => githubData(request, response, next, githubService.getWorkflows);
export const listWorkflowRuns = (request: Request, response: Response, next: NextFunction): void => githubData(request, response, next, githubService.getWorkflowRuns);
export const getWorkflowRun = (request: Request, response: Response, next: NextFunction): void => {
  const runId = workflowRunIdSchema.parse(request.params.runId);
  void repositoryService.githubData(projectId(request), (owner, name) => githubService.getWorkflowRun(owner, name, runId)).then((data) => response.json({ data })).catch(next);
};