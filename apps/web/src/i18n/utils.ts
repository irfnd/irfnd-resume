import type { Language, Translations } from '@/types/i18n';
import { en } from './en';
import { id } from './id';

const translations: Record<Language, Translations> = { en, id };

export function getLangFromUrl(url: URL): Language {
	const [, lang] = url.pathname.split('/');
	if (lang === 'id') return 'id';
	return 'en';
}

export function useTranslations(lang: Language): Translations {
	return translations[lang];
}

export function getLocalizedPath(lang: Language, path: string): string {
	const cleanPath = path.replace(/^\/(en|id)/, '').replace(/^\//, '');
	return `/${lang}/${cleanPath}`;
}
