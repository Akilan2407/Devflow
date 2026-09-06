import { NotificationModel, type Notification, type NotificationType } from '../models/notification.model.js';
import { emitSocketEvent, notificationRoom, SocketEvent } from '../sockets/socket.events.js';

export type NotificationInput = Omit<Notification, '_id' | 'createdAt' | 'updatedAt' | 'isRead' | 'dedupeKey'> & { dedupeKey: string };
export type NotificationRequest = { organizationId: string; userId: string; projectId?: string | null; type: NotificationType; title: string; message: string; entityType: string; entityId?: string | null; dedupeKey: string };
export const notificationService = {
  async create(input: NotificationInput) {
    const existing = await NotificationModel.findOne({ dedupeKey: input.dedupeKey });
    if (existing) return existing;
    try {
      const notification = await NotificationModel.create(input);
      emitSocketEvent(SocketEvent.NOTIFICATION_CREATED, [notificationRoom(input.userId.toString())], notification);
      return notification;
    } catch (error) {
      if ((error as { code?: number }).code === 11000) return NotificationModel.findOne({ dedupeKey: input.dedupeKey });
      throw error;
    }
  },
  async createMany(inputs: NotificationRequest[]) { return Promise.all(inputs.map((input) => notificationService.notify(input))); },
  async notify(input: NotificationRequest) { return notificationService.create(input as unknown as NotificationInput); },
  async list(userId: string, page: number, limit: number) {
    const filter = { userId };
    const [items, total, unread] = await Promise.all([NotificationModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), NotificationModel.countDocuments(filter), NotificationModel.countDocuments({ ...filter, isRead: false })]);
    return { items, unread, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  },
  async markRead(userId: string, id: string) { return NotificationModel.findOneAndUpdate({ _id: id, userId }, { isRead: true }, { new: true }); },
  async markAllRead(userId: string) { await NotificationModel.updateMany({ userId, isRead: false }, { isRead: true }); return { success: true }; },
  async delete(userId: string, id: string) { return NotificationModel.deleteOne({ _id: id, userId }); },
};
