import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { I18nProvider, ThemeProvider } from '@/components/providers';
import { render, screen, waitFor } from '@testing-library/react';
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

describe('LanguageSwitcher', () => {
	it('should render language trigger button', () => {
		render(<LanguageSwitcher />, { wrapper: Wrapper });
		expect(screen.getByRole('button', { name: /change language/i })).toBeInTheDocument();
	});

	it('should open menu on click', async () => {
		const user = userEvent.setup();
		render(<LanguageSwitcher />, { wrapper: Wrapper });

		await user.click(screen.getByRole('button', { name: /change language/i }));

		await waitFor(() => {
			expect(screen.getByRole('menuitemradio', { name: /English/i })).toBeInTheDocument();
		});
	});

	it('should have both language options', async () => {
		const user = userEvent.setup();
		render(<LanguageSwitcher />, { wrapper: Wrapper });

		await user.click(screen.getByRole('button', { name: /change language/i }));

		await waitFor(() => {
			const options = screen.getAllByRole('menuitemradio');
			expect(options.length).toBe(2);
		});
	});

	it('should change language when option is selected', async () => {
		const user = userEvent.setup();
		render(<LanguageSwitcher />, { wrapper: Wrapper });

		await user.click(screen.getByRole('button', { name: /change language/i }));

		await waitFor(() => {
			expect(screen.getByRole('menuitemradio', { name: /indonesia/i })).toBeInTheDocument();
		});

		await user.click(screen.getByRole('menuitemradio', { name: /indonesia/i }));

		await waitFor(() => {
			expect(screen.queryByRole('menuitemradio')).not.toBeInTheDocument();
		});
	});

	it('should close menu after language selection', async () => {
		const user = userEvent.setup();
		render(<LanguageSwitcher />, { wrapper: Wrapper });

		await user.click(screen.getByRole('button', { name: /change language/i }));

		await waitFor(() => {
			expect(screen.getByRole('menuitemradio', { name: /indonesia/i })).toBeInTheDocument();
		});

		await user.click(screen.getByRole('menuitemradio', { name: /indonesia/i }));

		await waitFor(() => {
			expect(screen.queryByRole('menuitemradio')).not.toBeInTheDocument();
		});
	});
});
