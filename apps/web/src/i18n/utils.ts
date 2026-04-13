export type Language = 'en' | 'id';

export function getLangFromUrl(url: URL): Language {
	const [, lang] = url.pathname.split('/');
	if (lang === 'id') return 'id';
	return 'en';
}

export function getLocalizedPath(lang: Language, path: string): string {
	const cleanPath = path.replace(/^\/(en|id)/, '').replace(/^\//, '');
	return `/${lang}/${cleanPath}`;
}
