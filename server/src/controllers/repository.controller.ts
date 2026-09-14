import type { Request, Response, NextFunction } from 'express';
import type { ProjectRequest } from '../middleware/project.middleware.js';
import { repositoryService } from '../services/repository.service.js';
import { githubService } from '../services/github.service.js';
import { connectRepositorySchema } from '../validators/repository.validators.js';

const context = (request: Request) => request as unknown as ProjectRequest;

export const connectRepository = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const value = context(request);
    const repository = await repositoryService.connect(value.project._id.toString(), value.project.organizationId.toString(), value.user._id.toString(), connectRepositorySchema.parse(request.body));
    response.status(201).json({ data: repository });
  } catch (error) { next(error); }
};

export const disconnectRepository = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const value = context(request); await repositoryService.disconnect(value.project._id.toString(), value.project.organizationId.toString()); response.status(204).send(); } catch (error) { next(error); }
};

export const getRepository = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try { const value = context(request); response.json({ data: await repositoryService.get(value.project._id.toString(), value.project.organizationId.toString()) }); } catch (error) { next(error); }
};

const githubResponse = (request: Request, response: Response, next: NextFunction, operation: (owner: string, name: string) => Promise<unknown>): void => {
  const value = context(request);
  void repositoryService.githubData(value.project._id.toString(), value.project.organizationId.toString(), operation).then((data) => response.json({ data })).catch(next);
};

export const getBranches = (request: Request, response: Response, next: NextFunction): void => githubResponse(request, response, next, githubService.getBranches);
export const getCommits = (request: Request, response: Response, next: NextFunction): void => githubResponse(request, response, next, githubService.getCommits);
export const getPullRequests = (request: Request, response: Response, next: NextFunction): void => githubResponse(request, response, next, githubService.getPullRequests);
export const getIssues = (request: Request, response: Response, next: NextFunction): void => githubResponse(request, response, next, githubService.getIssues);