import { z } from 'zod';

const formFieldSchema = z.object({
	label: z.string(),
	name: z.string(),
	type: z.enum(['text', 'email', 'tel', 'textarea']),
	placeholder: z.string(),
});

const fieldValidationSchema = z.object({
	min: z.string(),
	max: z.string(),
});

export const contactFormSchema = z.object({
	header: z.string(),
	description: z.string(),
	formTitle: z.string(),
	form: z.array(formFieldSchema),
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
		fullName: fieldValidationSchema,
		email: z.object({ invalid: z.string() }),
		telephone: fieldValidationSchema,
		subject: fieldValidationSchema,
		message: fieldValidationSchema,
	}),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
