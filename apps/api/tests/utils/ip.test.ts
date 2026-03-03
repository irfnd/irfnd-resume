import { getClientIP } from '@/utils';
import { Hono } from 'hono';
import { beforeEach, describe, expect, it } from 'vitest';

describe('getClientIP', () => {
	let app: Hono;

	beforeEach(() => {
		app = new Hono();
		app.get('/test', (c) => {
			return c.json({ ip: getClientIP(c) });
		});
	});

	it('should extract IP from x-forwarded-for header', async () => {
		const res = await app.request('/test', {
			headers: { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' },
		});
		const data = (await res.json()) as { ip: string };
		expect(data.ip).toBe('192.168.1.1');
	});

	it('should handle single IP in x-forwarded-for', async () => {
		const res = await app.request('/test', {
			headers: { 'x-forwarded-for': '203.0.113.50' },
		});
		const data = (await res.json()) as { ip: string };
		expect(data.ip).toBe('203.0.113.50');
	});

	it('should extract IP from x-real-ip header', async () => {
		const res = await app.request('/test', {
			headers: { 'x-real-ip': '172.16.0.1' },
		});
		const data = (await res.json()) as { ip: string };
		expect(data.ip).toBe('172.16.0.1');
	});

	it('should prefer x-forwarded-for over x-real-ip', async () => {
		const res = await app.request('/test', {
			headers: {
				'x-forwarded-for': '192.168.1.100',
				'x-real-ip': '172.16.0.1',
			},
		});
		const data = (await res.json()) as { ip: string };
		expect(data.ip).toBe('192.168.1.100');
	});

	it('should return unknown when no IP headers', async () => {
		const res = await app.request('/test');
		const data = (await res.json()) as { ip: string };
		expect(data.ip).toBe('unknown');
	});

	it('should trim whitespace from forwarded IP', async () => {
		const res = await app.request('/test', {
			headers: { 'x-forwarded-for': '  192.168.1.1  , 10.0.0.1' },
		});
		const data = (await res.json()) as { ip: string };
		expect(data.ip).toBe('192.168.1.1');
	});
});
