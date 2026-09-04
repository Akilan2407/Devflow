import bcrypt from 'bcrypt';
import { UserModel, type UserDocument } from '../models/user.model.js';
import type { AuthTokens, PublicUser } from '../types/auth.types.js';
import { AppError } from '../utils/app-error.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.utils.js';
import { toPublicUser } from '../utils/user.utils.js';
import type { LoginInput, RegisterInput } from '../validators/auth.validators.js';

const BCRYPT_ROUNDS = 12;

const issueTokens = async (user: UserDocument): Promise<AuthTokens> => {
  const publicUser = toPublicUser(user);
  const accessToken = signAccessToken(publicUser);
  const refreshToken = signRefreshToken(publicUser);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, BCRYPT_ROUNDS);
  user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await user.save();
  return { accessToken, refreshToken };
};

export const authService = {
  async register(input: RegisterInput): Promise<{ user: PublicUser; tokens: AuthTokens }> {
    const existingUser = await UserModel.exists({ email: input.email });
    if (existingUser) throw new AppError(409, 'An account with this email already exists');

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const user = await UserModel.create({ name: input.name, email: input.email, passwordHash });
    return { user: toPublicUser(user), tokens: await issueTokens(user) };
  },

  async login(input: LoginInput): Promise<{ user: PublicUser; tokens: AuthTokens }> {
    const user = await UserModel.findOne({ email: input.email }).select('+passwordHash');
    if (!user || !user.isActive || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw new AppError(401, 'Invalid email or password');
    }
    return { user: toPublicUser(user), tokens: await issueTokens(user) };
  },

  async refresh(refreshToken: string): Promise<{ user: PublicUser; tokens: AuthTokens }> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await UserModel.findOne({ _id: payload.sub, isActive: true }).select(
        '+refreshTokenHash +refreshTokenExpiresAt',
      );
      if (
        !user?.refreshTokenHash ||
        !user.refreshTokenExpiresAt ||
        user.refreshTokenExpiresAt.getTime() < Date.now() ||
        !(await bcrypt.compare(refreshToken, user.refreshTokenHash))
      ) {
        throw new AppError(401, 'Invalid refresh token');
      }
      return { user: toPublicUser(user), tokens: await issueTokens(user) };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(401, 'Invalid refresh token');
    }
  },

  async logout(refreshToken?: string): Promise<void> {
    if (!refreshToken) return;
    try {
      const payload = verifyRefreshToken(refreshToken);
      await UserModel.updateOne(
        { _id: payload.sub },
        { $set: { refreshTokenHash: null, refreshTokenExpiresAt: null } },
      );
    } catch {
      // Logout is idempotent and should not reveal token details.
    }
  },

  async getCurrentUser(userId: string): Promise<PublicUser> {
    const user = await UserModel.findOne({ _id: userId, isActive: true });
    if (!user) throw new AppError(401, 'Authentication required');
    return toPublicUser(user);
  },
};
