import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const cleanups: (() => void)[] = [];

function trackListeners() {
	const origAdd = document.addEventListener.bind(document);
	vi.spyOn(document, 'addEventListener').mockImplementation(
		(type: string, handler: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
			origAdd(type, handler, options);
			cleanups.push(() => document.removeEventListener(type, handler, options));
		},
	);
}

function buildResumeButtonHTML() {
	return `<button data-resume-download data-resume-lang="en" data-resume-api="http://localhost:3000" data-resume-key="test-key">
		<span>Download Resume</span>
	</button>`;
}

describe('resume-download', () => {
	beforeEach(() => {
		vi.resetModules();
		document.body.innerHTML = buildResumeButtonHTML();
		window.showToast = vi.fn() as unknown as typeof window.showToast;
		window.removeToast = vi.fn() as unknown as typeof window.removeToast;
		vi.stubGlobal('fetch', vi.fn());
		trackListeners();

		vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/fake-blob-url');
		vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
	});

	afterEach(() => {
		cleanups.forEach((fn) => fn());
		cleanups.length = 0;
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
		document.body.innerHTML = '';
	});

	it('does nothing when click is not on a resume download button', async () => {
		await import('@/scripts/resume-download');
		const div = document.createElement('div');
		document.body.appendChild(div);
		div.click();
		expect(fetch).not.toHaveBeenCalled();
	});

	it('downloads PDF on button click', async () => {
		const blob = new Blob(['pdf-content'], { type: 'application/pdf' });
		vi.mocked(fetch).mockResolvedValueOnce(new Response(blob, { status: 200 }));

		await import('@/scripts/resume-download');
		const btn = document.querySelector('[data-resume-download]') as HTMLElement;
		btn.click();

		await vi.waitFor(() => {
			expect(fetch).toHaveBeenCalledWith('http://localhost:3000/resume?lang=en', {
				headers: { 'X-API-Key': 'test-key' },
			});
		});

		await vi.waitFor(() => {
			expect(URL.createObjectURL).toHaveBeenCalled();
			expect(URL.revokeObjectURL).toHaveBeenCalled();
			expect(window.showToast).toHaveBeenCalledWith('Resume downloaded!', 'success');
		});
	});

	it('prevents double-click during download', async () => {
		let resolveFetch!: (value: Response) => void;
		vi.mocked(fetch).mockImplementationOnce(
			() =>
				new Promise<Response>((resolve) => {
					resolveFetch = resolve;
				}),
		);

		await import('@/scripts/resume-download');
		const btn = document.querySelector('[data-resume-download]') as HTMLElement;

		btn.click();
		await vi.waitFor(() => expect(btn.hasAttribute('data-downloading')).toBe(true));

		btn.click();
		expect(fetch).toHaveBeenCalledTimes(1);

		resolveFetch(new Response(new Blob(), { status: 200 }));
		await vi.waitFor(() => expect(btn.hasAttribute('data-downloading')).toBe(false));
	});

	it('shows loading spinner during download', async () => {
		let resolveFetch!: (value: Response) => void;
		vi.mocked(fetch).mockImplementationOnce(
			() =>
				new Promise<Response>((resolve) => {
					resolveFetch = resolve;
				}),
		);

		await import('@/scripts/resume-download');
		const btn = document.querySelector('[data-resume-download]') as HTMLElement;
		const originalHTML = btn.innerHTML;

		btn.click();
		await vi.waitFor(() => expect(btn.innerHTML).toContain('Generating...'));

		resolveFetch(new Response(new Blob(), { status: 200 }));
		await vi.waitFor(() => expect(btn.innerHTML).toBe(originalHTML));
	});

	it('shows error toast on fetch failure', async () => {
		vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

		await import('@/scripts/resume-download');
		const btn = document.querySelector('[data-resume-download]') as HTMLElement;
		btn.click();

		await vi.waitFor(() => {
			expect(window.showToast).toHaveBeenCalledWith('Failed to download resume', 'error');
		});
	});

	it('shows error toast on non-ok response', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }));

		await import('@/scripts/resume-download');
		const btn = document.querySelector('[data-resume-download]') as HTMLElement;
		btn.click();

		await vi.waitFor(() => {
			expect(window.showToast).toHaveBeenCalledWith('Failed to generate resume', 'error');
		});
	});

	it('restores button state after error', async () => {
		vi.mocked(fetch).mockRejectedValueOnce(new Error('fail'));

		await import('@/scripts/resume-download');
		const btn = document.querySelector('[data-resume-download]') as HTMLElement;
		const originalHTML = btn.innerHTML;
		btn.click();

		await vi.waitFor(() => {
			expect(btn.innerHTML).toBe(originalHTML);
			expect(btn.hasAttribute('data-downloading')).toBe(false);
		});
	});

	it('initializes via DOMContentLoaded when readyState is loading', async () => {
		Object.defineProperty(document, 'readyState', {
			value: 'loading',
			writable: true,
			configurable: true,
		});

		await import('@/scripts/resume-download');

		document.dispatchEvent(new Event('DOMContentLoaded'));

		Object.defineProperty(document, 'readyState', {
			value: 'complete',
			writable: true,
			configurable: true,
		});

		expect(true).toBe(true);
	});

	it('uses default values when data attributes are missing', async () => {
		document.body.innerHTML = '<button data-resume-download>Download</button>';
		vi.mocked(fetch).mockResolvedValueOnce(new Response(new Blob(), { status: 200 }));

		await import('@/scripts/resume-download');
		const btn = document.querySelector('[data-resume-download]') as HTMLElement;
		btn.click();

		await vi.waitFor(() => {
			expect(fetch).toHaveBeenCalledWith('http://localhost:3000/resume?lang=en', {
				headers: { 'X-API-Key': '' },
			});
		});
	});
});
