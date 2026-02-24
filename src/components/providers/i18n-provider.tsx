import { defaultLanguage, translations } from '@/i18n';
import type { I18nContextType, Language, Translations } from '@/types';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'irfnd-lang';

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getInitialLanguage(): Language {
	if (typeof window === 'undefined') return defaultLanguage;

	const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
	if (stored && (stored === 'en' || stored === 'id')) return stored;

	const browserLang = navigator.language.split('-')[0];
	if (browserLang === 'id') return 'id';

	return defaultLanguage;
}

interface I18nProviderProps {
	children: React.ReactNode;
	defaultLang?: Language;
}

export function I18nProvider({ children, defaultLang }: I18nProviderProps) {
	const [language, setLanguageState] = useState<Language>(() => {
		if (defaultLang) return defaultLang;
		return getInitialLanguage();
	});

	const t = useMemo<Translations>(() => translations[language], [language]);

	const setLanguage = useCallback((lang: Language) => {
		setLanguageState(lang);
		localStorage.setItem(STORAGE_KEY, lang);
	}, []);

	useEffect(() => {
		document.documentElement.lang = language;
	}, [language]);

	return <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
	const context = useContext(I18nContext);
	if (context === undefined) throw new Error('useI18n must be used within an I18nProvider');
	return context;
}

export function useTranslation(): Translations {
	const { t } = useI18n();
	return t;
}

export function useLanguage(): Language {
	const { language } = useI18n();
	return language;
}
