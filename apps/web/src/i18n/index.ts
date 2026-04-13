import type { Language } from './utils';

export type { Language } from './utils';
export { getLangFromUrl, getLocalizedPath } from './utils';

export const defaultLanguage = 'en' as const;
export const languages: { code: Language; label: string; flag: string }[] = [
	{ code: 'en', label: 'English', flag: '🇺🇸' },
	{ code: 'id', label: 'Indonesia', flag: '🇮🇩' },
];
