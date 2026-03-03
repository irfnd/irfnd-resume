import type { Context, MiddlewareHandler, Next } from 'hono';

interface SecurityConfig {
	apiKey?: string;
	corsOrigin: string;
}

export function createSecurityMiddleware(config: SecurityConfig): MiddlewareHandler {
	const { apiKey, corsOrigin } = config;

	function isAllowedOrigin(origin: string): boolean {
		if (origin === corsOrigin) return true;
		if (origin.startsWith('http://localhost:')) return true;
		return false;
	}

	function isAllowedReferer(referer: string): boolean {
		if (referer.startsWith(corsOrigin)) return true;
		if (referer.startsWith('http://localhost:')) return true;
		return false;
	}

	return async function securityMiddleware(c: Context, next: Next) {
		if (c.req.path === '/health' || c.req.method === 'OPTIONS') {
			return next();
		}

		const origin = c.req.header('origin');
		if (origin && !isAllowedOrigin(origin)) {
			return c.json({ error: 'Forbidden' }, 403);
		}

		const referer = c.req.header('referer');
		if (referer && !isAllowedReferer(referer)) {
			return c.json({ error: 'Forbidden' }, 403);
		}

		if (apiKey) {
			const providedKey = c.req.header('x-api-key');
			if (providedKey !== apiKey) {
				return c.json({ error: 'Unauthorized' }, 401);
			}
		}

		await next();
	};
}

export const securityMiddleware = createSecurityMiddleware({
	apiKey: process.env.API_KEY,
	corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
});
