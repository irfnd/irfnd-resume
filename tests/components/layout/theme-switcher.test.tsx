import { ThemeSwitcher } from '@/components/layout/theme-switcher';
import { I18nProvider, ThemeProvider } from '@/components/providers';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

function Wrapper({ children }: { children: ReactNode }) {
	return (
		<I18nProvider defaultLang='en'>
			<ThemeProvider defaultTheme='dark'>{children}</ThemeProvider>
		</I18nProvider>
	);
}

describe('ThemeSwitcher', () => {
	it('should render theme toggle button', () => {
		render(<ThemeSwitcher />, { wrapper: Wrapper });
		expect(screen.getByRole('button', { name: /change theme/i })).toBeInTheDocument();
	});

	it('should toggle theme on click', async () => {
		const user = userEvent.setup();
		render(<ThemeSwitcher />, { wrapper: Wrapper });

		const button = screen.getByRole('button', { name: /change theme/i });

		expect(document.documentElement.classList.contains('dark')).toBe(true);

		await user.click(button);

		expect(document.documentElement.classList.contains('dark')).toBe(false);
	});

	it('should toggle back to dark', async () => {
		const user = userEvent.setup();
		render(<ThemeSwitcher />, { wrapper: Wrapper });

		const button = screen.getByRole('button', { name: /change theme/i });

		await user.click(button);
		await user.click(button);

		expect(document.documentElement.classList.contains('dark')).toBe(true);
	});
});
