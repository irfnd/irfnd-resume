import { z } from 'zod';
import { imageSchema } from './common';

export const profileSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	role: z.string(),
	photo: imageSchema,
	description: z.string(),
});

export type ProfileData = z.infer<typeof profileSchema>;