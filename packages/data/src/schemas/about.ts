import { z } from 'zod';
import { paragraphSchema } from './common';

export const focusItemSchema = z.object({
	value: z.string(),
	label: z.string(),
	icon: z.string(),
});

export const aboutSchema = z.object({
	title: z.string(),
	description: z.array(paragraphSchema),
	focus: z.array(focusItemSchema),
});

export type FocusItemData = z.infer<typeof focusItemSchema>;
export type AboutData = z.infer<typeof aboutSchema>;
