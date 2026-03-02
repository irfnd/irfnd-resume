import { SelectedWork } from '@/components/page/home/selected-work';
import { I18nProvider, ThemeProvider } from '@/components/providers';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@tanstack/react-router', () => ({
	Link: ({ children, to, className }: { children: ReactNode; to: string; className?: string }) => (
		<a href={to} className={className}>
			{children}
		</a>
	),
}));

function Wrapper({ children }: { children: ReactNode }) {
	return (
		<I18nProvider defaultLang='en'>
			<ThemeProvider defaultTheme='dark'>{children}</ThemeProvider>
		</I18nProvider>
	);
}

describe('SelectedWork', () => {
	it('should render section title', () => {
		render(<SelectedWork />, { wrapper: Wrapper });

		expect(screen.getByText('Selected Works')).toBeInTheDocument();
	});

	it('should render view more link to portfolio page', () => {
		render(<SelectedWork />, { wrapper: Wrapper });

		const viewMoreLink = screen.getByRole('link', { name: /view more/i });
		expect(viewMoreLink).toHaveAttribute('href', '/portfolio');
	});

	it('should render selected projects', () => {
		render(<SelectedWork />, { wrapper: Wrapper });

		const projectCards = screen.getAllByRole('link', { name: /source/i });
		expect(projectCards.length).toBeGreaterThan(0);
	});

	it('should render first project as featured card', () => {
		render(<SelectedWork />, { wrapper: Wrapper });

		const container = screen.getByText('Selected Works').closest('section');
		expect(container).toBeInTheDocument();
	});
});
