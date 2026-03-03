import { securityMiddleware } from '@/middleware/security';
import { contactRoute } from '@/routes/contact';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

export function createApp() {
	const app = new Hono();

	app.use(
		'*',
		cors({
			origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
			allowMethods: ['POST', 'OPTIONS'],
			allowHeaders: ['Content-Type', 'X-API-Key'],
		}),
	);

	app.use('*', securityMiddleware);

	app.get('/health', (c) => c.text('OK'));

	app.route('/contact', contactRoute);

	app.notFound((c) => c.json({ error: 'Not Found' }, 404));

	/* v8 ignore next 4 -- @preserve */
	app.onError((err, c) => {
		console.error('Server error:', err);
		return c.json({ error: 'Internal Server Error' }, 500);
	});

	return app;
}

/* v8 ignore next 6 -- @preserve */
const app = createApp();
const port = parseInt(process.env.PORT || '3000', 10);

if (process.env.NODE_ENV !== 'test') {
	console.log(`🚀 Server running on http://localhost:${port}`);
}

export default {
	port,
	fetch: app.fetch,
};
