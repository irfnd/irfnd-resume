import type { Language, Translations } from '@/types/i18n';
import { en } from './en';
import { id } from './id';

export { getLangFromUrl, useTranslations, getLocalizedPath } from './utils';
export const translations: Record<Language, Translations> = { en, id };
export const defaultLanguage: Language = 'en';
export const languages: { code: Language; label: string; flag: string }[] = [
	{ code: 'en', label: 'English', flag: '🇺🇸' },
	{ code: 'id', label: 'Indonesia', flag: '🇮🇩' },
];
export { en, id };
