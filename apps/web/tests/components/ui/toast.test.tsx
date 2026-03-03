import { ToastProvider, useToast } from '@/components/ui/toast';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

function TestComponent() {
	const { toasts, addToast, removeToast } = useToast();
	return (
		<div>
			<span data-testid='toast-count'>{toasts.length}</span>
			<button onClick={() => addToast('Test message', 'success')}>Add Success</button>
			<button onClick={() => addToast('Error message', 'error')}>Add Error</button>
			<button onClick={() => addToast('Warning message', 'warning')}>Add Warning</button>
			<button onClick={() => addToast('Info message', 'info')}>Add Info</button>
			<button onClick={() => addToast('No auto-dismiss', 'info', 0)}>Add Persistent</button>
			{toasts.map((t) => (
				<button key={t.id} onClick={() => removeToast(t.id)} data-testid={`remove-${t.id}`}>
					Remove {t.id}
				</button>
			))}
		</div>
	);
}

describe('ToastProvider', () => {
	it('should render children', () => {
		render(
			<ToastProvider>
				<div data-testid='child'>Child</div>
			</ToastProvider>,
		);

		expect(screen.getByTestId('child')).toBeInTheDocument();
	});

	it('should add a success toast', async () => {
		const user = userEvent.setup();

		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>,
		);

		expect(screen.getByTestId('toast-count')).toHaveTextContent('0');

		await user.click(screen.getByRole('button', { name: 'Add Success' }));

		expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
		expect(screen.getByText('Test message')).toBeInTheDocument();
	});

	it('should add an error toast', async () => {
		const user = userEvent.setup();

		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>,
		);

		await user.click(screen.getByRole('button', { name: 'Add Error' }));

		expect(screen.getByText('Error message')).toBeInTheDocument();
	});

	it('should add a warning toast', async () => {
		const user = userEvent.setup();

		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>,
		);

		await user.click(screen.getByRole('button', { name: 'Add Warning' }));

		expect(screen.getByText('Warning message')).toBeInTheDocument();
	});

	it('should add an info toast', async () => {
		const user = userEvent.setup();

		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>,
		);

		await user.click(screen.getByRole('button', { name: 'Add Info' }));

		expect(screen.getByText('Info message')).toBeInTheDocument();
	});

	it('should auto-dismiss toast after duration', async () => {
		vi.useFakeTimers();

		const TestWithAddToast = () => {
			const { toasts, addToast } = useToast();
			return (
				<div>
					<span data-testid='toast-count'>{toasts.length}</span>
					<button onClick={() => addToast('Auto dismiss', 'info', 100)}>Add</button>
				</div>
			);
		};

		render(
			<ToastProvider>
				<TestWithAddToast />
			</ToastProvider>,
		);

		await act(async () => {
			screen.getByRole('button', { name: 'Add' }).click();
		});

		expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

		await act(async () => {
			vi.advanceTimersByTime(150);
		});

		expect(screen.getByTestId('toast-count')).toHaveTextContent('0');

		vi.useRealTimers();
	});

	it('should not auto-dismiss toast when duration is 0', async () => {
		vi.useFakeTimers();

		const TestWithAddToast = () => {
			const { toasts, addToast } = useToast();
			return (
				<div>
					<span data-testid='toast-count'>{toasts.length}</span>
					<button onClick={() => addToast('Persistent', 'info', 0)}>Add</button>
				</div>
			);
		};

		render(
			<ToastProvider>
				<TestWithAddToast />
			</ToastProvider>,
		);

		await act(async () => {
			screen.getByRole('button', { name: 'Add' }).click();
		});

		expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

		await act(async () => {
			vi.advanceTimersByTime(10000);
		});

		expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

		vi.useRealTimers();
	});

	it('should remove toast when close button is clicked', async () => {
		const user = userEvent.setup();

		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>,
		);

		await user.click(screen.getByRole('button', { name: 'Add Persistent' }));
		expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

		const closeButton = screen.getByRole('button', { name: 'Close' });
		await user.click(closeButton);

		await waitFor(() => {
			expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
		});
	});

	it('should remove toast via removeToast callback', async () => {
		const user = userEvent.setup();

		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>,
		);

		await user.click(screen.getByRole('button', { name: 'Add Persistent' }));
		expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

		const removeButtons = screen.getAllByRole('button').filter((btn) => btn.textContent?.startsWith('Remove '));
		await user.click(removeButtons[0]);

		await waitFor(() => {
			expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
		});
	});

	it('should handle multiple toasts', async () => {
		const user = userEvent.setup();

		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>,
		);

		await user.click(screen.getByRole('button', { name: 'Add Persistent' }));
		await user.click(screen.getByRole('button', { name: 'Add Persistent' }));
		await user.click(screen.getByRole('button', { name: 'Add Persistent' }));

		expect(screen.getByTestId('toast-count')).toHaveTextContent('3');
	});
});

describe('useToast hook', () => {
	it('should throw error when used outside ToastProvider', () => {
		expect(() => {
			renderHook(() => useToast());
		}).toThrow('useToast must be used within a ToastProvider');
	});

	it('should return toast context when used inside ToastProvider', () => {
		const { result } = renderHook(() => useToast(), {
			wrapper: ({ children }) => <ToastProvider>{children}</ToastProvider>,
		});

		expect(result.current.toasts).toEqual([]);
		expect(typeof result.current.addToast).toBe('function');
		expect(typeof result.current.removeToast).toBe('function');
	});
});
