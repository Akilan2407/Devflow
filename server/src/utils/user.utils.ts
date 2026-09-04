import type { UserDocument } from '../models/user.model.js';
import type { PublicUser } from '../types/auth.types.js';

export const toPublicUser = (user: UserDocument): PublicUser => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar ?? null,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
