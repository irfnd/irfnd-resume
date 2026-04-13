export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
	id: string;
	message: string;
	variant: ToastVariant;
	element: HTMLElement;
	timer?: ReturnType<typeof setTimeout>;
}

const toasts: ToastItem[] = [];

const iconMap: Record<ToastVariant, string> = {
	success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
	error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
	warning:
		'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
	info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};

const colorMap: Record<ToastVariant, string> = {
	success: 'border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200',
	error: 'border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200',
	warning: 'border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
	info: 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
};

function getContainer(): HTMLElement {
	let container = document.getElementById('toast-container');
	if (!container) {
		container = document.createElement('div');
		container.id = 'toast-container';
		container.className = 'fixed top-4 right-4 z-80 flex flex-col gap-2 max-w-sm w-full pointer-events-none';
		document.body.appendChild(container);
	}
	return container;
}

function removeToast(id: string) {
	const index = toasts.findIndex((t) => t.id === id);
	if (index === -1) return;
	const toast = toasts[index];
	if (toast.timer) clearTimeout(toast.timer);
	toast.element.classList.add('opacity-0', 'translate-x-full');
	setTimeout(() => {
		toast.element.remove();
		toasts.splice(index, 1);
	}, 300);
}

function showToast(message: string, variant: ToastVariant = 'info', duration = 5000) {
	const id = crypto.randomUUID();
	const container = getContainer();

	const el = document.createElement('div');
	el.className = `pointer-events-auto flex items-start gap-3 rounded-lg border-l-4 px-4 py-3 shadow-lg transition-all duration-300 ${colorMap[variant]}`;
	el.innerHTML = `
    <svg class="size-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="${iconMap[variant]}" />
    </svg>
    <p class="text-sm font-medium flex-1">${message}</p>
    <button class="shrink-0 ml-2 opacity-60 hover:opacity-100 cursor-pointer" data-toast-close="${id}" aria-label="Close">
      <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  `;

	container.appendChild(el);

	const item: ToastItem = { id, message, variant, element: el };
	if (duration > 0) {
		item.timer = setTimeout(() => removeToast(id), duration);
	}
	toasts.push(item);

	return id;
}

// Close button handler
document.addEventListener('click', (e) => {
	const btn = (e.target as HTMLElement).closest('[data-toast-close]');
	/* v8 ignore next 4 -- @preserve */
	if (btn) {
		const id = btn.getAttribute('data-toast-close');
		if (id) removeToast(id);
	}
});

// Expose globally for other scripts
declare global {
	interface Window {
		showToast: typeof showToast;
		removeToast: typeof removeToast;
	}
}
window.showToast = showToast;
window.removeToast = removeToast;

export { removeToast, showToast };
export type { ToastItem };
