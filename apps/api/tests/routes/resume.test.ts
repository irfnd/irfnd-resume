import { Hono } from 'hono';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@react-pdf/renderer', () => ({
	renderToBuffer: vi.fn().mockResolvedValue(Buffer.from('fake-pdf-content')),
	Document: vi.fn(),
	Page: vi.fn(),
	View: vi.fn(),
	Text: vi.fn(),
	Link: vi.fn(),
	Font: { registerHyphenationCallback: vi.fn() },
	StyleSheet: { create: (s: Record<string, unknown>) => s },
}));

const { resumeRoute } = await import('@/routes/resume');

describe('Resume Route', () => {
	let app: Hono;

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		app = new Hono();
		app.route('/resume', resumeRoute);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns PDF for valid English request', async () => {
		const res = await app.request('/resume?lang=en');
		expect(res.status).toBe(200);
		expect(res.headers.get('content-type')).toBe('application/pdf');
		expect(res.headers.get('content-disposition')).toContain('Resume_Irfandi_EN.pdf');
	});

	it('returns PDF for valid Indonesian request', async () => {
		const res = await app.request('/resume?lang=id');
		expect(res.status).toBe(200);
		expect(res.headers.get('content-type')).toBe('application/pdf');
		expect(res.headers.get('content-disposition')).toContain('Resume_Irfandi_ID.pdf');
	});

	it('defaults to English when no lang provided', async () => {
		const res = await app.request('/resume');
		expect(res.status).toBe(200);
		expect(res.headers.get('content-disposition')).toContain('EN.pdf');
	});

	it('returns 400 for invalid language', async () => {
		const res = await app.request('/resume?lang=fr');
		expect(res.status).toBe(400);
		const body = (await res.json()) as { error: string };
		expect(body.error).toContain('Invalid language');
	});

	it('returns 500 when renderToBuffer fails', async () => {
		const renderer = await import('@react-pdf/renderer');
		vi.mocked(renderer.renderToBuffer).mockRejectedValueOnce(new Error('Render failed'));

		const res = await app.request('/resume?lang=en');
		expect(res.status).toBe(500);
		const body = (await res.json()) as { error: string };
		expect(body.error).toContain('Failed to generate');
	});
});
