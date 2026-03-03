import { z } from 'zod';

export const contactSchema = z.object({
	fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
	email: z.email('Invalid email address'),
	telephone: z.string().min(5, 'Invalid phone number').max(20, 'Phone number too long'),
	subject: z.string().min(2, 'Subject must be at least 2 characters').max(200, 'Subject must be less than 200 characters'),
	message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message must be less than 5000 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
