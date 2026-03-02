import { getInitialLanguage, I18nProvider, useI18n, useLanguage, useTranslation } from '@/components/providers/i18n-provider';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function TestComponent() {
	const { language, setLanguage, t } = useI18n();
	return (
		<div>
			<span data-testid='language'>{language}</span>
			<span data-testid='profile-name'>{t.profile.firstName}</span>
			<button onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}>Toggle</button>
		</div>
	);
}

function LanguageComponent() {
	const language = useLanguage();
	return <span data-testid='lang-hook'>{language}</span>;
}

function TranslationComponent() {
	const t = useTranslation();
	return <span data-testid='translation-hook'>{t.profile.firstName}</span>;
}

describe('I18nProvider', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.stubGlobal('navigator', { language: 'en-US' });
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('should render children', () => {
		render(
			<I18nProvider>
				<div data-testid='child'>Child</div>
			</I18nProvider>,
		);

		expect(screen.getByTestId('child')).toBeInTheDocument();
	});

	it('should use default language (en) when no localStorage and browser is not Indonesian', () => {
		vi.stubGlobal('navigator', { language: 'en-US' });

		render(
			<I18nProvider>
				<TestComponent />
			</I18nProvider>,
		);

		expect(screen.getByTestId('language')).toHaveTextContent('en');
	});

	it('should use custom default language', () => {
		render(
			<I18nProvider defaultLang='id'>
				<TestComponent />
			</I18nProvider>,
		);

		expect(screen.getByTestId('language')).toHaveTextContent('id');
	});

	it('should read language from localStorage', () => {
		localStorage.setItem('irfnd-lang', 'id');

		render(
			<I18nProvider>
				<TestComponent />
			</I18nProvider>,
		);

		expect(screen.getByTestId('language')).toHaveTextContent('id');
	});

	it('should provide translations', () => {
		render(
			<I18nProvider>
				<TestComponent />
			</I18nProvider>,
		);

		expect(screen.getByTestId('profile-name')).toBeInTheDocument();
	});

	it('should toggle language and persist to localStorage', async () => {
		const user = userEvent.setup();

		render(
			<I18nProvider>
				<TestComponent />
			</I18nProvider>,
		);

		expect(screen.getByTestId('language')).toHaveTextContent('en');

		await user.click(screen.getByRole('button', { name: 'Toggle' }));

		await waitFor(() => {
			expect(screen.getByTestId('language')).toHaveTextContent('id');
			expect(localStorage.getItem('irfnd-lang')).toBe('id');
		});
	});

	it('should update document lang attribute', async () => {
		const user = userEvent.setup();

		render(
			<I18nProvider defaultLang='en'>
				<TestComponent />
			</I18nProvider>,
		);

		expect(document.documentElement.lang).toBe('en');

		await user.click(screen.getByRole('button', { name: 'Toggle' }));

		await waitFor(() => {
			expect(document.documentElement.lang).toBe('id');
		});
	});
});

describe('useI18n hook', () => {
	it('should throw error when used outside I18nProvider', () => {
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

		expect(() => {
			render(<TestComponent />);
		}).toThrow('useI18n must be used within an I18nProvider');

		consoleError.mockRestore();
	});
});

describe('useLanguage hook', () => {
	it('should return current language', () => {
		render(
			<I18nProvider defaultLang='en'>
				<LanguageComponent />
			</I18nProvider>,
		);

		expect(screen.getByTestId('lang-hook')).toHaveTextContent('en');
	});
});

describe('useTranslation hook', () => {
	it('should return translations object', () => {
		render(
			<I18nProvider>
				<TranslationComponent />
			</I18nProvider>,
		);

		expect(screen.getByTestId('translation-hook')).toBeInTheDocument();
	});
});

describe('getInitialLanguage function', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('should return stored language from localStorage (en)', () => {
		localStorage.setItem('irfnd-lang', 'en');
		expect(getInitialLanguage()).toBe('en');
	});

	it('should return stored language from localStorage (id)', () => {
		localStorage.setItem('irfnd-lang', 'id');
		expect(getInitialLanguage()).toBe('id');
	});

	it('should detect Indonesian browser language (id-ID)', () => {
		vi.stubGlobal('navigator', { language: 'id-ID' });
		expect(getInitialLanguage()).toBe('id');
	});

	it('should detect Indonesian browser language (id)', () => {
		vi.stubGlobal('navigator', { language: 'id' });
		expect(getInitialLanguage()).toBe('id');
	});

	it('should return default for French browser language', () => {
		vi.stubGlobal('navigator', { language: 'fr-FR' });
		expect(getInitialLanguage()).toBe('en');
	});

	it('should return default for German browser language', () => {
		vi.stubGlobal('navigator', { language: 'de-DE' });
		expect(getInitialLanguage()).toBe('en');
	});

	it('should return default for Japanese browser language', () => {
		vi.stubGlobal('navigator', { language: 'ja-JP' });
		expect(getInitialLanguage()).toBe('en');
	});

	it('should return default for Spanish browser language', () => {
		vi.stubGlobal('navigator', { language: 'es-ES' });
		expect(getInitialLanguage()).toBe('en');
	});

	it('should return default for English browser language', () => {
		vi.stubGlobal('navigator', { language: 'en-US' });
		expect(getInitialLanguage()).toBe('en');
	});

	it('should return default for Chinese browser language', () => {
		vi.stubGlobal('navigator', { language: 'zh-CN' });
		expect(getInitialLanguage()).toBe('en');
	});

	it('should return default for Portuguese browser language', () => {
		vi.stubGlobal('navigator', { language: 'pt-BR' });
		expect(getInitialLanguage()).toBe('en');
	});

	it('should ignore invalid stored language and use browser detection', () => {
		localStorage.setItem('irfnd-lang', 'invalid');
		vi.stubGlobal('navigator', { language: 'en-US' });
		expect(getInitialLanguage()).toBe('en');
	});

	it('should use custom default language parameter', () => {
		vi.stubGlobal('navigator', { language: 'en-US' });
		expect(getInitialLanguage('id')).toBe('id');
	});

	it('should use custom default when browser is not Indonesian', () => {
		vi.stubGlobal('navigator', { language: 'ru-RU' });
		const result = getInitialLanguage();
		expect(result).not.toBe('id');
		expect(result).toBe('en');
	});
});
