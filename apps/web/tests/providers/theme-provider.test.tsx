import { ThemeProvider, useTheme } from '@/components/providers/theme-provider';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

function TestComponent() {
	const { theme, setTheme } = useTheme();
	return (
		<div>
			<span data-testid='theme'>{theme}</span>
			<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle</button>
		</div>
	);
}

describe('ThemeProvider', () => {
	it('should render children after mounting', async () => {
		render(
			<ThemeProvider>
				<div data-testid='child'>Child</div>
			</ThemeProvider>,
		);

		await waitFor(() => {
			expect(screen.getByTestId('child')).toBeInTheDocument();
		});
	});

	it('should use default theme (dark) when no localStorage value', async () => {
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>,
		);

		await waitFor(() => {
			expect(screen.getByTestId('theme')).toHaveTextContent('dark');
		});
	});

	it('should use custom default theme', async () => {
		render(
			<ThemeProvider defaultTheme='light'>
				<TestComponent />
			</ThemeProvider>,
		);

		await waitFor(() => {
			expect(screen.getByTestId('theme')).toHaveTextContent('light');
		});
	});

	it('should read theme from localStorage', async () => {
		localStorage.setItem('irfnd-ui-theme', 'light');

		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>,
		);

		await waitFor(() => {
			expect(screen.getByTestId('theme')).toHaveTextContent('light');
		});
	});

	it('should use custom storage key', async () => {
		localStorage.setItem('custom-key', 'light');

		render(
			<ThemeProvider storageKey='custom-key'>
				<TestComponent />
			</ThemeProvider>,
		);

		await waitFor(() => {
			expect(screen.getByTestId('theme')).toHaveTextContent('light');
		});
	});

	it('should toggle theme and persist to localStorage', async () => {
		const user = userEvent.setup();

		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>,
		);

		await waitFor(() => {
			expect(screen.getByTestId('theme')).toHaveTextContent('dark');
		});

		await user.click(screen.getByRole('button', { name: 'Toggle' }));

		await waitFor(() => {
			expect(screen.getByTestId('theme')).toHaveTextContent('light');
			expect(localStorage.getItem('irfnd-ui-theme')).toBe('light');
		});
	});

	it('should add theme class to document root', async () => {
		render(
			<ThemeProvider defaultTheme='light'>
				<TestComponent />
			</ThemeProvider>,
		);

		await waitFor(() => {
			expect(document.documentElement.classList.contains('light')).toBe(true);
		});
	});

	it('should remove old theme class when switching', async () => {
		const user = userEvent.setup();

		render(
			<ThemeProvider defaultTheme='dark'>
				<TestComponent />
			</ThemeProvider>,
		);

		await waitFor(() => {
			expect(document.documentElement.classList.contains('dark')).toBe(true);
		});

		await user.click(screen.getByRole('button', { name: 'Toggle' }));

		await waitFor(() => {
			expect(document.documentElement.classList.contains('light')).toBe(true);
			expect(document.documentElement.classList.contains('dark')).toBe(false);
		});
	});
});

describe('useTheme hook', () => {
	it('should return default state when used outside ThemeProvider', () => {
		const { result } = renderHook(() => useTheme());

		expect(result.current.theme).toBe('dark');
		expect(typeof result.current.setTheme).toBe('function');
	});

	it('should call default setTheme which returns null', () => {
		const { result } = renderHook(() => useTheme());

		const returnValue = result.current.setTheme('light');

		expect(returnValue).toBeNull();
	});
});
