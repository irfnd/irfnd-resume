import { z } from 'zod';

const seoPageSchema = z.object({
	title: z.string(),
	description: z.string(),
});

const portfolioCategorySchema = z.object({
	label: z.string(),
	value: z.string(),
});

export const uiSchema = z.object({
	seo: z.object({
		home: seoPageSchema,
		portfolio: seoPageSchema,
		contact: seoPageSchema,
	}),
	footer: z.object({
		copyright: z.string(),
		builtWith: z.string(),
	}),
	common: z.object({
		viewMore: z.string(),
		liveDemo: z.string(),
		source: z.string(),
		internal: z.string(),
		technologies: z.string(),
		changeLanguage: z.string(),
		changeTheme: z.string(),
		portfolioCategories: z.array(portfolioCategorySchema),
	}),
});

export type UiData = z.infer<typeof uiSchema>;
