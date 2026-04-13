import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Track event listeners so we can remove them between tests (scripts auto-register on import)
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

describe('theme', () => {
	beforeEach(() => {
		vi.resetModules();
		document.documentElement.className = '';
		localStorage.clear();
		trackListeners();
	});

	afterEach(() => {
		cleanups.forEach((fn) => fn());
		cleanups.length = 0;
		vi.restoreAllMocks();
	});

	describe('getStoredTheme', () => {
		it('returns "dark" by default when nothing stored', async () => {
			const { getStoredTheme } = await import('@/scripts/theme');
			expect(getStoredTheme()).toBe('dark');
		});

		it('returns "light" when stored', async () => {
			localStorage.setItem('irfnd-ui-theme', 'light');
			const { getStoredTheme } = await import('@/scripts/theme');
			expect(getStoredTheme()).toBe('light');
		});

		it('returns "dark" when stored', async () => {
			localStorage.setItem('irfnd-ui-theme', 'dark');
			const { getStoredTheme } = await import('@/scripts/theme');
			expect(getStoredTheme()).toBe('dark');
		});

		it('returns "dark" for invalid stored value', async () => {
			localStorage.setItem('irfnd-ui-theme', 'invalid');
			const { getStoredTheme } = await import('@/scripts/theme');
			expect(getStoredTheme()).toBe('dark');
		});
	});

	describe('applyTheme', () => {
		it('sets dark class and localStorage', async () => {
			const { applyTheme } = await import('@/scripts/theme');
			applyTheme('dark');
			expect(document.documentElement.classList.contains('dark')).toBe(true);
			expect(document.documentElement.classList.contains('light')).toBe(false);
			expect(localStorage.getItem('irfnd-ui-theme')).toBe('dark');
		});

		it('sets light class and localStorage', async () => {
			const { applyTheme } = await import('@/scripts/theme');
			applyTheme('light');
			expect(document.documentElement.classList.contains('light')).toBe(true);
			expect(document.documentElement.classList.contains('dark')).toBe(false);
			expect(localStorage.getItem('irfnd-ui-theme')).toBe('light');
		});

		it('removes previous theme class', async () => {
			document.documentElement.classList.add('light');
			const { applyTheme } = await import('@/scripts/theme');
			applyTheme('dark');
			expect(document.documentElement.classList.contains('light')).toBe(false);
			expect(document.documentElement.classList.contains('dark')).toBe(true);
		});
	});

	describe('initTheme', () => {
		it('applies dark theme on load by default', async () => {
			await import('@/scripts/theme');
			expect(document.documentElement.classList.contains('dark')).toBe(true);
		});

		it('applies stored light theme on load', async () => {
			localStorage.setItem('irfnd-ui-theme', 'light');
			await import('@/scripts/theme');
			expect(document.documentElement.classList.contains('light')).toBe(true);
		});

		it('toggles theme on toggle button click', async () => {
			await import('@/scripts/theme');
			expect(document.documentElement.classList.contains('dark')).toBe(true);

			const btn = document.createElement('button');
			btn.setAttribute('data-theme-toggle', '');
			document.body.appendChild(btn);

			btn.click();
			expect(document.documentElement.classList.contains('light')).toBe(true);
			expect(document.documentElement.classList.contains('dark')).toBe(false);

			btn.click();
			expect(document.documentElement.classList.contains('dark')).toBe(true);

			btn.remove();
		});

		it('ignores clicks on non-toggle elements', async () => {
			await import('@/scripts/theme');
			const div = document.createElement('div');
			document.body.appendChild(div);
			div.click();
			expect(document.documentElement.classList.contains('dark')).toBe(true);
			div.remove();
		});
	});
});
