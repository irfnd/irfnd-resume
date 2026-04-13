import { describe, expect, it } from 'vitest';
import { getLangFromUrl, getLocalizedPath, useTranslations } from '@/i18n/utils';

describe('getLangFromUrl', () => {
	it('returns "en" for English URLs', () => {
		expect(getLangFromUrl(new URL('https://example.com/en/'))).toBe('en');
		expect(getLangFromUrl(new URL('https://example.com/en/portfolio'))).toBe('en');
	});

	it('returns "id" for Indonesian URLs', () => {
		expect(getLangFromUrl(new URL('https://example.com/id/'))).toBe('id');
		expect(getLangFromUrl(new URL('https://example.com/id/contact'))).toBe('id');
	});

	it('defaults to "en" for unknown languages', () => {
		expect(getLangFromUrl(new URL('https://example.com/fr/'))).toBe('en');
		expect(getLangFromUrl(new URL('https://example.com/'))).toBe('en');
	});
});

describe('useTranslations', () => {
	it('returns English translations', () => {
		const t = useTranslations('en');
		expect(t.navigation[0].label).toBe('Home');
	});

	it('returns Indonesian translations', () => {
		const t = useTranslations('id');
		expect(t.navigation[0].label).toBe('Beranda');
	});
});

describe('getLocalizedPath', () => {
	it('creates localized path from clean path', () => {
		expect(getLocalizedPath('en', 'portfolio')).toBe('/en/portfolio');
		expect(getLocalizedPath('id', 'contact')).toBe('/id/contact');
	});

	it('replaces existing language prefix', () => {
		expect(getLocalizedPath('id', '/en/portfolio')).toBe('/id/portfolio');
		expect(getLocalizedPath('en', '/id/contact')).toBe('/en/contact');
	});

	it('handles root path', () => {
		expect(getLocalizedPath('en', '/')).toBe('/en/');
		expect(getLocalizedPath('id', '')).toBe('/id/');
	});
});
