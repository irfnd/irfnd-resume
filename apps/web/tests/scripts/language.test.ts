import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockAnimate = vi.fn(() => ({}));
const mockNavigate = vi.fn();

vi.mock('motion', () => ({ animate: mockAnimate, stagger: vi.fn(() => 0) }));
vi.mock('astro:transitions/client', () => ({ navigate: mockNavigate }));

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

function setLocationPathname(pathname: string) {
	Object.defineProperty(window, 'location', {
		value: { ...window.location, pathname, href: `http://localhost${pathname}` },
		writable: true,
		configurable: true,
	});
}

describe('language', () => {
	beforeEach(() => {
		vi.resetModules();
		document.body.innerHTML = '';
		setLocationPathname('/en/');
		mockAnimate.mockClear();
		mockNavigate.mockClear();
		vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
		trackListeners();
	});

	afterEach(() => {
		cleanups.forEach((fn) => fn());
		cleanups.length = 0;
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	describe('getLangFromPath', () => {
		it('returns "en" for English path', async () => {
			setLocationPathname('/en/portfolio');
			const { getLangFromPath } = await import('@/scripts/language');
			expect(getLangFromPath()).toBe('en');
		});

		it('returns "id" for Indonesian path', async () => {
			setLocationPathname('/id/contact');
			const { getLangFromPath } = await import('@/scripts/language');
			expect(getLangFromPath()).toBe('id');
		});

		it('defaults to "en" for unknown language', async () => {
			setLocationPathname('/fr/about');
			const { getLangFromPath } = await import('@/scripts/language');
			expect(getLangFromPath()).toBe('en');
		});
	});

	describe('switchLanguage', () => {
		it('navigates to the new language path', async () => {
			setLocationPathname('/en/portfolio');
			const { switchLanguage } = await import('@/scripts/language');
			switchLanguage('id');
			expect(mockNavigate).toHaveBeenCalledWith('/id/portfolio');
		});

		it('replaces en with id in root path', async () => {
			setLocationPathname('/en/');
			const { switchLanguage } = await import('@/scripts/language');
			switchLanguage('id');
			expect(mockNavigate).toHaveBeenCalledWith('/id/');
		});
	});

	describe('initLanguageSwitcher', () => {
		it('toggles dropdown on toggle button click', async () => {
			const dropdown = document.createElement('div');
			dropdown.setAttribute('data-lang-dropdown', '');
			dropdown.classList.add('hidden');
			document.body.appendChild(dropdown);

			const toggle = document.createElement('button');
			toggle.setAttribute('data-lang-toggle', '');
			document.body.appendChild(toggle);

			await import('@/scripts/language');

			toggle.click();
			expect(dropdown.classList.contains('hidden')).toBe(false);

			toggle.click();
			await Promise.resolve();
			expect(dropdown.classList.contains('hidden')).toBe(true);
		});

		it('switches language on option click', async () => {
			setLocationPathname('/en/');
			const dropdown = document.createElement('div');
			dropdown.setAttribute('data-lang-dropdown', '');
			document.body.appendChild(dropdown);

			const option = document.createElement('button');
			option.setAttribute('data-lang-option', 'id');
			document.body.appendChild(option);

			await import('@/scripts/language');
			option.click();
			await Promise.resolve();

			expect(mockNavigate).toHaveBeenCalledWith('/id/');
			expect(dropdown.classList.contains('hidden')).toBe(true);
		});

		it('does not switch if target lang is same as current', async () => {
			setLocationPathname('/en/');

			const dropdown = document.createElement('div');
			dropdown.setAttribute('data-lang-dropdown', '');
			document.body.appendChild(dropdown);

			const option = document.createElement('button');
			option.setAttribute('data-lang-option', 'en');
			document.body.appendChild(option);

			await import('@/scripts/language');
			option.click();
			await Promise.resolve();

			expect(mockNavigate).not.toHaveBeenCalled();
			expect(dropdown.classList.contains('hidden')).toBe(true);
		});

		it('closes dropdown on click outside', async () => {
			const dropdown = document.createElement('div');
			dropdown.setAttribute('data-lang-dropdown', '');
			document.body.appendChild(dropdown);

			await import('@/scripts/language');

			dropdown.classList.remove('hidden');
			expect(dropdown.classList.contains('hidden')).toBe(false);

			const random = document.createElement('div');
			document.body.appendChild(random);
			random.click();
			await Promise.resolve();

			expect(dropdown.classList.contains('hidden')).toBe(true);
		});
	});
});
