import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { TeamModel, type TeamDocument } from '../models/team.model.js';
import { AppError } from '../utils/app-error.js';
import type {
  CreateTeamInput,
  TeamMemberInput,
  UpdateTeamInput,
} from '../validators/team.validators.js';

export const teamService = {
  async create(
    organizationId: string,
    userId: string,
    input: CreateTeamInput,
  ): Promise<TeamDocument> {
    const validMembers = input.members.length
      ? await OrganizationMemberModel.find({
          organizationId,
          userId: { $in: input.members },
        }).select('userId')
      : [];
    if (validMembers.length !== input.members.length)
      throw new AppError(400, 'All team members must belong to the organization');
    return TeamModel.create({ ...input, organizationId, createdBy: userId });
  },

  async list(organizationId: string, page: number, limit: number) {
    const [items, total] = await Promise.all([
      TeamModel.find({ organizationId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      TeamModel.countDocuments({ organizationId }),
    ]);
    return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  },

  async update(team: TeamDocument, input: UpdateTeamInput): Promise<TeamDocument> {
    Object.assign(team, input);
    return team.save();
  },

  async delete(team: TeamDocument): Promise<void> {
    await TeamModel.deleteOne({ _id: team._id, organizationId: team.organizationId });
  },

  async addMember(team: TeamDocument, input: TeamMemberInput): Promise<TeamDocument> {
    const isMember = await OrganizationMemberModel.exists({
      organizationId: team.organizationId,
      userId: input.userId,
    });
    if (!isMember) throw new AppError(400, 'User must belong to the organization');
    if (team.members.some((member) => member.toString() === input.userId))
      throw new AppError(409, 'User is already on the team');
    team.members.push(input.userId as never);
    return team.save();
  },

  async removeMember(team: TeamDocument, userId: string): Promise<TeamDocument> {
    const originalCount = team.members.length;
    team.members = team.members.filter(
      (member) => member.toString() !== userId,
    ) as typeof team.members;
    if (team.members.length === originalCount) throw new AppError(404, 'Team member not found');
    return team.save();
  },
};
