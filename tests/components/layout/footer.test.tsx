import { Footer } from '@/components/layout/footer';
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

describe('Footer', () => {
	it('should render copyright text with current year', () => {
		render(<Footer />, { wrapper: Wrapper });
		const currentYear = new Date().getFullYear().toString();
		expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
	});

	it('should render built with text', () => {
		render(<Footer />, { wrapper: Wrapper });
		expect(screen.getByText(new RegExp(en.footer.builtWith))).toBeInTheDocument();
	});

	it('should render footer contact links', () => {
		render(<Footer />, { wrapper: Wrapper });
		const footerContacts = en.contact.filter((item) => item.showInFooter);
		footerContacts.forEach((item) => {
			expect(screen.getByRole('link', { name: item.label })).toHaveAttribute('href', item.url);
		});
	});
});
