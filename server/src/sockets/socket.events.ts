import type { Server } from 'socket.io';

export const SocketEvent = {
  TASK_CREATED: 'TASK_CREATED', TASK_UPDATED: 'TASK_UPDATED', TASK_DELETED: 'TASK_DELETED', TASK_MOVED: 'TASK_MOVED',
  ISSUE_CREATED: 'ISSUE_CREATED', ISSUE_UPDATED: 'ISSUE_UPDATED', ISSUE_DELETED: 'ISSUE_DELETED',
  COMMENT_CREATED: 'COMMENT_CREATED', COMMENT_UPDATED: 'COMMENT_UPDATED', COMMENT_DELETED: 'COMMENT_DELETED',
  PROJECT_UPDATED: 'PROJECT_UPDATED',
} as const;
export type SocketEventName = (typeof SocketEvent)[keyof typeof SocketEvent];
let socketServer: Server | null = null;
export const setSocketServer = (server: Server): void => { socketServer = server; };
export const emitSocketEvent = (event: SocketEventName, rooms: string[], data: unknown): void => {
  if (!socketServer) return;
  for (const room of new Set(rooms)) socketServer.to(room).emit(event, data);
};
export const organizationRoom = (id: string): string => `organization:${id}`;
export const projectRoom = (id: string): string => `project:${id}`;
export const taskRoom = (id: string): string => `task:${id}`;
export const issueRoom = (id: string): string => `issue:${id}`;
