export type MessageUser = { _id: string; name: string; email?: string; avatar?: string | null };
export type MessageAttachment = { name: string; url: string; type: string; size: number };
export type Message = { _id: string; organizationId: string; projectId: string; senderId: MessageUser | string; content: string; attachments: MessageAttachment[]; readBy: string[]; createdAt: string; updatedAt: string };
export type MessagePage = { items: Message[]; hasMore: boolean };
