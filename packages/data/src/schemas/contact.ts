import { z } from 'zod';

export const contactItemSchema = z.object({
	type: z.enum(['location', 'contact']),
	label: z.string(),
	url: z.string(),
	icon: z.string(),
	showInStickyProfile: z.boolean().optional(),
	showInContactPage: z.boolean().optional(),
	showInFooter: z.boolean().optional(),
});

export const contactSchema = z.object({
	items: z.array(contactItemSchema),
});

export type ContactItemData = z.infer<typeof contactItemSchema>;
export type ContactData = z.infer<typeof contactSchema>;
