import { z } from 'zod';
import { techStackItemSchema } from './common';

export const techStacksSchema = z.object({
	stacks: z.array(techStackItemSchema),
});

export type TechStacksData = z.infer<typeof techStacksSchema>;