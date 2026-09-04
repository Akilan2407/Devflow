import type { RequestHandler } from 'express';
import { UserModel } from '../models/user.model.js';
import { verifyAccessToken } from '../utils/jwt.utils.js';
import type { AuthenticatedRequest } from '../types/auth.types.js';

export const requireAuth: RequestHandler = async (request, response, next) => {
  try {
    const header = request.header('authorization');
    if (!header?.startsWith('Bearer ')) {
      response.status(401).json({ error: { message: 'Authentication required' } });
      return;
    }

    const { sub } = verifyAccessToken(header.slice(7));
    const user = await UserModel.findOne({ _id: sub, isActive: true });
    if (!user) {
      response.status(401).json({ error: { message: 'Authentication required' } });
      return;
    }

    (request as unknown as AuthenticatedRequest).user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar ?? null,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    next();
  } catch {
    response.status(401).json({ error: { message: 'Authentication required' } });
  }
};

export const requireAuthentication = requireAuth;
