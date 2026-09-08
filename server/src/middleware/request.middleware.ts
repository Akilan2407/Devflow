import type { RequestHandler } from 'express';
import { randomUUID } from 'node:crypto';

export const requestIdMiddleware: RequestHandler = (request, response, next) => {
  const startedAt = process.hrtime.bigint();
  const requestId = request.header('x-request-id') ?? randomUUID();
  request.requestId = requestId;
  response.setHeader('x-request-id', requestId);
  response.once('finish', () => {
    const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    console.info(`${request.method} ${request.originalUrl} ${response.statusCode} ${elapsedMs.toFixed(2)}ms`);
  });
  next();
};
