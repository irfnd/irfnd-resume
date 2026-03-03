import { I18nProvider, ThemeProvider } from '@/components/providers';
import type { Language } from '@/types';
import { render as rtlRender, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

interface AllProvidersProps {
	children: ReactNode;
	defaultLanguage?: Language;
	defaultTheme?: 'dark' | 'light';
}

function AllProviders({ children, defaultLanguage = 'en', defaultTheme = 'dark' }: AllProvidersProps) {
	return (
		<I18nProvider defaultLang={defaultLanguage}>
			<ThemeProvider defaultTheme={defaultTheme}>{children}</ThemeProvider>
		</I18nProvider>
	);
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
	defaultLanguage?: Language;
	defaultTheme?: 'dark' | 'light';
}

export function renderWithProviders(ui: ReactElement, options: CustomRenderOptions = {}) {
	const { defaultLanguage = 'en', defaultTheme = 'dark', ...renderOptions } = options;

	return rtlRender(ui, {
		wrapper: ({ children }) => (
			<AllProviders defaultLanguage={defaultLanguage} defaultTheme={defaultTheme}>
				{children}
			</AllProviders>
		),
		...renderOptions,
	});
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

export { renderWithProviders as render };
