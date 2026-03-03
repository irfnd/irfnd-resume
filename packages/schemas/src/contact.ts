import { z } from 'zod';

export interface ContactValidationMessages {
	fullName: { min: string; max: string };
	email: { invalid: string };
	telephone: { min: string; max: string };
	subject: { min: string; max: string };
	message: { min: string; max: string };
}

const defaultMessages: ContactValidationMessages = {
	fullName: { min: 'Name must be at least 2 characters', max: 'Name must be less than 100 characters' },
	email: { invalid: 'Invalid email address' },
	telephone: { min: 'Invalid phone number', max: 'Phone number too long' },
	subject: { min: 'Subject must be at least 2 characters', max: 'Subject must be less than 200 characters' },
	message: { min: 'Message must be at least 10 characters', max: 'Message must be less than 5000 characters' },
};

export function createContactSchema(messages: ContactValidationMessages = defaultMessages) {
	return z.object({
		fullName: z.string().min(2, messages.fullName.min).max(100, messages.fullName.max),
		email: z.email(messages.email.invalid),
		telephone: z.string().min(5, messages.telephone.min).max(20, messages.telephone.max),
		subject: z.string().min(2, messages.subject.min).max(200, messages.subject.max),
		message: z.string().min(10, messages.message.min).max(5000, messages.message.max),
	});
}

// Default schema with English messages (for API)
export const contactSchema = createContactSchema();

export type ContactFormData = z.infer<typeof contactSchema>;
