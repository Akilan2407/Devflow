import { MessageModel, type MessageDocument } from '../models/message.model.js';
import type { CreateMessageInput, UpdateMessageInput } from '../validators/message.validators.js';

const withSender = (query: ReturnType<typeof MessageModel.find>) => query.populate('senderId', 'name email avatar');
export const messageService = {
  async create(organizationId: string, projectId: string, senderId: string, input: CreateMessageInput): Promise<MessageDocument> {
    const message = await MessageModel.create({ ...input, organizationId, projectId, senderId, readBy: [senderId] });
    return message.populate('senderId', 'name email avatar');
  },
  async list(projectId: string, before: Date | undefined, limit: number) {
    const filter: Record<string, unknown> = { projectId };
    if (before) filter.createdAt = { $lt: before };
    const items = await withSender(MessageModel.find(filter).sort({ createdAt: -1 }).limit(limit + 1));
    const hasMore = items.length > limit;
    return { items: hasMore ? items.slice(0, limit) : items, hasMore };
  },
  async update(message: MessageDocument, input: UpdateMessageInput): Promise<MessageDocument> {
    message.content = input.content;
    return message.save();
  },
  async delete(message: MessageDocument): Promise<void> {
    await MessageModel.deleteOne({ _id: message._id, projectId: message.projectId });
  },
  async markRead(projectId: string, messageId: string, userId: string): Promise<MessageDocument | null> {
    return MessageModel.findOneAndUpdate({ _id: messageId, projectId }, { $addToSet: { readBy: userId } }, { new: true }).populate('senderId', 'name email avatar');
  },
};
