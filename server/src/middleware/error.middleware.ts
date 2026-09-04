import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error.js';

export const notFoundMiddleware: RequestHandler = (_request, response) => {
  response.status(404).json({ error: { message: 'Route not found' } });
};

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  void _next;
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ error: { message: error.message } });
    return;
  }
  if (error instanceof ZodError) {
    response
      .status(400)
      .json({ error: { message: 'Invalid request', details: error.flatten().fieldErrors } });
    return;
  }
  console.error(error);
  response.status(500).json({ error: { message: 'Internal server error' } });
};
