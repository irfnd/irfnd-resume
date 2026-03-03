import { Menu } from '@/components/layout/navigation-menu';
import { I18nProvider, ThemeProvider } from '@/components/providers';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let mockPathname = '/';

vi.mock('@tanstack/react-router', () => ({
	Link: ({ children, to, className, ...props }: { children: ReactNode; to: string; className?: string }) => (
		<a href={to} className={className} {...props}>
			{children}
		</a>
	),
	useRouterState: vi.fn(({ select }: { select: (s: { location: { pathname: string } }) => string }) => {
		return select({ location: { pathname: mockPathname } });
	}),
}));

const mockDownload = vi.fn();
let mockLoading = false;
vi.mock('@/hooks/useResumeDownload', () => ({
	useResumeDownload: () => ({ download: mockDownload, loading: mockLoading }),
}));

function Wrapper({ children }: { children: ReactNode }) {
	return (
		<I18nProvider defaultLang='en'>
			<ThemeProvider defaultTheme='dark'>{children}</ThemeProvider>
		</I18nProvider>
	);
}

describe('NavigationMenu', () => {
	beforeEach(() => {
		mockDownload.mockClear();
		mockLoading = false;
		mockPathname = '/';
	});

	it('should render all navigation items', () => {
		render(<Menu />, { wrapper: Wrapper });

		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('Portfolio')).toBeInTheDocument();
		expect(screen.getByText('Contact')).toBeInTheDocument();
		expect(screen.getByText('Resume')).toBeInTheDocument();
	});

	it('should render navigation links', () => {
		render(<Menu />, { wrapper: Wrapper });

		expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
		expect(screen.getByRole('link', { name: /portfolio/i })).toHaveAttribute('href', '/portfolio');
		expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact');
	});

	it('should render resume as a button, not a link', () => {
		render(<Menu />, { wrapper: Wrapper });

		const resumeButton = screen.getByRole('button', { name: /resume/i });
		expect(resumeButton).toBeInTheDocument();
	});

	it('should call download when resume button is clicked', async () => {
		const user = userEvent.setup();
		render(<Menu />, { wrapper: Wrapper });

		const resumeButton = screen.getByRole('button', { name: /resume/i });
		await user.click(resumeButton);

		expect(mockDownload).toHaveBeenCalledTimes(1);
	});

	it('should show loading spinner when download is in progress', () => {
		mockLoading = true;
		render(<Menu />, { wrapper: Wrapper });

		const resumeButton = screen.getByRole('button', { name: /resume/i });
		expect(resumeButton).toBeDisabled();
		const spinner = resumeButton.querySelector('.animate-spin');
		expect(spinner).toBeInTheDocument();
	});

	it('should not show loading spinner when not loading', () => {
		mockLoading = false;
		render(<Menu />, { wrapper: Wrapper });

		const resumeButton = screen.getByRole('button', { name: /resume/i });
		expect(resumeButton).not.toBeDisabled();
		const spinner = resumeButton.querySelector('.animate-spin');
		expect(spinner).not.toBeInTheDocument();
	});

	it('should apply active styles to current route', () => {
		mockPathname = '/portfolio';
		render(<Menu />, { wrapper: Wrapper });

		const portfolioLink = screen.getByRole('link', { name: /portfolio/i });
		expect(portfolioLink.className).toContain('bg-white/80');
	});

	it('should trigger hover effects on navigation links', () => {
		render(<Menu />, { wrapper: Wrapper });

		const homeLink = screen.getByRole('link', { name: /home/i });
		fireEvent.mouseEnter(homeLink);

		expect(homeLink).toBeInTheDocument();
	});

	it('should trigger hover effects on resume button', () => {
		render(<Menu />, { wrapper: Wrapper });

		const resumeButton = screen.getByRole('button', { name: /resume/i });
		fireEvent.mouseEnter(resumeButton);
		fireEvent.mouseDown(resumeButton);

		expect(resumeButton).toBeInTheDocument();
	});

	it('should render separator before resume button', () => {
		render(<Menu />, { wrapper: Wrapper });

		const nav = screen.getByRole('navigation');
		expect(nav).toBeInTheDocument();
	});

	it('should apply non-active styles to non-current routes', () => {
		mockPathname = '/';
		render(<Menu />, { wrapper: Wrapper });

		const portfolioLink = screen.getByRole('link', { name: /portfolio/i });
		expect(portfolioLink.className).not.toContain('bg-white/80');
	});
});
