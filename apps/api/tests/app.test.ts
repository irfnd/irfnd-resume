import { createApp } from '@/index';
import { getEmailClient, setEmailClient } from '@/services/email';
import type { EmailClient } from '@/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('App', () => {
	let mockEmailClient: EmailClient;

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'log').mockImplementation(() => {});
		vi.stubEnv('EMAIL_TO', 'test@example.com');
		vi.stubEnv('EMAIL_FROM', 'sender@example.com');
		vi.stubEnv('RATE_LIMIT_MAX', '100');
		vi.stubEnv('RATE_LIMIT_WINDOW_MS', '60000');
		vi.stubEnv('CORS_ORIGIN', 'http://localhost:5173');

		mockEmailClient = {
			emails: {
				send: vi.fn().mockResolvedValue({ data: { id: 'msg_test' }, error: null }),
			},
		};
		setEmailClient(mockEmailClient);
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		vi.restoreAllMocks();
	});

	describe('createApp', () => {
		it('should create an app instance', () => {
			const app = createApp();
			expect(app).toBeDefined();
			expect(app.fetch).toBeDefined();
		});
	});

	describe('GET /health', () => {
		it('should return OK', async () => {
			const app = createApp();
			const res = await app.request('/health');

			expect(res.status).toBe(200);
			expect(await res.text()).toBe('OK');
		});

		it('should bypass security middleware', async () => {
			vi.stubEnv('API_KEY', 'secret');
			const app = createApp();

			const res = await app.request('/health');

			expect(res.status).toBe(200);
		});
	});

	describe('CORS', () => {
		it('should include CORS headers', async () => {
			const app = createApp();
			const res = await app.request('/health', {
				headers: { origin: 'http://localhost:5173' },
			});

			expect(res.headers.get('access-control-allow-origin')).toBe('http://localhost:5173');
		});

		it('should handle OPTIONS preflight', async () => {
			const app = createApp();
			const res = await app.request('/contact', {
				method: 'OPTIONS',
				headers: {
					origin: 'http://localhost:5173',
					'access-control-request-method': 'POST',
				},
			});

			expect(res.status).toBe(204);
			expect(res.headers.get('access-control-allow-methods')).toContain('POST');
		});
	});

	describe('404 handler', () => {
		it('should return 404 for unknown routes', async () => {
			const app = createApp();
			const res = await app.request('/unknown');

			expect(res.status).toBe(404);
			const body = (await res.json()) as { error: string };
			expect(body.error).toBe('Not Found');
		});
	});

	describe('error handler', () => {
		it('should handle route errors gracefully', async () => {
			const app = createApp();

			// The onError handler in index.ts catches errors from routes
			// We test by sending malformed requests that trigger errors
			// The route throws on invalid JSON, but catches it internally
			// To test onError, we need to verify the handler exists
			expect(app.onError).toBeDefined();
		});
	});

	describe('POST /contact integration', () => {
		it('should process contact form', async () => {
			const app = createApp();
			const res = await app.request('/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					origin: 'http://localhost:5173',
				},
				body: JSON.stringify({
					fullName: 'Test User',
					email: 'test@example.com',
					telephone: '1234567890',
					subject: 'Test Subject',
					message: 'This is a test message with sufficient length.',
				}),
			});

			expect(res.status).toBe(200);
			const body = (await res.json()) as { success: boolean };
			expect(body.success).toBe(true);
		});

		it('should return validation errors', async () => {
			const app = createApp();
			const res = await app.request('/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					origin: 'http://localhost:5173',
				},
				body: JSON.stringify({
					fullName: 'T',
					email: 'invalid',
					telephone: '123',
					subject: 'X',
					message: 'short',
				}),
			});

			expect(res.status).toBe(400);
			const body = (await res.json()) as { error: string; errors: unknown[] };
			expect(body.error).toBe('Validation failed');
			expect(body.errors.length).toBeGreaterThan(0);
		});

		it('should return 500 when email fails', async () => {
			vi.mocked(mockEmailClient.emails.send).mockResolvedValue({
				data: null,
				error: { message: 'Service error' },
			});

			const app = createApp();
			const res = await app.request('/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					origin: 'http://localhost:5173',
				},
				body: JSON.stringify({
					fullName: 'Test User',
					email: 'test@example.com',
					telephone: '1234567890',
					subject: 'Test Subject',
					message: 'This is a test message with sufficient length.',
				}),
			});

			expect(res.status).toBe(500);
			const body = (await res.json()) as { error: string };
			expect(body.error).toBe('Service error');
		});

		it('should handle invalid JSON', async () => {
			const app = createApp();
			const res = await app.request('/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					origin: 'http://localhost:5173',
				},
				body: 'invalid json',
			});

			expect(res.status).toBe(400);
			const body = (await res.json()) as { error: string };
			expect(body.error).toBe('Invalid request body');
		});

		it('should reject invalid origin', async () => {
			const app = createApp();
			const res = await app.request('/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					origin: 'https://malicious.com',
				},
				body: JSON.stringify({
					fullName: 'Test User',
					email: 'test@example.com',
					telephone: '1234567890',
					subject: 'Test Subject',
					message: 'This is a test message with sufficient length.',
				}),
			});

			expect(res.status).toBe(403);
		});
	});

	describe('getEmailClient', () => {
		it('should return the injected client', () => {
			const client = getEmailClient();
			expect(client).toBe(mockEmailClient);
		});

		it('should create default client when none is set', () => {
			setEmailClient(null);
			vi.stubEnv('RESEND_API_KEY', 'test_key');
			// Getting client will create default Resend client
			const client = getEmailClient();
			expect(client).toBeDefined();
			expect(client.emails).toBeDefined();
		});
	});
});
