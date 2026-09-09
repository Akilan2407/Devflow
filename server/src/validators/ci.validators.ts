import { z } from 'zod';

export const workflowRunIdSchema = z.coerce.number().int().positive();