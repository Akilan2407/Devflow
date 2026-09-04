import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).optional().default(''),
  members: z
    .array(z.string().regex(/^[a-f\d]{24}$/i))
    .optional()
    .default([]),
});

export const updateTeamSchema = createTeamSchema.pick({ name: true, description: true }).partial();
export const teamMemberSchema = z.object({ userId: z.string().regex(/^[a-f\d]{24}$/i) });
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
