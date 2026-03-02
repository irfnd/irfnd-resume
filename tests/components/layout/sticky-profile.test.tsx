import { Profile } from '@/components/layout/sticky-profile';
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

describe('Profile', () => {
	it('should render profile name', () => {
		render(<Profile />, { wrapper: Wrapper });
		expect(screen.getByText(en.profile.firstName)).toBeInTheDocument();
		expect(screen.getByText(en.profile.lastName)).toBeInTheDocument();
	});

	it('should render profile role', () => {
		render(<Profile />, { wrapper: Wrapper });
		expect(screen.getByText(en.profile.role)).toBeInTheDocument();
	});

	it('should render profile description', () => {
		render(<Profile />, { wrapper: Wrapper });
		expect(screen.getByText(en.profile.description)).toBeInTheDocument();
	});

	it('should render profile photo', () => {
		render(<Profile />, { wrapper: Wrapper });
		expect(screen.getByAltText(en.profile.photo.alt)).toBeInTheDocument();
	});

	it('should render sticky profile contact links', () => {
		render(<Profile />, { wrapper: Wrapper });
		const stickyContacts = en.contact.filter((item) => item.showInStickyProfile);
		stickyContacts.forEach((item) => {
			expect(screen.getByRole('link', { name: item.label })).toHaveAttribute('href', item.url);
		});
	});
});
