import { createContactSchema } from '@irfnd/schemas';

/* v8 ignore start -- @preserve */
const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.PUBLIC_API_KEY || '';
/* v8 ignore stop */

function initContactForm() {
	const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
	if (!form) return;

	const submitBtn = form.querySelector<HTMLButtonElement>('[data-submit-btn]');
	const submitText = submitBtn?.querySelector('[data-submit-text]');
	const loadingText = submitBtn?.querySelector('[data-loading-text]');
	const successOverlay = document.querySelector('[data-contact-success]');

	// Get validation messages from data attributes
	const validationData = form.dataset.validation;
	const errorsData = form.dataset.errors;
	const validation = validationData ? JSON.parse(validationData) : /* v8 ignore next -- @preserve */ {};
	const errors = errorsData ? JSON.parse(errorsData) : /* v8 ignore next -- @preserve */ {};
	const schema = createContactSchema(validation);

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		// Clear previous errors
		form.querySelectorAll('[data-field-error]').forEach((el) => {
			el.textContent = '';
			el.classList.add('hidden');
		});

		// Reset field border styles
		form.querySelectorAll('[data-field]').forEach((el) => {
			el.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/10');
			el.classList.add('border-border', 'focus:border-primary', 'focus:ring-primary/10');
		});

		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());

		// Validate
		const result = schema.safeParse(data);
		if (!result.success) {
			result.error.issues.forEach((issue) => {
				const field = String(issue.path[0]);
				const errorEl = form.querySelector(`[data-field-error="${field}"]`);
				const fieldEl = form.querySelector(`[data-field="${field}"]`);
				/* v8 ignore next 4 -- @preserve */
				if (errorEl) {
					errorEl.textContent = issue.message;
					errorEl.classList.remove('hidden');
				}
				/* v8 ignore next 4 -- @preserve */
				if (fieldEl) {
					fieldEl.classList.remove('border-border', 'focus:border-primary', 'focus:ring-primary/10');
					fieldEl.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/10');
				}
			});
			return;
		}

		// Show loading
		/* v8 ignore next -- @preserve */
		if (submitBtn) submitBtn.disabled = true;
		/* v8 ignore next -- @preserve */
		if (submitText) submitText.classList.add('hidden');
		/* v8 ignore next -- @preserve */
		if (loadingText) loadingText.classList.remove('hidden');

		try {
			const response = await fetch(`${API_URL}/contact`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-API-Key': API_KEY,
				},
				body: JSON.stringify(result.data),
			});

			if (response.status === 429) {
				/* v8 ignore next -- @preserve */
				window.showToast(errors.rateLimited || 'Too many requests', 'error');
				return;
			}
			if (response.status === 400) {
				/* v8 ignore next -- @preserve */
				window.showToast(errors.validationError || 'Invalid data', 'error');
				return;
			}
			if (!response.ok) {
				/* v8 ignore next -- @preserve */
				window.showToast(errors.serverError || 'Server error', 'error');
				return;
			}

			// Show success overlay
			/* v8 ignore next 4 -- @preserve */
			if (successOverlay) {
				successOverlay.classList.remove('hidden');
				successOverlay.classList.add('flex');
			}
			form.reset();
		} catch {
			/* v8 ignore next -- @preserve */
			window.showToast(errors.networkError || 'Network error', 'error');
		} finally {
			/* v8 ignore next -- @preserve */
			if (submitBtn) submitBtn.disabled = false;
			/* v8 ignore next -- @preserve */
			if (submitText) submitText.classList.remove('hidden');
			/* v8 ignore next -- @preserve */
			if (loadingText) loadingText.classList.add('hidden');
		}
	});
}

/* v8 ignore next -- @preserve */
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initContactForm);
} else {
	initContactForm();
}

export { initContactForm };
