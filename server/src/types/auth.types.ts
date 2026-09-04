import type { Types } from 'mongoose';

export type PublicUser = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  avatar: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthenticatedRequest = Express.Request & {
  user: PublicUser;
};
