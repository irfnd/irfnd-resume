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

const VALIDATION = {
	fullName: { min: 'Name min 2', max: 'Name max 100' },
	email: { invalid: 'Invalid email' },
	telephone: { min: 'Phone min 5', max: 'Phone max 20' },
	subject: { min: 'Subject min 2', max: 'Subject max 200' },
	message: { min: 'Message min 10', max: 'Message max 5000' },
};

const ERRORS = {
	rateLimited: 'Rate limited',
	networkError: 'Network error',
	serverError: 'Server error',
	validationError: 'Validation error',
};

function buildFormHTML() {
	return `
		<form data-contact-form data-validation='${JSON.stringify(VALIDATION)}' data-errors='${JSON.stringify(ERRORS)}'>
			<input data-field="fullName" name="fullName" value="Test User" />
			<span data-field-error="fullName" class="hidden"></span>
			<input data-field="email" name="email" value="test@example.com" />
			<span data-field-error="email" class="hidden"></span>
			<input data-field="telephone" name="telephone" value="1234567890" />
			<span data-field-error="telephone" class="hidden"></span>
			<input data-field="subject" name="subject" value="Hello There" />
			<span data-field-error="subject" class="hidden"></span>
			<textarea data-field="message" name="message">This is a test message that is long enough.</textarea>
			<span data-field-error="message" class="hidden"></span>
			<button data-submit-btn type="submit">
				<span data-submit-text>Send</span>
				<span data-loading-text class="hidden">Sending...</span>
			</button>
		</form>
		<div data-contact-success class="hidden"></div>
	`;
}

function submitForm() {
	const form = document.querySelector<HTMLFormElement>('[data-contact-form]')!;
	form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

describe('contact-form', () => {
	beforeEach(() => {
		vi.resetModules();
		document.body.innerHTML = buildFormHTML();
		window.showToast = vi.fn() as unknown as typeof window.showToast;
		window.removeToast = vi.fn() as unknown as typeof window.removeToast;
		vi.stubGlobal('fetch', vi.fn());
		trackListeners();
	});

	afterEach(() => {
		cleanups.forEach((fn) => fn());
		cleanups.length = 0;
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
		document.body.innerHTML = '';
	});

	it('does not crash when no form element exists', async () => {
		document.body.innerHTML = '';
		await expect(import('@/scripts/contact-form')).resolves.toBeDefined();
	});

	it('submits form successfully and shows success overlay', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));

		await import('@/scripts/contact-form');
		submitForm();

		await vi.waitFor(() => {
			expect(fetch).toHaveBeenCalledTimes(1);
		});

		const successOverlay = document.querySelector('[data-contact-success]');
		expect(successOverlay?.classList.contains('hidden')).toBe(false);
		expect(successOverlay?.classList.contains('flex')).toBe(true);
	});

	it('shows validation errors for invalid data', async () => {
		const emailInput = document.querySelector<HTMLInputElement>('[data-field="email"]')!;
		emailInput.value = 'not-an-email';

		await import('@/scripts/contact-form');
		submitForm();

		await vi.waitFor(() => {
			const errorEl = document.querySelector('[data-field-error="email"]');
			expect(errorEl?.classList.contains('hidden')).toBe(false);
		});
		expect(fetch).not.toHaveBeenCalled();
	});

	it('shows error styles on invalid fields', async () => {
		const nameInput = document.querySelector<HTMLInputElement>('[data-field="fullName"]')!;
		nameInput.value = 'A';

		await import('@/scripts/contact-form');
		submitForm();

		await vi.waitFor(() => {
			const fieldEl = document.querySelector('[data-field="fullName"]');
			expect(fieldEl?.classList.contains('border-red-500')).toBe(true);
		});
	});

	it('handles rate limit (429) response', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 429 }));

		await import('@/scripts/contact-form');
		submitForm();

		await vi.waitFor(() => {
			expect(window.showToast).toHaveBeenCalledWith('Rate limited', 'error');
		});
	});

	it('handles validation error (400) response', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 400 }));

		await import('@/scripts/contact-form');
		submitForm();

		await vi.waitFor(() => {
			expect(window.showToast).toHaveBeenCalledWith('Validation error', 'error');
		});
	});

	it('handles server error (500) response', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }));

		await import('@/scripts/contact-form');
		submitForm();

		await vi.waitFor(() => {
			expect(window.showToast).toHaveBeenCalledWith('Server error', 'error');
		});
	});

	it('handles network error', async () => {
		vi.mocked(fetch).mockRejectedValueOnce(new Error('Network failure'));

		await import('@/scripts/contact-form');
		submitForm();

		await vi.waitFor(() => {
			expect(window.showToast).toHaveBeenCalledWith('Network error', 'error');
		});
	});

	it('toggles loading state during submission', async () => {
		let resolveFetch!: (value: Response) => void;
		vi.mocked(fetch).mockImplementationOnce(
			() => new Promise<Response>((resolve) => { resolveFetch = resolve; }),
		);

		await import('@/scripts/contact-form');
		submitForm();

		await vi.waitFor(() => {
			const submitBtn = document.querySelector<HTMLButtonElement>('[data-submit-btn]')!;
			expect(submitBtn.disabled).toBe(true);
			const submitText = document.querySelector('[data-submit-text]');
			expect(submitText?.classList.contains('hidden')).toBe(true);
			const loadingText = document.querySelector('[data-loading-text]');
			expect(loadingText?.classList.contains('hidden')).toBe(false);
		});

		resolveFetch(new Response(JSON.stringify({ ok: true }), { status: 200 }));

		await vi.waitFor(() => {
			const submitBtn = document.querySelector<HTMLButtonElement>('[data-submit-btn]')!;
			expect(submitBtn.disabled).toBe(false);
		});
	});

	it('clears previous errors before new submission', async () => {
		const emailInput = document.querySelector<HTMLInputElement>('[data-field="email"]')!;
		emailInput.value = 'bad';

		await import('@/scripts/contact-form');
		submitForm();

		await vi.waitFor(() => {
			const errorEl = document.querySelector('[data-field-error="email"]');
			expect(errorEl?.classList.contains('hidden')).toBe(false);
		});

		emailInput.value = 'good@example.com';
		vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }));
		submitForm();

		await vi.waitFor(() => {
			const errorEl = document.querySelector('[data-field-error="email"]');
			expect(errorEl?.classList.contains('hidden')).toBe(true);
		});
	});
});
