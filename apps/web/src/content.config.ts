import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file } from 'astro/loaders';

// Reusable sub-schemas (for remaining web-specific collections)
const imageSchema = z.object({
	url: z.string(),
	alt: z.string(),
});

const paragraphSchema = z.object({
	value: z.string(),
	keywords: z.array(z.string()),
});

// Collection definitions
const navigation = defineCollection({
	loader: file('src/content/data/navigation.json'),
	schema: z.object({
		items: z.array(
			z.object({
				label: z.string(),
				url: z.string(),
				icon: z.string(),
			})
		),
	}),
});

const about = defineCollection({
	loader: file('src/content/data/about.json'),
	schema: z.object({
		title: z.string(),
		description: z.array(paragraphSchema),
		focus: z.array(
			z.object({
				value: z.string(),
				label: z.string(),
				icon: z.string(),
			})
		),
	}),
});

const portfolio = defineCollection({
	loader: file('src/content/data/portfolio.json'),
	schema: z.object({
		header: z.string(),
		title: z.string(),
		subtitle: z.string(),
		projects: z.array(
			z.object({
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
			})
		),
	}),
});

const contactForm = defineCollection({
	loader: file('src/content/data/contact-form.json'),
	schema: z.object({
		header: z.string(),
		description: z.string(),
		formTitle: z.string(),
		form: z.array(
			z.object({
				label: z.string(),
				name: z.string(),
				type: z.enum(['text', 'email', 'tel', 'textarea']),
				placeholder: z.string(),
			})
		),
		submitButton: z.string(),
		submittingButton: z.string(),
		successMessage: z.string(),
		sendAnotherMessage: z.string(),
		reachMeDirectly: z.string(),
		errors: z.object({
			rateLimited: z.string(),
			networkError: z.string(),
			serverError: z.string(),
			validationError: z.string(),
		}),
		validation: z.object({
			fullName: z.object({
				min: z.string(),
				max: z.string(),
			}),
			email: z.object({
				invalid: z.string(),
			}),
			telephone: z.object({
				min: z.string(),
				max: z.string(),
			}),
			subject: z.object({
				min: z.string(),
				max: z.string(),
			}),
			message: z.object({
				min: z.string(),
				max: z.string(),
			}),
		}),
	}),
});

const ui = defineCollection({
	loader: file('src/content/data/ui.json'),
	schema: z.object({
		seo: z.object({
			home: z.object({
				title: z.string(),
				description: z.string(),
			}),
			portfolio: z.object({
				title: z.string(),
				description: z.string(),
			}),
			contact: z.object({
				title: z.string(),
				description: z.string(),
			}),
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
			portfolioCategories: z.array(
				z.object({
					label: z.string(),
					value: z.string(),
				})
			),
		}),
	}),
});

export const collections = {
	navigation,
	about,
	portfolio,
	'contact-form': contactForm,
	ui,
};
