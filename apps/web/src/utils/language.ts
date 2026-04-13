import type { LangCode } from '@irfnd/data';

export type Language = 'en' | 'id';

export const defaultLanguage = 'en' as const;
export const languages: { code: Language; label: string; flag: string }[] = [
	{ code: 'en', label: 'English', flag: '🇺🇸' },
	{ code: 'id', label: 'Indonesia', flag: '🇮🇩' },
];

export function getLangFromUrl(url: URL): LangCode {
	const [, lang] = url.pathname.split('/');
	if (lang === 'id') return 'id';
	return 'en';
}

export function getLocalizedPath(lang: LangCode, path: string): string {
	const cleanPath = path.replace(/^\/(en|id)/, '').replace(/^\//, '');
	return `/${lang}/${cleanPath}`;
}
