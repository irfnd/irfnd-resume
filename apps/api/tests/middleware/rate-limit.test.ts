import { cleanupExpiredEntries, createRateLimitMiddleware, startDefaultStoreCleanup } from '@/middleware/rate-limit';
import { Hono } from 'hono';
import { describe, expect, it, vi } from 'vitest';

describe('Rate Limit Middleware', () => {
	describe('rate limit headers', () => {
		it('should set rate limit headers', async () => {
			const app = new Hono();
			app.use('*', createRateLimitMiddleware({ max: 3, windowMs: 60000 }));
			app.post('/contact', (c) => c.json({ message: 'success' }));

			const res = await app.request('/contact', { method: 'POST' });

			expect(res.headers.get('X-RateLimit-Limit')).toBe('3');
			expect(res.headers.get('X-RateLimit-Remaining')).toBe('2');
			expect(res.headers.get('X-RateLimit-Reset')).toBeTruthy();
		});

		it('should decrement remaining count', async () => {
			const store = new Map();
			const app = new Hono();
			app.use('*', createRateLimitMiddleware({ max: 3, windowMs: 60000, store }));
			app.post('/contact', (c) => c.json({ message: 'success' }));

			const res1 = await app.request('/contact', {
				method: 'POST',
				headers: { 'x-forwarded-for': '192.168.1.1' },
			});
			expect(res1.headers.get('X-RateLimit-Remaining')).toBe('2');

			const res2 = await app.request('/contact', {
				method: 'POST',
				headers: { 'x-forwarded-for': '192.168.1.1' },
			});
			expect(res2.headers.get('X-RateLimit-Remaining')).toBe('1');

			const res3 = await app.request('/contact', {
				method: 'POST',
				headers: { 'x-forwarded-for': '192.168.1.1' },
			});
			expect(res3.headers.get('X-RateLimit-Remaining')).toBe('0');
		});
	});

	describe('rate limiting', () => {
		it('should allow requests within limit', async () => {
			const store = new Map();
			const app = new Hono();
			app.use('*', createRateLimitMiddleware({ max: 3, windowMs: 60000, store }));
			app.post('/contact', (c) => c.json({ message: 'success' }));

			for (let i = 0; i < 3; i++) {
				const res = await app.request('/contact', {
					method: 'POST',
					headers: { 'x-forwarded-for': '10.0.0.1' },
				});
				expect(res.status).toBe(200);
			}
		});

		it('should block requests exceeding limit', async () => {
			const store = new Map();
			const app = new Hono();
			app.use('*', createRateLimitMiddleware({ max: 3, windowMs: 60000, store }));
			app.post('/contact', (c) => c.json({ message: 'success' }));

			// Make 3 allowed requests
			for (let i = 0; i < 3; i++) {
				await app.request('/contact', {
					method: 'POST',
					headers: { 'x-forwarded-for': '10.0.0.2' },
				});
			}

			// 4th request should be blocked
			const res = await app.request('/contact', {
				method: 'POST',
				headers: { 'x-forwarded-for': '10.0.0.2' },
			});
			expect(res.status).toBe(429);
			const body = (await res.json()) as { error: string; retryAfter: number };
			expect(body.error).toBe('Too many requests');
			expect(body.retryAfter).toBeGreaterThan(0);
			expect(res.headers.get('Retry-After')).toBeTruthy();
		});

		it('should track different IPs separately', async () => {
			const store = new Map();
			const app = new Hono();
			app.use('*', createRateLimitMiddleware({ max: 3, windowMs: 60000, store }));
			app.post('/contact', (c) => c.json({ message: 'success' }));

			// Max out IP 1
			for (let i = 0; i < 3; i++) {
				await app.request('/contact', {
					method: 'POST',
					headers: { 'x-forwarded-for': '10.0.0.3' },
				});
			}

			// IP 2 should still work
			const res = await app.request('/contact', {
				method: 'POST',
				headers: { 'x-forwarded-for': '10.0.0.4' },
			});
			expect(res.status).toBe(200);
		});

		it('should reset after window expires', async () => {
			const store = new Map();
			const app = new Hono();
			// Use very short window for testing
			app.use('*', createRateLimitMiddleware({ max: 1, windowMs: 1, store }));
			app.post('/contact', (c) => c.json({ message: 'success' }));

			// First request uses the limit
			await app.request('/contact', {
				method: 'POST',
				headers: { 'x-forwarded-for': '10.0.0.5' },
			});

			// Wait for window to expire
			await new Promise((resolve) => setTimeout(resolve, 10));

			// Should be allowed again
			const res = await app.request('/contact', {
				method: 'POST',
				headers: { 'x-forwarded-for': '10.0.0.5' },
			});
			expect(res.status).toBe(200);
		});
	});

	describe('cleanup functions', () => {
		it('cleanupExpiredEntries removes expired entries', () => {
			const store = new Map();
			store.set('expired-ip', { count: 5, resetAt: Date.now() - 10000 });
			store.set('active-ip', { count: 2, resetAt: Date.now() + 60000 });
			cleanupExpiredEntries(store);
			expect(store.has('expired-ip')).toBe(false);
			expect(store.has('active-ip')).toBe(true);
		});

		it('cleanupExpiredEntries handles empty store', () => {
			const store = new Map();
			cleanupExpiredEntries(store);
			expect(store.size).toBe(0);
		});

		it('startDefaultStoreCleanup starts an interval', () => {
			vi.useFakeTimers();
			const timer = startDefaultStoreCleanup(1000);
			expect(timer).toBeDefined();
			vi.advanceTimersByTime(1000);
			clearInterval(timer);
			vi.useRealTimers();
		});
	});

	describe('IP detection', () => {
		it('should use x-forwarded-for header', async () => {
			const app = new Hono();
			app.use('*', createRateLimitMiddleware({ max: 100, windowMs: 60000 }));
			app.post('/contact', (c) => c.json({ message: 'success' }));

			const res = await app.request('/contact', {
				method: 'POST',
				headers: { 'x-forwarded-for': '203.0.113.1, 70.41.3.18' },
			});
			expect(res.status).toBe(200);
		});

		it('should use x-real-ip header when x-forwarded-for is not present', async () => {
			const app = new Hono();
			app.use('*', createRateLimitMiddleware({ max: 100, windowMs: 60000 }));
			app.post('/contact', (c) => c.json({ message: 'success' }));

			const res = await app.request('/contact', {
				method: 'POST',
				headers: { 'x-real-ip': '203.0.113.2' },
			});
			expect(res.status).toBe(200);
		});

		it('should fallback to unknown when no IP headers present', async () => {
			const app = new Hono();
			app.use('*', createRateLimitMiddleware({ max: 100, windowMs: 60000 }));
			app.post('/contact', (c) => c.json({ message: 'success' }));

			const res = await app.request('/contact', { method: 'POST' });
			expect(res.status).toBe(200);
		});
	});
});
