import { createContactSchema } from '@irfnd/schemas';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.PUBLIC_API_KEY || '';

function initContactForm() {
	const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
	if (!form) return;

	const submitBtn = form.querySelector<HTMLButtonElement>('[data-submit-btn]');
	const submitText = submitBtn?.querySelector('[data-submit-text]');
	const loadingText = submitBtn?.querySelector('[data-loading-text]');

	// Get validation messages from data attributes
	const validationData = form.dataset.validation;
	const errorsData = form.dataset.errors;
	const successMessage = form.dataset.successMessage || 'Message sent!';

	const validation = validationData ? JSON.parse(validationData) : {};
	const errors = errorsData ? JSON.parse(errorsData) : {};
	const schema = createContactSchema(validation);

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		// Clear previous errors
		form.querySelectorAll('[data-field-error]').forEach((el) => {
			el.textContent = '';
		});

		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());

		// Validate
		const result = schema.safeParse(data);
		if (!result.success) {
			result.error.issues.forEach((issue) => {
				const field = String(issue.path[0]);
				const errorEl = form.querySelector(`[data-field-error="${field}"]`);
				if (errorEl) errorEl.textContent = issue.message;
			});
			return;
		}

		// Show loading
		if (submitBtn) submitBtn.disabled = true;
		if (submitText) submitText.classList.add('hidden');
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
				window.showToast(errors.rateLimited || 'Too many requests', 'error');
				return;
			}
			if (response.status === 400) {
				window.showToast(errors.validationError || 'Invalid data', 'error');
				return;
			}
			if (!response.ok) {
				window.showToast(errors.serverError || 'Server error', 'error');
				return;
			}

			window.showToast(successMessage, 'success');
			form.reset();
		} catch {
			window.showToast(errors.networkError || 'Network error', 'error');
		} finally {
			if (submitBtn) submitBtn.disabled = false;
			if (submitText) submitText.classList.remove('hidden');
			if (loadingText) loadingText.classList.add('hidden');
		}
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initContactForm);
} else {
	initContactForm();
}

export { initContactForm };
