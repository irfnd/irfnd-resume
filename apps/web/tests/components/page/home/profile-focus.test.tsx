import { ProfileFocus } from '@/components/page/home/profile-focus';
import { I18nProvider, ThemeProvider } from '@/components/providers';
import { en } from '@/i18n';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

function Wrapper({ children }: { children: ReactNode }) {
	return (
		<I18nProvider defaultLang='en'>
			<ThemeProvider defaultTheme='dark'>{children}</ThemeProvider>
		</I18nProvider>
	);
}

describe('ProfileFocus', () => {
	it('should render section title', () => {
		render(<ProfileFocus />, { wrapper: Wrapper });
		expect(screen.getByText(en.about.title)).toBeInTheDocument();
	});

	it('should render focus items', () => {
		render(<ProfileFocus />, { wrapper: Wrapper });
		en.about.focus.forEach((item) => {
			expect(screen.getByText(item.label)).toBeInTheDocument();
			expect(screen.getByText(item.value)).toBeInTheDocument();
		});
	});

	it('should render description with highlighted keywords', () => {
		render(<ProfileFocus />, { wrapper: Wrapper });
		if (en.about.description && en.about.description.length > 0) {
			const firstKeyword = en.about.description[0].keywords[0];
			expect(screen.getByText(firstKeyword)).toBeInTheDocument();
		}
	});
});
