import { z } from 'zod';

export const connectRepositorySchema = z.object({
  owner: z.string().trim().min(1).max(100).regex(/^[A-Za-z0-9_.-]+$/),
  name: z.string().trim().min(1).max(100).regex(/^[A-Za-z0-9_.-]+$/),
});

export type ConnectRepositoryInput = z.infer<typeof connectRepositorySchema>;