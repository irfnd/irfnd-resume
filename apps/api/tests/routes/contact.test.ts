import { createRateLimitMiddleware } from '@/middleware/rate-limit';
import { contactSchema } from '@/schemas/contact';
import { sendContactEmail, setEmailClient } from '@/services/email';
import type { EmailClient } from '@/types';
import { Hono } from 'hono';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function createTestContactRoute() {
	const route = new Hono();
	route.use('*', createRateLimitMiddleware({ max: 100, windowMs: 60000 }));
	route.post('/', async (c) => {
		try {
			const body = await c.req.json();
			const result = contactSchema.safeParse(body);
			if (!result.success) {
				const errors = result.error.issues.map((e) => ({
					field: e.path.join('.'),
					message: e.message,
				}));
				return c.json({ error: 'Validation failed', errors }, 400);
			}
			const emailResult = await sendContactEmail(result.data);
			if (!emailResult.success) {
				return c.json({ error: emailResult.error || 'Failed to send email' }, 500);
			}
			return c.json({ success: true, messageId: emailResult.messageId });
		} catch {
			return c.json({ error: 'Invalid request body' }, 400);
		}
	});
	return route;
}

describe('Contact Route', () => {
	let app: Hono;
	let mockEmailClient: EmailClient;

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.stubEnv('EMAIL_TO', 'test@example.com');
		vi.stubEnv('EMAIL_FROM', 'sender@example.com');

		mockEmailClient = {
			emails: {
				send: vi.fn().mockResolvedValue({ data: { id: 'msg_test123' }, error: null }),
			},
		};
		setEmailClient(mockEmailClient);

		app = new Hono();
		app.route('/contact', createTestContactRoute());
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		vi.restoreAllMocks();
	});

	const validBody = {
		fullName: 'John Doe',
		email: 'john@example.com',
		telephone: '1234567890',
		subject: 'Test Subject',
		message: 'This is a test message with enough characters.',
	};

	describe('POST /contact', () => {
		it('should return success when email is sent', async () => {
			const res = await app.request('/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validBody),
			});

			expect(res.status).toBe(200);
			const body = (await res.json()) as { success: boolean; messageId: string };
			expect(body.success).toBe(true);
			expect(body.messageId).toBe('msg_test123');
		});

		it('should call email service with form data', async () => {
			await app.request('/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validBody),
			});

			expect(mockEmailClient.emails.send).toHaveBeenCalledOnce();
			expect(mockEmailClient.emails.send).toHaveBeenCalledWith(
				expect.objectContaining({
					to: 'test@example.com',
					replyTo: 'john@example.com',
					subject: '[Contact Form] Test Subject',
				}),
			);
		});

		it('should return 400 for invalid email', async () => {
			const res = await app.request('/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...validBody, email: 'invalid' }),
			});

			expect(res.status).toBe(400);
			const body = (await res.json()) as { error: string; errors: unknown[] };
			expect(body.error).toBe('Validation failed');
			expect(body.errors).toContainEqual(
				expect.objectContaining({
					field: 'email',
					message: 'Invalid email address',
				}),
			);
		});

		it('should return 400 for missing required fields', async () => {
			const res = await app.request('/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ fullName: 'John' }),
			});

			expect(res.status).toBe(400);
			const body = (await res.json()) as { error: string; errors: unknown[] };
			expect(body.error).toBe('Validation failed');
			expect(body.errors.length).toBeGreaterThan(0);
		});

		it('should return 400 for invalid JSON', async () => {
			const res = await app.request('/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: 'not json',
			});

			expect(res.status).toBe(400);
			const body = (await res.json()) as { error: string };
			expect(body.error).toBe('Invalid request body');
		});

		it('should return 500 when email service fails', async () => {
			vi.mocked(mockEmailClient.emails.send).mockResolvedValue({
				data: null,
				error: { message: 'Email service unavailable' },
			});

			const res = await app.request('/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validBody),
			});

			expect(res.status).toBe(500);
			const body = (await res.json()) as { error: string };
			expect(body.error).toBe('Email service unavailable');
		});

		it('should return rate limit headers', async () => {
			const res = await app.request('/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validBody),
			});

			expect(res.headers.get('X-RateLimit-Limit')).toBeTruthy();
			expect(res.headers.get('X-RateLimit-Remaining')).toBeTruthy();
		});

		it('should handle validation error for short message', async () => {
			const res = await app.request('/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...validBody, message: 'short' }),
			});

			expect(res.status).toBe(400);
			const body = (await res.json()) as { errors: unknown[] };
			expect(body.errors).toContainEqual(
				expect.objectContaining({
					field: 'message',
				}),
			);
		});

		it('should handle validation error for long name', async () => {
			const res = await app.request('/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...validBody, fullName: 'A'.repeat(101) }),
			});

			expect(res.status).toBe(400);
			const body = (await res.json()) as { errors: unknown[] };
			expect(body.errors).toContainEqual(
				expect.objectContaining({
					field: 'fullName',
				}),
			);
		});
	});
});
