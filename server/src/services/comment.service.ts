import { CommentModel, type CommentDocument } from '../models/comment.model.js';
import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { AppError } from '../utils/app-error.js';
import type { CreateCommentInput, UpdateCommentInput } from '../validators/comment.validators.js';

const ensureMentions = async (organizationId: string, mentions: string[]): Promise<void> => {
  if (!mentions.length) return;
  const count = await OrganizationMemberModel.countDocuments({ organizationId, userId: { $in: mentions } });
  if (count !== new Set(mentions).size) throw new AppError(400, 'All mentioned users must belong to the organization');
};

export const commentService = {
  async create(organizationId: string, authorId: string, input: CreateCommentInput): Promise<CommentDocument> {
    await ensureMentions(organizationId, input.mentions);
    return CommentModel.create({ ...input, organizationId, authorId });
  },
  async list(entityType: string, entityId: string) {
    return CommentModel.find({ entityType, entityId }).sort({ createdAt: 1 }).populate('authorId', 'name email avatar').populate('mentions', 'name email avatar');
  },
  async update(comment: CommentDocument, organizationId: string, input: UpdateCommentInput): Promise<CommentDocument> {
    if (input.mentions) await ensureMentions(organizationId, input.mentions);
    Object.assign(comment, input);
    return comment.save();
  },
  async delete(comment: CommentDocument): Promise<void> {
    await CommentModel.deleteOne({ _id: comment._id, organizationId: comment.organizationId });
  },
};