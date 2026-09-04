import { UserModel } from '../models/user.model.js';
import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { OrganizationModel, type OrganizationDocument } from '../models/organization.model.js';
import type { OrganizationRole } from '../utils/permissions.js';
import { AppError } from '../utils/app-error.js';
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
    const memberships = await OrganizationMemberModel.find({ userId }).select('organizationId');
    return OrganizationModel.find({
      _id: { $in: memberships.map((membership) => membership.organizationId) },
    });
  },

  async update(
    organization: OrganizationDocument,
    input: UpdateOrganizationInput,
  ): Promise<OrganizationDocument> {
    Object.assign(organization, input);
    return organization.save();
  },

  async delete(organization: OrganizationDocument): Promise<void> {
    await Promise.all([
      OrganizationMemberModel.deleteMany({ organizationId: organization._id }),
      OrganizationModel.deleteOne({ _id: organization._id }),
    ]);
  },

  async invite(organizationId: string, input: MemberInviteInput): Promise<void> {
    const user = await UserModel.findOne({ email: input.email, isActive: true });
    if (!user) throw new AppError(404, 'User not found');
    if (await OrganizationMemberModel.exists({ organizationId, userId: user._id })) {
      throw new AppError(409, 'User is already a member');
    }
    await OrganizationMemberModel.create({ organizationId, userId: user._id, role: input.role });
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
  },

  async members(organizationId: string) {
    return OrganizationMemberModel.find({ organizationId })
      .populate('userId', 'name email avatar isActive')
      .select('-_id organizationId userId role joinedAt');
  },
};
