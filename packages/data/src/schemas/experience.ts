import { z } from 'zod';
import { paragraphSchema } from './common';

export const jobDescriptionSchema = z.object({
	icon: z.string().optional(),
	position: z.string(),
	summary: z.array(paragraphSchema),
	points: z.array(paragraphSchema),
	stacks: z.array(z.string()),
});

export const jobSchema = z.object({
	company: z.string(),
	mainPosition: z.string(),
	type: z.string(),
	location: z.string(),
	duration: z.array(z.string()),
	link: z.string().nullable(),
	descriptions: z.array(jobDescriptionSchema),
});

export const experienceSchema = z.object({
	title: z.string(),
	jobs: z.array(jobSchema),
});

export type JobDescriptionData = z.infer<typeof jobDescriptionSchema>;
export type JobData = z.infer<typeof jobSchema>;
export type ExperienceData = z.infer<typeof experienceSchema>;
