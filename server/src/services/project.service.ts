import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { ProjectModel, type ProjectDocument } from '../models/project.model.js';
import { AppError } from '../utils/app-error.js';
import { CACHE_TTL, deleteCache, deleteCachePattern, getCache, setCache } from '../utils/cache.js';
import type { CreateProjectInput, ProjectMemberInput, UpdateProjectInput } from '../validators/project.validators.js';

export const projectService = {
  async create(userId: string, input: CreateProjectInput): Promise<ProjectDocument> {
    const ownerId = input.ownerId ?? userId;
    const memberIds = [...new Set([ownerId, ...input.members])];
    const validMembers = await OrganizationMemberModel.countDocuments({
      organizationId: input.organizationId,
      userId: { $in: memberIds },
    });
    if (validMembers !== memberIds.length) throw new AppError(400, 'All project members must belong to the organization');
    if (await ProjectModel.exists({ organizationId: input.organizationId, key: input.key.toUpperCase() })) {
      throw new AppError(409, 'A project with this key already exists');
    }
    const project = await ProjectModel.create({ ...input, ownerId, members: memberIds, key: input.key.toUpperCase() });
    await deleteCachePattern(`devflow:projects:${input.organizationId}:*`);
    return project;
  },

  async list(organizationId: string, options: { page: number; limit: number; search?: string; status?: string; sort: string }): Promise<{ items: ProjectDocument[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    const key = `devflow:projects:${organizationId}:${JSON.stringify(options)}`;
    const cached = await getCache<{ items: ProjectDocument[]; pagination: { page: number; limit: number; total: number; pages: number } }>(key);
    if (cached) return cached;
    const filter: Record<string, unknown> = { organizationId };
    if (options.search) filter.$or = [
      { name: { $regex: options.search, $options: 'i' } },
      { key: { $regex: options.search, $options: 'i' } },
      { description: { $regex: options.search, $options: 'i' } },
    ];
    if (options.status) filter.status = options.status;
    const sort: Record<string, 1 | -1> = options.sort === 'name' ? { name: 1 } : options.sort === '-name' ? { name: -1 } : { createdAt: -1 };
    const [items, total] = await Promise.all([
      ProjectModel.find(filter).sort(sort).skip((options.page - 1) * options.limit).limit(options.limit).populate('ownerId', 'name email avatar'),
      ProjectModel.countDocuments(filter),
    ]);
    const result = { items, pagination: { page: options.page, limit: options.limit, total, pages: Math.ceil(total / options.limit) } };
    await setCache(key, result, CACHE_TTL.list);
    return result;
  },

  async update(project: ProjectDocument, input: UpdateProjectInput): Promise<ProjectDocument> {
    if (input.key && await ProjectModel.exists({ organizationId: project.organizationId, key: input.key.toUpperCase(), _id: { $ne: project._id } })) {
      throw new AppError(409, 'A project with this key already exists');
    }
    Object.assign(project, input, input.key ? { key: input.key.toUpperCase() } : {});
    const updated = await project.save();
    await deleteCache(`devflow:projects:detail:${project._id}`);
    await deleteCachePattern(`devflow:projects:${project.organizationId}:*`);
    return updated;
  },

  async archive(project: ProjectDocument): Promise<ProjectDocument> {
    project.status = 'ARCHIVED';
    const updated = await project.save();
    await deleteCache(`devflow:projects:detail:${project._id}`);
    await deleteCachePattern(`devflow:projects:${project.organizationId}:*`);
    return updated;
  },

  async delete(project: ProjectDocument): Promise<void> {
    await ProjectModel.deleteOne({ _id: project._id, organizationId: project.organizationId });
    await deleteCache(`devflow:projects:detail:${project._id}`);
    await deleteCachePattern(`devflow:projects:${project.organizationId}:*`);
  },

  async addMember(project: ProjectDocument, input: ProjectMemberInput): Promise<ProjectDocument> {
    if (!(await OrganizationMemberModel.exists({ organizationId: project.organizationId, userId: input.userId }))) throw new AppError(400, 'User must belong to the organization');
    if (project.members.some((member) => member.toString() === input.userId)) throw new AppError(409, 'User is already a project member');
    project.members.push(input.userId as never);
    const updated = await project.save();
    await deleteCache(`devflow:projects:detail:${project._id}`);
    await deleteCachePattern(`devflow:projects:${project.organizationId}:*`);
    return updated;
  },

  async removeMember(project: ProjectDocument, userId: string): Promise<ProjectDocument> {
    const originalCount = project.members.length;
    project.members = project.members.filter((member) => member.toString() !== userId) as typeof project.members;
    if (project.members.length === originalCount) throw new AppError(404, 'Project member not found');
    const updated = await project.save();
    await deleteCache(`devflow:projects:detail:${project._id}`);
    await deleteCachePattern(`devflow:projects:${project.organizationId}:*`);
    return updated;
  },
};