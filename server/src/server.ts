import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import { createServer } from 'node:http';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { connectRedis, disconnectRedis } from './config/redis.js';
import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware.js';
import { requestIdMiddleware } from './middleware/request.middleware.js';
import { healthRouter } from './routes/health.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { organizationRouter } from './routes/organization.routes.js';
import { teamRouter } from './routes/team.routes.js';
import { projectRouter } from './routes/project.routes.js';
import { sprintRouter } from './routes/sprint.routes.js';
import { issueRouter } from './routes/issue.routes.js';
import { commentRouter } from './routes/comment.routes.js';
import { taskRouter } from './routes/task.routes.js';
import { messageRouter } from './routes/message.routes.js';
import { createSocketServer } from './sockets/socket.server.js';
import { notificationRouter } from './routes/notification.routes.js';
import { activityLogRouter } from './routes/activity-log.routes.js';
import { analyticsRouter } from './routes/analytics.routes.js';
import { searchRouter } from './routes/search.routes.js';

export const createApp = (): express.Express => {
  const app = express();
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(requestIdMiddleware);
  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/organizations', organizationRouter);
  app.use('/api', teamRouter);
  app.use('/api/projects', projectRouter);
  app.use('/api', sprintRouter);
  app.use('/api', issueRouter);
  app.use('/api/comments', commentRouter);
  app.use('/api', taskRouter);
  app.use('/api', messageRouter);
  app.use('/api/notifications', notificationRouter);
  app.use('/api/organizations', activityLogRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/search', searchRouter);
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);
  return app;
};

const startServer = async (): Promise<void> => {
  const app = createApp();
  const httpServer = createServer(app);
  createSocketServer(httpServer);

  try {
    await connectDatabase();
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }

  try {
    await connectRedis();
  } catch (error) {
    console.error('Redis connection failed:', error);
  }

  httpServer.listen(env.PORT, () => {
    console.log(`DevFlow API listening on port ${env.PORT}`);
  });

  const shutdown = async (): Promise<void> => {
    await Promise.allSettled([disconnectDatabase(), disconnectRedis()]);
    httpServer.close(() => process.exit(0));
  };

  process.once('SIGINT', () => void shutdown());
  process.once('SIGTERM', () => void shutdown());
};

void startServer();
