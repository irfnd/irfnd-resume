import { createSecurityMiddleware } from '@/middleware/security';
import { Hono } from 'hono';
import { describe, expect, it } from 'vitest';

describe('Security Middleware', () => {
	describe('health endpoint bypass', () => {
		it('should allow health check without security headers', async () => {
			const app = new Hono();
			app.use('*', createSecurityMiddleware({ corsOrigin: 'https://example.com', apiKey: 'secret' }));
			app.get('/health', (c) => c.json({ status: 'ok' }));

			const res = await app.request('/health');
			expect(res.status).toBe(200);
			expect(await res.json()).toEqual({ status: 'ok' });
		});
	});

	describe('OPTIONS preflight bypass', () => {
		it('should allow OPTIONS requests without security headers', async () => {
			const app = new Hono();
			app.use('*', createSecurityMiddleware({ corsOrigin: 'https://example.com', apiKey: 'secret' }));
			app.get('/test', (c) => c.json({ message: 'success' }));

			const res = await app.request('/test', { method: 'OPTIONS' });
			expect(res.status).toBe(404); // No OPTIONS handler, but middleware passes
		});
	});

	describe('origin validation', () => {
		it('should allow requests from localhost', async () => {
			const app = new Hono();
			app.use('*', createSecurityMiddleware({ corsOrigin: 'https://example.com' }));
			app.get('/test', (c) => c.json({ message: 'success' }));

			const res = await app.request('/test', {
				headers: { origin: 'http://localhost:5173' },
			});
			expect(res.status).toBe(200);
		});

		it('should allow requests from configured CORS origin', async () => {
			const app = new Hono();
			app.use('*', createSecurityMiddleware({ corsOrigin: 'https://example.com' }));
			app.get('/test', (c) => c.json({ message: 'success' }));

			const res = await app.request('/test', {
				headers: { origin: 'https://example.com' },
			});
			expect(res.status).toBe(200);
		});

		it('should reject requests from disallowed origin', async () => {
			const app = new Hono();
			app.use('*', createSecurityMiddleware({ corsOrigin: 'https://example.com' }));
			app.get('/test', (c) => c.json({ message: 'success' }));

			const res = await app.request('/test', {
				headers: { origin: 'https://malicious.com' },
			});
			expect(res.status).toBe(403);
			expect(await res.json()).toEqual({ error: 'Forbidden' });
		});

		it('should allow requests without origin header', async () => {
			const app = new Hono();
			app.use('*', createSecurityMiddleware({ corsOrigin: 'https://example.com' }));
			app.get('/test', (c) => c.json({ message: 'success' }));

			const res = await app.request('/test');
			expect(res.status).toBe(200);
		});
	});

	describe('referer validation', () => {
		it('should allow requests from localhost referer', async () => {
			const app = new Hono();
			app.use('*', createSecurityMiddleware({ corsOrigin: 'https://example.com' }));
			app.get('/test', (c) => c.json({ message: 'success' }));

			const res = await app.request('/test', {
				headers: { referer: 'http://localhost:5173/contact' },
			});
			expect(res.status).toBe(200);
		});

		it('should allow requests from configured origin referer', async () => {
			const app = new Hono();
			app.use('*', createSecurityMiddleware({ corsOrigin: 'https://example.com' }));
			app.get('/test', (c) => c.json({ message: 'success' }));

			const res = await app.request('/test', {
				headers: { referer: 'https://example.com/contact' },
			});
			expect(res.status).toBe(200);
		});

		it('should reject requests from disallowed referer', async () => {
			const app = new Hono();
			app.use('*', createSecurityMiddleware({ corsOrigin: 'https://example.com' }));
			app.get('/test', (c) => c.json({ message: 'success' }));

			const res = await app.request('/test', {
				headers: { referer: 'https://malicious.com/page' },
			});
			expect(res.status).toBe(403);
			expect(await res.json()).toEqual({ error: 'Forbidden' });
		});

		it('should allow requests without referer header', async () => {
			const app = new Hono();
			app.use('*', createSecurityMiddleware({ corsOrigin: 'https://example.com' }));
			app.get('/test', (c) => c.json({ message: 'success' }));

			const res = await app.request('/test');
			expect(res.status).toBe(200);
		});
	});

	describe('API key validation', () => {
		it('should reject requests without API key when API_KEY is set', async () => {
			const app = new Hono();
			app.use('*', createSecurityMiddleware({ corsOrigin: 'https://example.com', apiKey: 'secret-key' }));
			app.get('/test', (c) => c.json({ message: 'success' }));

			const res = await app.request('/test');
			expect(res.status).toBe(401);
			expect(await res.json()).toEqual({ error: 'Unauthorized' });
		});

		it('should reject requests with wrong API key', async () => {
			const app = new Hono();
			app.use('*', createSecurityMiddleware({ corsOrigin: 'https://example.com', apiKey: 'secret-key' }));
			app.get('/test', (c) => c.json({ message: 'success' }));

			const res = await app.request('/test', {
				headers: { 'x-api-key': 'wrong-key' },
			});
			expect(res.status).toBe(401);
		});

		it('should allow requests with correct API key', async () => {
			const app = new Hono();
			app.use('*', createSecurityMiddleware({ corsOrigin: 'https://example.com', apiKey: 'secret-key' }));
			app.get('/test', (c) => c.json({ message: 'success' }));

			const res = await app.request('/test', {
				headers: { 'x-api-key': 'secret-key' },
			});
			expect(res.status).toBe(200);
		});

		it('should allow requests when API_KEY is not set', async () => {
			const app = new Hono();
			app.use('*', createSecurityMiddleware({ corsOrigin: 'https://example.com' }));
			app.get('/test', (c) => c.json({ message: 'success' }));

			const res = await app.request('/test');
			expect(res.status).toBe(200);
		});
	});
});
