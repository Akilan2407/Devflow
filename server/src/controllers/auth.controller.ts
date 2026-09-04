import type { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { loginSchema, registerSchema } from '../validators/auth.validators.js';
import type { AuthenticatedRequest } from '../types/auth.types.js';

const refreshCookie = 'devflow_refresh_token';
const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/api/auth',
};

const setRefreshCookie = (response: Response, token: string): void => {
  response.cookie(refreshCookie, token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

export const register = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await authService.register(registerSchema.parse(request.body));
    setRefreshCookie(response, result.tokens.refreshToken);
    response
      .status(201)
      .json({ data: { user: result.user, accessToken: result.tokens.accessToken } });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await authService.login(loginSchema.parse(request.body));
    setRefreshCookie(response, result.tokens.refreshToken);
    response
      .status(200)
      .json({ data: { user: result.user, accessToken: result.tokens.accessToken } });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await authService.logout(
      request.signedCookies?.[refreshCookie] ?? request.cookies?.[refreshCookie],
    );
    response.clearCookie(refreshCookie, cookieOptions);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = request.cookies?.[refreshCookie];
    if (!token) {
      response.status(401).json({ error: { message: 'Authentication required' } });
      return;
    }
    const result = await authService.refresh(token);
    setRefreshCookie(response, result.tokens.refreshToken);
    response
      .status(200)
      .json({ data: { user: result.user, accessToken: result.tokens.accessToken } });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userRequest = request as unknown as AuthenticatedRequest;
    response
      .status(200)
      .json({ data: { user: await authService.getCurrentUser(userRequest.user._id.toString()) } });
  } catch (error) {
    next(error);
  }
};
