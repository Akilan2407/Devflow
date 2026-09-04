import type { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

export type AsyncRequestHandler = (
  request: Request,
  response: Express.Response,
  next: Express.NextFunction,
) => Promise<void>;
