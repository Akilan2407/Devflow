import { UserModel } from '../models/user.model.js';
import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { OrganizationModel, type OrganizationDocument } from '../models/organization.model.js';
import type { OrganizationRole } from '../utils/permissions.js';
import { AppError } from '../utils/app-error.js';
import { CACHE_TTL, deleteCache, getCache, setCache } from '../utils/cache.js';
import type {
  CreateOrganizationInput,
  MemberInviteInput,
  UpdateOrganizationInput,
} from '../validators/organization.validators.js';

export const organizationService = {
  async create(userId: string, input: CreateOrganizationInput): Promise<OrganizationDocument> {
    if (await OrganizationModel.exists({ slug: input.slug })) {
      throw new AppError(409, 'An organization with this slug already exists');
    }
    const organization = await OrganizationModel.create({ ...input, ownerId: userId });
    await OrganizationMemberModel.create({
      organizationId: organization._id,
      userId,
      role: 'ORGANIZATION_ADMIN',
    });
    return organization;
  },

  async listForUser(userId: string): Promise<OrganizationDocument[]> {
    const key = `devflow:organizations:user:${userId}`;
    const cached = await getCache<OrganizationDocument[]>(key);
    if (cached) return cached;
    const memberships = await OrganizationMemberModel.find({ userId }).select('organizationId');
    const organizations = await OrganizationModel.find({
      _id: { $in: memberships.map((membership) => membership.organizationId) },
    });
    await setCache(key, organizations, CACHE_TTL.organization);
    return organizations;
  },

  async update(
    organization: OrganizationDocument,
    input: UpdateOrganizationInput,
  ): Promise<OrganizationDocument> {
    Object.assign(organization, input);
    const updated = await organization.save();
    await deleteCache(`devflow:organizations:${organization._id}:members`);
    return updated;
  },

  async delete(organization: OrganizationDocument): Promise<void> {
    await Promise.all([
      OrganizationMemberModel.deleteMany({ organizationId: organization._id }),
      OrganizationModel.deleteOne({ _id: organization._id }),
    ]);
    await deleteCache(`devflow:organizations:${organization._id}:members`);
  },

  async invite(organizationId: string, input: MemberInviteInput): Promise<void> {
    const user = await UserModel.findOne({ email: input.email, isActive: true });
    if (!user) throw new AppError(404, 'User not found');
    if (await OrganizationMemberModel.exists({ organizationId, userId: user._id })) {
      throw new AppError(409, 'User is already a member');
    }
    await OrganizationMemberModel.create({ organizationId, userId: user._id, role: input.role });
    await deleteCache(`devflow:organizations:user:${user._id}`);
    await deleteCache(`devflow:organizations:${organizationId}:members`);
  },

  async remove(organization: OrganizationDocument, userId: string): Promise<void> {
    if (organization.ownerId.toString() === userId) {
      throw new AppError(400, 'The organization owner cannot be removed');
    }
    const result = await OrganizationMemberModel.deleteOne({
      organizationId: organization._id,
      userId,
    });
    if (!result.deletedCount) throw new AppError(404, 'Member not found');
    await deleteCache(`devflow:organizations:user:${userId}`);
    await deleteCache(`devflow:organizations:${organization._id}:members`);
  },

  async changeRole(
    organization: OrganizationDocument,
    userId: string,
    role: OrganizationRole,
  ): Promise<void> {
    if (organization.ownerId.toString() === userId && role !== 'ORGANIZATION_ADMIN') {
      throw new AppError(400, 'The organization owner must remain an organization admin');
    }
    const result = await OrganizationMemberModel.updateOne(
      { organizationId: organization._id, userId },
      { $set: { role } },
    );
    if (!result.matchedCount) throw new AppError(404, 'Member not found');
    await deleteCache(`devflow:organizations:${organization._id}:members`);
  },

  async members(organizationId: string) {
    const key = `devflow:organizations:${organizationId}:members`;
    const cached = await getCache<unknown[]>(key);
    if (cached) return cached;
    const members = await OrganizationMemberModel.find({ organizationId })
      .populate('userId', 'name email avatar isActive')
      .select('-_id organizationId userId role joinedAt');
    await setCache(key, members, CACHE_TTL.organization);
    return members;
  },
};
