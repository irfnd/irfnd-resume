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

function buildDialogHTML() {
	return `
		<div data-project-id="project-1">Click to open</div>
		<div data-project-detail="project-1">
			<div data-carousel-track>
				<div><img alt="First Slide" /></div>
				<div><img alt="Second Slide" /></div>
				<div><img alt="Third Slide" /></div>
			</div>
			<button data-carousel-prev>Prev</button>
			<button data-carousel-next>Next</button>
			<span data-carousel-alt>First Slide</span>
			<span data-carousel-counter>1 / 3</span>
		</div>
		<dialog data-project-dialog>
			<div data-dialog-content></div>
			<button data-dialog-close>Close</button>
		</dialog>
	`;
}

describe('project-dialog', () => {
	beforeEach(() => {
		vi.resetModules();
		document.body.innerHTML = buildDialogHTML();
		trackListeners();

		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;
		if (!dialog.showModal) {
			dialog.showModal = vi.fn();
		} else {
			vi.spyOn(dialog, 'showModal').mockImplementation(() => {});
		}
		if (!dialog.close) {
			dialog.close = vi.fn();
		} else {
			vi.spyOn(dialog, 'close').mockImplementation(() => {});
		}
	});

	afterEach(() => {
		cleanups.forEach((fn) => fn());
		cleanups.length = 0;
		vi.restoreAllMocks();
		document.body.innerHTML = '';
	});

	it('does not crash when no dialog exists', async () => {
		document.body.innerHTML = '';
		await expect(import('@/scripts/project-dialog')).resolves.toBeDefined();
	});

	it('opens dialog when project card is clicked', async () => {
		await import('@/scripts/project-dialog');
		const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;

		card.click();

		expect(dialog.showModal).toHaveBeenCalled();
		expect(document.body.style.overflow).toBe('hidden');
	});

	it('populates dialog content from template', async () => {
		await import('@/scripts/project-dialog');
		const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
		card.click();

		const dialogContent = document.querySelector('[data-dialog-content]');
		expect(dialogContent?.innerHTML).toContain('First Slide');
	});

	it('closes dialog when close button is clicked', async () => {
		await import('@/scripts/project-dialog');
		const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;

		card.click();

		const closeBtn = dialog.querySelector('[data-dialog-close]') as HTMLElement;
		const clickEvent = new MouseEvent('click', { bubbles: true });
		Object.defineProperty(clickEvent, 'target', { value: closeBtn });
		dialog.dispatchEvent(clickEvent);

		expect(dialog.close).toHaveBeenCalled();
	});

	it('closes dialog on backdrop click (target === dialog)', async () => {
		await import('@/scripts/project-dialog');
		const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;

		card.click();

		const clickEvent = new MouseEvent('click', { bubbles: true });
		Object.defineProperty(clickEvent, 'target', { value: dialog });
		dialog.dispatchEvent(clickEvent);

		expect(dialog.close).toHaveBeenCalled();
		expect(document.body.style.overflow).toBe('');
	});

	it('closes dialog on Escape key', async () => {
		await import('@/scripts/project-dialog');
		const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;

		card.click();

		dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		expect(dialog.close).toHaveBeenCalled();
	});

	it('does not close on non-Escape key', async () => {
		await import('@/scripts/project-dialog');
		const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;

		card.click();
		vi.mocked(dialog.close).mockClear();

		dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		expect(dialog.close).not.toHaveBeenCalled();
	});

	it('ignores click on card with no matching template', async () => {
		const orphanCard = document.createElement('div');
		orphanCard.setAttribute('data-project-id', 'nonexistent');
		document.body.appendChild(orphanCard);

		await import('@/scripts/project-dialog');
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;

		orphanCard.click();
		expect(dialog.showModal).not.toHaveBeenCalled();
	});

	it('ignores click on card with empty project id', async () => {
		const emptyCard = document.createElement('div');
		emptyCard.setAttribute('data-project-id', '');
		document.body.appendChild(emptyCard);

		await import('@/scripts/project-dialog');
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;

		emptyCard.click();
		expect(dialog.showModal).not.toHaveBeenCalled();
	});

	describe('carousel', () => {
		it('navigates to next slide', async () => {
			await import('@/scripts/project-dialog');
			const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
			const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;
			card.click();

			// Query from dialog — carousel elements are cloned into dialog content
			const track = dialog.querySelector<HTMLElement>('[data-carousel-track]')!;
			const nextBtn = dialog.querySelector('[data-carousel-next]') as HTMLElement;

			nextBtn.click();
			expect(track.style.transform).toBe('translateX(-100%)');

			nextBtn.click();
			expect(track.style.transform).toBe('translateX(-200%)');
		});

		it('navigates to previous slide (wraps around)', async () => {
			await import('@/scripts/project-dialog');
			const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
			const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;
			card.click();

			const track = dialog.querySelector<HTMLElement>('[data-carousel-track]')!;
			const prevBtn = dialog.querySelector('[data-carousel-prev]') as HTMLElement;

			prevBtn.click();
			expect(track.style.transform).toBe('translateX(-200%)');
		});

		it('navigates via arrow keys', async () => {
			await import('@/scripts/project-dialog');
			const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
			const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;
			card.click();

			const track = dialog.querySelector<HTMLElement>('[data-carousel-track]')!;

			dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
			expect(track.style.transform).toBe('translateX(-100%)');

			dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
			expect(track.style.transform).toBe('translateX(-0%)');
		});

		it('wraps forward past last slide', async () => {
			await import('@/scripts/project-dialog');
			const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
			const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;
			card.click();

			const track = dialog.querySelector<HTMLElement>('[data-carousel-track]')!;
			const nextBtn = dialog.querySelector('[data-carousel-next]') as HTMLElement;

			nextBtn.click(); // 1
			nextBtn.click(); // 2
			nextBtn.click(); // wraps to 0
			expect(track.style.transform).toBe('translateX(-0%)');
		});

		it('updates counter and alt text on navigation', async () => {
			await import('@/scripts/project-dialog');
			const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
			const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;
			card.click();

			const counter = dialog.querySelector('[data-carousel-counter]')!;
			const altText = dialog.querySelector('[data-carousel-alt]')!;
			const nextBtn = dialog.querySelector('[data-carousel-next]') as HTMLElement;
			const prevBtn = dialog.querySelector('[data-carousel-prev]') as HTMLElement;

			expect(counter.textContent).toBe('1 / 3');
			expect(altText.textContent).toBe('First Slide');

			nextBtn.click();
			expect(counter.textContent).toBe('2 / 3');
			expect(altText.textContent).toBe('Second Slide');

			nextBtn.click();
			expect(counter.textContent).toBe('3 / 3');
			expect(altText.textContent).toBe('Third Slide');

			prevBtn.click();
			expect(counter.textContent).toBe('2 / 3');
			expect(altText.textContent).toBe('Second Slide');
		});

		it('updates counter on keyboard navigation', async () => {
			await import('@/scripts/project-dialog');
			const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
			const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;
			card.click();

			const counter = dialog.querySelector('[data-carousel-counter]')!;

			dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
			expect(counter.textContent).toBe('2 / 3');

			dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
			expect(counter.textContent).toBe('1 / 3');
		});
	});

	it('initializes via DOMContentLoaded when readyState is loading', async () => {
		Object.defineProperty(document, 'readyState', {
			value: 'loading',
			writable: true,
			configurable: true,
		});

		await import('@/scripts/project-dialog');

		document.dispatchEvent(new Event('DOMContentLoaded'));

		Object.defineProperty(document, 'readyState', {
			value: 'complete',
			writable: true,
			configurable: true,
		});

		expect(document.querySelector('[data-project-dialog]')).not.toBeNull();
	});

	it('handles dialog without content container', async () => {
		document.body.innerHTML = `
			<div data-project-id="project-1">Click</div>
			<div data-project-detail="project-1"><p>Detail</p></div>
			<dialog data-project-dialog>
				<button data-dialog-close>Close</button>
			</dialog>
		`;
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;
		dialog.showModal = vi.fn();
		dialog.close = vi.fn();

		await import('@/scripts/project-dialog');
		const card = document.querySelector('[data-project-id]') as HTMLElement;
		card.click();

		expect(dialog.showModal).toHaveBeenCalled();
	});

	it('handles dialog content without carousel track', async () => {
		document.body.innerHTML = `
			<div data-project-id="project-1">Click</div>
			<div data-project-detail="project-1"><p>No carousel here</p></div>
			<dialog data-project-dialog>
				<div data-dialog-content></div>
				<button data-dialog-close>Close</button>
			</dialog>
		`;
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;
		dialog.showModal = vi.fn();
		dialog.close = vi.fn();

		await import('@/scripts/project-dialog');
		const card = document.querySelector('[data-project-id]') as HTMLElement;
		card.click();

		expect(dialog.showModal).toHaveBeenCalled();
	});

	it('carousel works without counter or alt elements', async () => {
		document.body.innerHTML = `
			<div data-project-id="project-1">Click</div>
			<div data-project-detail="project-1">
				<div data-carousel-track>
					<div>Slide 1</div>
					<div>Slide 2</div>
				</div>
				<button data-carousel-prev>Prev</button>
				<button data-carousel-next>Next</button>
			</div>
			<dialog data-project-dialog>
				<div data-dialog-content></div>
				<button data-dialog-close>Close</button>
			</dialog>
		`;
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;
		dialog.showModal = vi.fn();
		dialog.close = vi.fn();

		await import('@/scripts/project-dialog');
		const card = document.querySelector('[data-project-id]') as HTMLElement;
		card.click();

		const track = dialog.querySelector<HTMLElement>('[data-carousel-track]')!;
		const nextBtn = dialog.querySelector('[data-carousel-next]') as HTMLElement;

		nextBtn.click();
		expect(track.style.transform).toBe('translateX(-100%)');
	});

	it('handles slide without img for alt text', async () => {
		document.body.innerHTML = `
			<div data-project-id="project-1">Click</div>
			<div data-project-detail="project-1">
				<div data-carousel-track>
					<div><img alt="Has Image" /></div>
					<div><span>No image here</span></div>
				</div>
				<button data-carousel-prev>Prev</button>
				<button data-carousel-next>Next</button>
				<span data-carousel-alt>Has Image</span>
				<span data-carousel-counter>1 / 2</span>
			</div>
			<dialog data-project-dialog>
				<div data-dialog-content></div>
				<button data-dialog-close>Close</button>
			</dialog>
		`;
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;
		dialog.showModal = vi.fn();
		dialog.close = vi.fn();

		await import('@/scripts/project-dialog');
		const card = document.querySelector('[data-project-id]') as HTMLElement;
		card.click();

		const altText = dialog.querySelector('[data-carousel-alt]')!;
		const nextBtn = dialog.querySelector('[data-carousel-next]') as HTMLElement;

		nextBtn.click();
		// Alt text should remain unchanged since slide 2 has no img
		expect(altText.textContent).toBe('Has Image');
	});

	it('handles dialog click that is not close button or backdrop', async () => {
		await import('@/scripts/project-dialog');
		const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;
		card.click();
		vi.mocked(dialog.close).mockClear();

		const dialogContent = dialog.querySelector('[data-dialog-content]') as HTMLElement;
		const clickEvent = new MouseEvent('click', { bubbles: true });
		Object.defineProperty(clickEvent, 'target', { value: dialogContent });
		dialog.dispatchEvent(clickEvent);

		expect(dialog.close).not.toHaveBeenCalled();
	});
});
