import { z } from 'zod';

export const navItemSchema = z.object({
	label: z.string(),
	url: z.string(),
	icon: z.string(),
});

export const navigationSchema = z.object({
	items: z.array(navItemSchema),
});

export type NavItemData = z.infer<typeof navItemSchema>;
export type NavigationData = z.infer<typeof navigationSchema>;
