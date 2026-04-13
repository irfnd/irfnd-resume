import { z } from 'zod';

export const imageSchema = z.object({
	url: z.string(),
	alt: z.string(),
});

export const paragraphSchema = z.object({
	value: z.string(),
	keywords: z.array(z.string()),
});

export const techStackItemSchema = z.object({
	label: z.string(),
	url: z.string(),
	icon: z.string(),
	color: z.string().optional(),
	border: z.string().optional(),
	customColor: z.boolean().optional(),
});

export const awardSchema = z.object({
	label: z.string(),
	description: z.string(),
	icon: z.string(),
});

export type ImageData = z.infer<typeof imageSchema>;
export type ParagraphData = z.infer<typeof paragraphSchema>;
export type TechStackItemData = z.infer<typeof techStackItemSchema>;
export type AwardData = z.infer<typeof awardSchema>;
