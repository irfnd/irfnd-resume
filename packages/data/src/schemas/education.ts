import { z } from 'zod';
import { awardSchema, paragraphSchema } from './common';

export const educationItemSchema = z.object({
	institution: z.string(),
	degree: z.string(),
	fieldOfStudy: z.string(),
	location: z.string(),
	duration: z.array(z.string()),
	link: z.string().nullable(),
	summary: z.array(paragraphSchema),
	points: z.array(paragraphSchema),
	award: z.array(awardSchema),
});

export const educationSchema = z.object({
	title: z.string(),
	educations: z.array(educationItemSchema),
});

export type EducationItemData = z.infer<typeof educationItemSchema>;
export type EducationData = z.infer<typeof educationSchema>;
