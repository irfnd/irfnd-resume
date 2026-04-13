import { startDefaultStoreCleanup } from '@/middleware/rate-limit';
import { securityMiddleware } from '@/middleware/security';
import { contactRoute } from '@/routes/contact';
import { resumeRoute } from '@/routes/resume';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

export function createApp() {
	const app = new Hono();

	app.use(
		'*',
		cors({
			origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
			allowMethods: ['GET', 'POST', 'OPTIONS'],
			allowHeaders: ['Content-Type', 'X-API-Key'],
		}),
	);

	app.use('*', securityMiddleware);

	app.get('/health', (c) => c.text('OK'));

	app.route('/contact', contactRoute);
	app.route('/resume', resumeRoute);

	app.notFound((c) => c.json({ error: 'Not Found' }, 404));

	app.onError((err, c) => {
		console.error('Server error:', err);
		return c.json({ error: 'Internal Server Error' }, 500);
	});

	return app;
}

const app = createApp();
const port = parseInt(process.env.PORT || '3000', 10);

if (process.env.NODE_ENV !== 'test') {
	startDefaultStoreCleanup();
	console.log(`🚀 Server running on http://localhost:${port}`);
}

export default {
	port,
	fetch: app.fetch,
};
