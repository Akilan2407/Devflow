import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(env.MONGODB_URI);
};

export const getDatabaseHealth = (): { connected: boolean; state: string } => ({
  connected: mongoose.connection.readyState === 1,
  state:
    ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] ??
    'unknown',
});

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
};
