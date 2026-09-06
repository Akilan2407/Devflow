import type { Server as HttpServer } from 'node:http';
import { Server, type Socket } from 'socket.io';
import { env } from '../config/env.js';
import { OrganizationMemberModel } from '../models/organization-member.model.js';
import { OrganizationModel } from '../models/organization.model.js';
import { ProjectModel } from '../models/project.model.js';
import { TaskModel } from '../models/task.model.js';
import { IssueModel } from '../models/issue.model.js';
import { UserModel } from '../models/user.model.js';
import { verifyAccessToken } from '../utils/jwt.utils.js';
import { setSocketServer } from './socket.events.js';

type AuthenticatedSocket = Socket & { userId?: string; userName?: string };
const roomId = (room: string, prefix: string): string | null => room.startsWith(prefix) ? room.slice(prefix.length) : null;
const canJoinRoom = async (socket: AuthenticatedSocket, room: string): Promise<boolean> => {
  const userId = socket.userId;
  if (!userId) return false;
  const organizationId = roomId(room, 'organization:');
  if (organizationId) return Boolean(await OrganizationModel.exists({ _id: organizationId }) && await OrganizationMemberModel.exists({ organizationId, userId }));
  let resolvedOrganizationId: string | undefined;
  const projectId = roomId(room, 'project:');
  if (projectId) resolvedOrganizationId = (await ProjectModel.findById(projectId).select('organizationId'))?.organizationId.toString();
  const taskId = roomId(room, 'task:');
  if (taskId) resolvedOrganizationId = (await TaskModel.findById(taskId).select('organizationId'))?.organizationId.toString();
  const issueId = roomId(room, 'issue:');
  if (issueId) resolvedOrganizationId = (await IssueModel.findById(issueId).select('organizationId'))?.organizationId.toString();
  return Boolean(resolvedOrganizationId && await OrganizationMemberModel.exists({ organizationId: resolvedOrganizationId, userId }));
};

export const createSocketServer = (httpServer: HttpServer): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token ?? socket.handshake.headers.authorization?.replace(/^Bearer /, '');
      if (typeof token !== 'string') return next(new Error('Authentication required'));
      const { sub } = verifyAccessToken(token);
      const user = await UserModel.findOne({ _id: sub, isActive: true }).select('name');
      if (!user) return next(new Error('Authentication required'));
      (socket as AuthenticatedSocket).userId = sub;
      (socket as AuthenticatedSocket).userName = user.name;
      next();
    } catch { next(new Error('Authentication required')); }
  });
  io.on('connection', (socket) => {
    const authenticatedSocket = socket as AuthenticatedSocket;
    socket.on('join-room', async (room: unknown, acknowledge?: (result: { ok: boolean; message?: string }) => void) => {
      if (typeof room !== 'string' || !/^(organization|project|task|issue):[a-f\d]{24}$/i.test(room) || !(await canJoinRoom(socket, room))) {
        acknowledge?.({ ok: false, message: 'Room access denied' });
        return;
      }
      await socket.join(room);
      if (room.startsWith('project:')) io.to(room).emit('USER_ONLINE', { userId: authenticatedSocket.userId, name: authenticatedSocket.userName });
      acknowledge?.({ ok: true });
    });
    socket.on('leave-room', (room: unknown) => { if (typeof room === 'string') void socket.leave(room); });
    socket.on('USER_TYPING', (payload: unknown) => {
      if (!payload || typeof payload !== 'object') return;
      const projectId = (payload as { projectId?: unknown }).projectId;
      const room = typeof projectId === 'string' ? `project:${projectId}` : '';
      if (!socket.rooms.has(room)) return;
      socket.to(room).emit('USER_TYPING', { userId: authenticatedSocket.userId, name: authenticatedSocket.userName, projectId });
    });
    socket.on('USER_STOPPED_TYPING', (payload: unknown) => {
      if (!payload || typeof payload !== 'object') return;
      const projectId = (payload as { projectId?: unknown }).projectId;
      const room = typeof projectId === 'string' ? `project:${projectId}` : '';
      if (!socket.rooms.has(room)) return;
      socket.to(room).emit('USER_STOPPED_TYPING', { userId: authenticatedSocket.userId, projectId });
    });
    socket.on('disconnect', () => {
      for (const room of socket.rooms) if (room.startsWith('project:')) socket.to(room).emit('USER_OFFLINE', { userId: authenticatedSocket.userId, name: authenticatedSocket.userName, projectId: room.slice('project:'.length) });
    });
  });
  setSocketServer(io);
  return io;
};
