import type { Context } from 'hono';

export function getClientIP(c: Context): string {
	const forwarded = c.req.header('x-forwarded-for');
	if (forwarded) {
		return forwarded.split(',')[0].trim();
	}

	const realIP = c.req.header('x-real-ip');
	if (realIP) {
		return realIP;
	}

	return 'unknown';
}
