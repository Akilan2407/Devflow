import { z } from 'zod';

const email = z
  .string()
  .trim()
  .email()
  .transform((value) => value.toLowerCase());
const password = z.string().min(8).max(72);

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email,
  password,
});

export const loginSchema = z.object({ email, password });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
