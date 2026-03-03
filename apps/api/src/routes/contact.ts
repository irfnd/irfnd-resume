import { rateLimitMiddleware } from '@/middleware/rate-limit';
import { contactSchema } from '@/schemas/contact';
import { sendContactEmail } from '@/services/email';
import { Hono } from 'hono';

export const contactRoute = new Hono();

contactRoute.use('*', rateLimitMiddleware);

contactRoute.post('/', async (c) => {
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
			/* v8 ignore next -- @preserve */
			return c.json({ error: emailResult.error || 'Failed to send email' }, 500);
		}

		return c.json({
			success: true,
			messageId: emailResult.messageId,
		});
	} catch (err) {
		console.error('Contact endpoint error:', err);
		return c.json({ error: 'Invalid request body' }, 400);
	}
});
