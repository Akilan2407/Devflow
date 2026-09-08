import { IssueModel } from '../models/issue.model.js';
import { MessageModel } from '../models/message.model.js';
import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { ProjectModel } from '../models/project.model.js';
import { TaskModel } from '../models/task.model.js';
import { AttachmentModel, type AttachmentEntityType, type AttachmentDocument } from '../models/attachment.model.js';
import { AppError } from '../utils/app-error.js';
import { removeAttachmentFile, writeAttachment } from '../utils/attachment-storage.js';

type Entity = { organizationId: unknown; projectId?: unknown };

const resolveEntity = async (entityType: AttachmentEntityType, entityId: string): Promise<Entity> => {
  const entity = entityType === 'PROJECT' ? await ProjectModel.findById(entityId)
    : entityType === 'TASK' ? await TaskModel.findById(entityId)
      : entityType === 'ISSUE' ? await IssueModel.findById(entityId)
        : await MessageModel.findById(entityId);
  if (!entity) throw new AppError(404, 'Attachment entity not found');
  return entity;
};

export const assertAttachmentAccess = async (userId: string, entityType: AttachmentEntityType, entityId: string): Promise<Entity> => {
  const entity = await resolveEntity(entityType, entityId);
  if (!(await OrganizationMemberModel.exists({ organizationId: entity.organizationId, userId }))) {
    throw new AppError(404, 'Attachment entity not found');
  }
  return entity;
};

export const attachmentService = {
  async create(userId: string, entityType: AttachmentEntityType, entityId: string, file: Express.Multer.File): Promise<AttachmentDocument> {
    const entity = await assertAttachmentAccess(userId, entityType, entityId);
    const stored = await writeAttachment(file, entityType);
    try {
      return await AttachmentModel.create({
        organizationId: entity.organizationId,
        uploadedBy: userId,
        entityType,
        entityId,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        fileExtension: stored.fileExtension,
        filePath: stored.filePath,
      });
    } catch (error) {
      await removeAttachmentFile(stored.filePath);
      throw error;
    }
  },

  async list(userId: string, entityType: AttachmentEntityType, entityId: string) {
    await assertAttachmentAccess(userId, entityType, entityId);
    return AttachmentModel.find({ entityType, entityId }).populate('uploadedBy', 'name email avatar').sort({ createdAt: -1 });
  },

  async getForUser(userId: string, id: string): Promise<AttachmentDocument> {
    const attachment = await AttachmentModel.findById(id);
    if (!attachment) throw new AppError(404, 'Attachment not found');
    await assertAttachmentAccess(userId, attachment.entityType, attachment.entityId.toString());
    return attachment;
  },

  async delete(userId: string, id: string): Promise<void> {
    const attachment = await this.getForUser(userId, id);
    await AttachmentModel.deleteOne({ _id: attachment._id });
    await removeAttachmentFile(attachment.filePath);
  },
};