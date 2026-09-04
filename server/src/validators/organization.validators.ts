import { z } from 'zod';
import { organizationRoles } from '../utils/permissions.js';

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(1000).optional().default(''),
  settings: z.record(z.string(), z.unknown()).optional().default({}),
});

export const updateOrganizationSchema = createOrganizationSchema.partial().omit({ slug: true });
export const memberInviteSchema = z.object({
  email: z.string().trim().email(),
  role: z.enum(organizationRoles),
});
export const memberRoleSchema = z.object({ role: z.enum(organizationRoles) });

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type MemberInviteInput = z.infer<typeof memberInviteSchema>;
export type MemberRoleInput = z.infer<typeof memberRoleSchema>;
