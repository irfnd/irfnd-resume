import { z } from 'zod';
import { imageSchema, paragraphSchema } from './common';

export const portfolioProjectSchema = z.object({
	icon: z.string(),
	name: z.string(),
	summary: z.array(paragraphSchema),
	image: z.array(imageSchema),
	type: z.enum(['private', 'public']),
	demo: z.string().nullable(),
	source: z.string().nullable(),
	stacks: z.array(z.string()),
	category: z.enum(['frontend', 'backend', 'fullstack']),
	isSelected: z.boolean().optional(),
});

export const portfolioSchema = z.object({
	header: z.string(),
	title: z.string(),
	subtitle: z.string(),
	projects: z.array(portfolioProjectSchema),
});

export type PortfolioProjectData = z.infer<typeof portfolioProjectSchema>;
export type PortfolioData = z.infer<typeof portfolioSchema>;
