import { contactSchema } from '@/schemas/contact';
import { describe, expect, it } from 'vitest';

describe('Contact Schema', () => {
	const validData = {
		fullName: 'John Doe',
		email: 'john@example.com',
		telephone: '1234567890',
		subject: 'Hello World',
		message: 'This is a test message with enough characters.',
	};

	describe('valid data', () => {
		it('should validate correct data', () => {
			const result = contactSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should accept minimum valid lengths', () => {
			const result = contactSchema.safeParse({
				fullName: 'Jo',
				email: 'a@b.co',
				telephone: '12345',
				subject: 'Hi',
				message: 'Ten chars!',
			});
			expect(result.success).toBe(true);
		});
	});

	describe('fullName validation', () => {
		it('should reject name shorter than 2 characters', () => {
			const result = contactSchema.safeParse({ ...validData, fullName: 'J' });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Name must be at least 2 characters');
			}
		});

		it('should reject name longer than 100 characters', () => {
			const result = contactSchema.safeParse({ ...validData, fullName: 'A'.repeat(101) });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Name must be less than 100 characters');
			}
		});
	});

	describe('email validation', () => {
		it('should reject invalid email', () => {
			const result = contactSchema.safeParse({ ...validData, email: 'invalid' });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Invalid email address');
			}
		});

		it('should reject email without domain', () => {
			const result = contactSchema.safeParse({ ...validData, email: 'test@' });
			expect(result.success).toBe(false);
		});
	});

	describe('telephone validation', () => {
		it('should reject phone shorter than 5 characters', () => {
			const result = contactSchema.safeParse({ ...validData, telephone: '1234' });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Invalid phone number');
			}
		});

		it('should reject phone longer than 20 characters', () => {
			const result = contactSchema.safeParse({ ...validData, telephone: '1'.repeat(21) });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Phone number too long');
			}
		});
	});

	describe('subject validation', () => {
		it('should reject subject shorter than 2 characters', () => {
			const result = contactSchema.safeParse({ ...validData, subject: 'H' });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Subject must be at least 2 characters');
			}
		});

		it('should reject subject longer than 200 characters', () => {
			const result = contactSchema.safeParse({ ...validData, subject: 'A'.repeat(201) });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Subject must be less than 200 characters');
			}
		});
	});

	describe('message validation', () => {
		it('should reject message shorter than 10 characters', () => {
			const result = contactSchema.safeParse({ ...validData, message: 'Short' });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Message must be at least 10 characters');
			}
		});

		it('should reject message longer than 5000 characters', () => {
			const result = contactSchema.safeParse({ ...validData, message: 'A'.repeat(5001) });
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Message must be less than 5000 characters');
			}
		});
	});

	describe('missing fields', () => {
		it('should reject missing fullName', () => {
			const { fullName: _, ...data } = validData;
			const result = contactSchema.safeParse(data);
			expect(result.success).toBe(false);
		});

		it('should reject missing email', () => {
			const { email: _, ...data } = validData;
			const result = contactSchema.safeParse(data);
			expect(result.success).toBe(false);
		});

		it('should reject missing telephone', () => {
			const { telephone: _, ...data } = validData;
			const result = contactSchema.safeParse(data);
			expect(result.success).toBe(false);
		});

		it('should reject missing subject', () => {
			const { subject: _, ...data } = validData;
			const result = contactSchema.safeParse(data);
			expect(result.success).toBe(false);
		});

		it('should reject missing message', () => {
			const { message: _, ...data } = validData;
			const result = contactSchema.safeParse(data);
			expect(result.success).toBe(false);
		});
	});
});
