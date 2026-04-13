import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const cleanups: (() => void)[] = [];

function trackListeners() {
	const origAdd = document.addEventListener.bind(document);
	vi.spyOn(document, 'addEventListener').mockImplementation(
		(type: string, handler: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
			origAdd(type, handler, options);
			cleanups.push(() => document.removeEventListener(type, handler, options));
		},
	);
}

describe('toast', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.useFakeTimers();
		document.body.innerHTML = '';
		document.documentElement.className = '';
		trackListeners();
	});

	afterEach(() => {
		cleanups.forEach((fn) => fn());
		cleanups.length = 0;
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it('showToast creates a container if none exists', async () => {
		const { showToast } = await import('@/scripts/toast');
		showToast('Hello');
		expect(document.getElementById('toast-container')).not.toBeNull();
	});

	it('showToast reuses existing container', async () => {
		const container = document.createElement('div');
		container.id = 'toast-container';
		document.body.appendChild(container);

		const { showToast } = await import('@/scripts/toast');
		showToast('Hello');
		expect(document.querySelectorAll('#toast-container')).toHaveLength(1);
	});

	it('showToast adds toast element to container', async () => {
		const { showToast } = await import('@/scripts/toast');
		showToast('Test message', 'success');
		const container = document.getElementById('toast-container');
		expect(container?.children).toHaveLength(1);
		expect(container?.children[0].textContent).toContain('Test message');
	});

	it('showToast returns an id string', async () => {
		const { showToast } = await import('@/scripts/toast');
		const id = showToast('Hello');
		expect(typeof id).toBe('string');
		expect(id.length).toBeGreaterThan(0);
	});

	it('showToast auto-removes after duration', async () => {
		const { showToast } = await import('@/scripts/toast');
		showToast('Temporary', 'info', 3000);
		const container = document.getElementById('toast-container');
		expect(container?.children).toHaveLength(1);

		vi.advanceTimersByTime(3000);
		vi.advanceTimersByTime(300);
		expect(container?.children).toHaveLength(0);
	});

	it('showToast with duration 0 does not auto-remove', async () => {
		const { showToast } = await import('@/scripts/toast');
		showToast('Persistent', 'info', 0);
		vi.advanceTimersByTime(60000);
		const container = document.getElementById('toast-container');
		expect(container?.children).toHaveLength(1);
	});

	it('removeToast removes the toast element after animation delay', async () => {
		const { showToast, removeToast } = await import('@/scripts/toast');
		const id = showToast('To remove', 'error', 0);
		const container = document.getElementById('toast-container');
		expect(container?.children).toHaveLength(1);

		removeToast(id);
		vi.advanceTimersByTime(300);
		expect(container?.children).toHaveLength(0);
	});

	it('removeToast is no-op for non-existent id', async () => {
		const { removeToast } = await import('@/scripts/toast');
		expect(() => removeToast('non-existent')).not.toThrow();
	});

	it('close button removes toast via click delegation', async () => {
		const { showToast } = await import('@/scripts/toast');
		const id = showToast('Click close', 'warning', 0);

		const closeBtn = document.querySelector(`[data-toast-close="${id}"]`) as HTMLElement;
		expect(closeBtn).not.toBeNull();
		closeBtn.click();

		vi.advanceTimersByTime(300);
		const container = document.getElementById('toast-container');
		expect(container?.children).toHaveLength(0);
	});

	it('sets window.showToast and window.removeToast', async () => {
		await import('@/scripts/toast');
		expect(typeof window.showToast).toBe('function');
		expect(typeof window.removeToast).toBe('function');
	});

	it('ignores clicks on non-toast-close elements', async () => {
		await import('@/scripts/toast');
		document.body.click();
	});

	it('ignores close button with empty data-toast-close', async () => {
		await import('@/scripts/toast');
		const fakeBtn = document.createElement('button');
		fakeBtn.setAttribute('data-toast-close', '');
		document.body.appendChild(fakeBtn);
		fakeBtn.click();
	});

	it('supports all toast variants', async () => {
		const { showToast } = await import('@/scripts/toast');
		const variants = ['success', 'error', 'warning', 'info'] as const;
		for (const variant of variants) {
			showToast(`Test ${variant}`, variant, 0);
		}
		const container = document.getElementById('toast-container');
		expect(container?.children).toHaveLength(4);
	});
});
