import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { PublicUser } from '../types/auth.types.js';

export type TokenPayload = JwtPayload & { sub: string; type: 'access' | 'refresh' };

const signOptions = (type: TokenPayload['type']): SignOptions => ({
  subject: type,
  expiresIn: (type === 'access'
    ? env.ACCESS_TOKEN_EXPIRES_IN
    : env.REFRESH_TOKEN_EXPIRES_IN) as SignOptions['expiresIn'],
});

export const signAccessToken = (user: PublicUser): string =>
  jwt.sign(
    { sub: user._id.toString(), type: 'access' },
    env.ACCESS_TOKEN_SECRET,
    signOptions('access'),
  );

export const signRefreshToken = (user: PublicUser): string =>
  jwt.sign(
    { sub: user._id.toString(), type: 'refresh' },
    env.REFRESH_TOKEN_SECRET,
    signOptions('refresh'),
  );

export const verifyAccessToken = (token: string): TokenPayload => {
  const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
  if (typeof payload === 'string' || payload.type !== 'access' || typeof payload.sub !== 'string') {
    throw new Error('Invalid access token');
  }
  return payload as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const payload = jwt.verify(token, env.REFRESH_TOKEN_SECRET);
  if (
    typeof payload === 'string' ||
    payload.type !== 'refresh' ||
    typeof payload.sub !== 'string'
  ) {
    throw new Error('Invalid refresh token');
  }
  return payload as TokenPayload;
};
