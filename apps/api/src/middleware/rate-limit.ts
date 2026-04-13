import type { RateLimitConfig, RateLimitEntry } from '@/types';
import { getClientIP } from '@/utils';
import type { Context, MiddlewareHandler, Next } from 'hono';

export function createRateLimitMiddleware(config: RateLimitConfig): MiddlewareHandler {
	const { max, windowMs, store = new Map<string, RateLimitEntry>() } = config;

	return async function rateLimitMiddleware(c: Context, next: Next) {
		const ip = getClientIP(c);
		const now = Date.now();

		let entry = store.get(ip);

		if (!entry || entry.resetAt <= now) {
			entry = {
				count: 1,
				resetAt: now + windowMs,
			};
			store.set(ip, entry);
		} else {
			entry.count++;
		}

		c.header('X-RateLimit-Limit', max.toString());
		c.header('X-RateLimit-Remaining', Math.max(0, max - entry.count).toString());
		c.header('X-RateLimit-Reset', Math.ceil(entry.resetAt / 1000).toString());

		if (entry.count > max) {
			const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
			c.header('Retry-After', retryAfter.toString());

			return c.json(
				{
					error: 'Too many requests',
					retryAfter,
				},
				429,
			);
		}

		await next();
	};
}

const defaultStore = new Map<string, RateLimitEntry>();

export function cleanupExpiredEntries(store: Map<string, RateLimitEntry>) {
	const now = Date.now();
	for (const [key, entry] of store.entries()) {
		if (entry.resetAt <= now) {
			store.delete(key);
		}
	}
}

export function startDefaultStoreCleanup(intervalMs = 60_000) {
	return setInterval(() => cleanupExpiredEntries(defaultStore), intervalMs);
}

export const rateLimitMiddleware = createRateLimitMiddleware({
	max: parseInt(process.env.RATE_LIMIT_MAX || '5', 10),
	windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000', 10),
	store: defaultStore,
});
