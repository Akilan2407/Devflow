export type NotificationType = 'TASK_ASSIGNED' | 'TASK_UPDATED' | 'ISSUE_ASSIGNED' | 'ISSUE_UPDATED' | 'COMMENT' | 'MENTION' | 'SPRINT_STARTED' | 'SPRINT_COMPLETED' | 'PROJECT_INVITATION' | 'SYSTEM';
export type Notification = { _id: string; organizationId: string; userId: string; projectId: string | null; type: NotificationType; title: string; message: string; entityType: string; entityId: string | null; isRead: boolean; createdAt: string };
export type NotificationPage = { items: Notification[]; unread: number; pagination: { page: number; limit: number; total: number; pages: number } };
