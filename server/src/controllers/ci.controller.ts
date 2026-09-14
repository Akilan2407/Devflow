import type { NextFunction, Request, Response } from 'express';
import type { ProjectRequest } from '../middleware/project.middleware.js';
import { githubService } from '../services/github.service.js';
import { repositoryService } from '../services/repository.service.js';
import { workflowRunIdSchema } from '../validators/ci.validators.js';

const projectContext = (request: Request): ProjectRequest => request as unknown as ProjectRequest;
const githubData = (request: Request, response: Response, next: NextFunction, operation: (owner: string, name: string) => Promise<unknown>): void => {
  const value = projectContext(request);
  void repositoryService.githubData(value.project._id.toString(), value.project.organizationId.toString(), operation).then((data) => response.json({ data })).catch(next);
};

export const listWorkflows = (request: Request, response: Response, next: NextFunction): void => githubData(request, response, next, githubService.getWorkflows);
export const listWorkflowRuns = (request: Request, response: Response, next: NextFunction): void => githubData(request, response, next, githubService.getWorkflowRuns);
export const getWorkflowRun = (request: Request, response: Response, next: NextFunction): void => {
  const runId = workflowRunIdSchema.parse(request.params.runId);
  const value = projectContext(request);
  void repositoryService.githubData(value.project._id.toString(), value.project.organizationId.toString(), (owner, name) => githubService.getWorkflowRun(owner, name, runId)).then((data) => response.json({ data })).catch(next);
};