import { I18nProvider, ThemeProvider } from '@/components/providers';
import { routeTree } from '@/routeTree.gen';
import type { Language } from '@/types';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { render as rtlRender, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

interface RouterProvidersProps {
	children: ReactNode;
	defaultLanguage?: Language;
	defaultTheme?: 'dark' | 'light';
}

function RouterProviders({ children, defaultLanguage = 'en', defaultTheme = 'dark' }: RouterProvidersProps) {
	return (
		<I18nProvider defaultLang={defaultLanguage}>
			<ThemeProvider defaultTheme={defaultTheme}>{children}</ThemeProvider>
		</I18nProvider>
	);
}

interface RenderWithRouterOptions extends Omit<RenderOptions, 'wrapper'> {
	initialLocation?: string;
	defaultLanguage?: Language;
	defaultTheme?: 'dark' | 'light';
}

export function createTestRouter(initialLocation = '/') {
	return createRouter({
		routeTree,
		history: createMemoryHistory({
			initialEntries: [initialLocation],
		}),
		defaultPreload: false,
	});
}

export function renderWithRouter(ui: ReactElement, options: RenderWithRouterOptions = {}) {
	const { initialLocation = '/', defaultLanguage = 'en', defaultTheme = 'dark', ...renderOptions } = options;

	const router = createTestRouter(initialLocation);

	return {
		...rtlRender(ui, {
			wrapper: ({ children }) => (
				<RouterProviders defaultLanguage={defaultLanguage} defaultTheme={defaultTheme}>
					<RouterProvider router={router} />
					{children}
				</RouterProviders>
			),
			...renderOptions,
		}),
		router,
	};
}

export function renderRoute(initialLocation = '/', options: Omit<RenderWithRouterOptions, 'initialLocation'> = {}) {
	const { defaultLanguage = 'en', defaultTheme = 'dark', ...renderOptions } = options;

	const router = createTestRouter(initialLocation);

	return {
		...rtlRender(
			<RouterProviders defaultLanguage={defaultLanguage} defaultTheme={defaultTheme}>
				<RouterProvider router={router} />
			</RouterProviders>,
			renderOptions,
		),
		router,
	};
}
