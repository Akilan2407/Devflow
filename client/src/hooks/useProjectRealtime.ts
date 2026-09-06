import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '../lib/socket';
import { useAuthStore } from '../stores/auth.store';
import { taskKeys } from '../features/tasks';
import { issueKeys } from '../features/issues';
import { commentKeys, type CommentEntityType } from '../features/comments';
import { projectKeys } from '../features/projects';
import { messageKeys } from '../features/messages';

type Resource = { projectId?: string; entityType?: CommentEntityType; entityId?: string };

export const useProjectRealtime = (projectId: string | undefined): void => {
  const client = useQueryClient();
  const token = useAuthStore((state) => state.accessToken);
  useEffect(() => {
    if (!projectId || !token) return;
    const socket = getSocket();
    const room = `project:${projectId}`;
    void socket.emitWithAck('join-room', room);
    const refreshTasks = (resource: Resource) => {
      if (!resource.projectId || resource.projectId === projectId) void client.invalidateQueries({ queryKey: taskKeys.all });
    };
    const refreshIssues = () => { void client.invalidateQueries({ queryKey: issueKeys.all }); };
    const refreshComments = (resource: Resource) => {
      if (resource.entityType && resource.entityId) void client.invalidateQueries({ queryKey: commentKeys.list(resource.entityType, resource.entityId) });
      else void client.invalidateQueries({ queryKey: ['comments'] });
    };
    const handlers: [string, (resource: Resource) => void][] = [
      ['TASK_CREATED', refreshTasks], ['TASK_UPDATED', refreshTasks], ['TASK_MOVED', refreshTasks], ['TASK_DELETED', refreshTasks],
      ['ISSUE_CREATED', refreshIssues], ['ISSUE_UPDATED', refreshIssues], ['ISSUE_DELETED', refreshIssues],
      ['COMMENT_CREATED', refreshComments], ['COMMENT_UPDATED', refreshComments], ['COMMENT_DELETED', refreshComments],
      ['PROJECT_UPDATED', () => void client.invalidateQueries({ queryKey: projectKeys.all })],
      ['MESSAGE_SENT', () => void client.invalidateQueries({ queryKey: messageKeys.list(projectId) })],
      ['MESSAGE_UPDATED', () => void client.invalidateQueries({ queryKey: messageKeys.list(projectId) })],
      ['MESSAGE_DELETED', () => void client.invalidateQueries({ queryKey: messageKeys.list(projectId) })],
      ['MESSAGE_READ', () => void client.invalidateQueries({ queryKey: messageKeys.list(projectId) })],
    ];
    handlers.forEach(([event, handler]) => socket.on(event, handler));
    return () => {
      handlers.forEach(([event, handler]) => socket.off(event, handler));
      socket.emit('leave-room', room);
    };
  }, [client, projectId, token]);
};
