import { ProjectModel } from '../models/project.model.js';
import { RepositoryModel, type RepositoryDocument } from '../models/repository.model.js';
import { AppError } from '../utils/app-error.js';
import type { ConnectRepositoryInput } from '../validators/repository.validators.js';
import { githubService } from './github.service.js';

const repositoryForProject = async (projectId: string, organizationId: string): Promise<RepositoryDocument> => {
  const repository = await RepositoryModel.findOne({ projectId, organizationId });
  if (!repository) throw new AppError(404, 'No GitHub repository is connected');
  return repository;
};

export const repositoryService = {
  async connect(projectId: string, organizationId: string, userId: string, input: ConnectRepositoryInput): Promise<RepositoryDocument> {
    const githubRepository = await githubService.getRepository(input.owner, input.name);
    const existing = await RepositoryModel.findOne({ projectId });
    if (existing) {
      existing.organizationId = organizationId as never;
      existing.githubRepositoryId = githubRepository.id;
      existing.owner = githubRepository.owner.login;
      existing.name = githubRepository.name;
      existing.url = githubRepository.html_url;
      existing.connectedBy = userId as never;
      return existing.save();
    }
    return RepositoryModel.create({
      organizationId,
      projectId,
      githubRepositoryId: githubRepository.id,
      owner: githubRepository.owner.login,
      name: githubRepository.name,
      url: githubRepository.html_url,
      connectedBy: userId,
    });
  },

  async disconnect(projectId: string, organizationId: string): Promise<void> {
    const result = await RepositoryModel.deleteOne({ projectId, organizationId });
    if (!result.deletedCount) throw new AppError(404, 'No GitHub repository is connected');
  },

  get: (projectId: string, organizationId: string) => repositoryForProject(projectId, organizationId),

  async githubData<T>(projectId: string, organizationId: string, request: (owner: string, name: string) => Promise<T>): Promise<T> {
    const repository = await repositoryForProject(projectId, organizationId);
    return request(repository.owner, repository.name);
  },

  async assertProject(projectId: string, organizationId: string): Promise<void> {
    if (!(await ProjectModel.exists({ _id: projectId, organizationId }))) throw new AppError(404, 'Project not found');
  },
};