function initProjectDialog() {
	const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]');
	if (!dialog) return;

	// Open dialog from project cards
	document.addEventListener('click', (e) => {
		const card = (e.target as HTMLElement).closest('[data-project-id]');
		if (!card || !dialog) return;

		const projectId = card.getAttribute('data-project-id');
		if (!projectId) return;

		// Find the project data template
		const template = document.querySelector(`[data-project-detail="${projectId}"]`);
		if (!template) return;

		// Populate dialog content
		const dialogContent = dialog.querySelector('[data-dialog-content]');
		if (dialogContent && template) {
			dialogContent.innerHTML = template.innerHTML;
		}

		dialog.showModal();
		document.body.style.overflow = 'hidden';
		initCarousel(dialog);
	});

	// Close dialog
	dialog.addEventListener('click', (e) => {
		const target = e.target as HTMLElement;
		// Close on backdrop click (dialog itself) or close button
		if (target === dialog || target.closest('[data-dialog-close]')) {
			closeDialog(dialog);
		}
	});

	// Close on Escape
	dialog.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			closeDialog(dialog);
		}
	});
}

function closeDialog(dialog: HTMLDialogElement) {
	dialog.close();
	document.body.style.overflow = '';
}

function initCarousel(dialog: HTMLDialogElement) {
	const track = dialog.querySelector<HTMLElement>('[data-carousel-track]');
	const prevBtn = dialog.querySelector('[data-carousel-prev]');
	const nextBtn = dialog.querySelector('[data-carousel-next]');
	const counter = dialog.querySelector<HTMLElement>('[data-carousel-counter]');
	const altText = dialog.querySelector<HTMLElement>('[data-carousel-alt]');
	if (!track) return;

	let currentIndex = 0;
	const slides = track.children;
	const total = slides.length;

	function goTo(index: number) {
		currentIndex = ((index % total) + total) % total;
		track!.style.transform = `translateX(-${currentIndex * 100}%)`;
		if (counter) counter.textContent = `${currentIndex + 1} / ${total}`;
		if (altText) {
			const img = slides[currentIndex].querySelector('img');
			if (img) altText.textContent = img.alt;
		}
	}

	prevBtn?.addEventListener('click', () => goTo(currentIndex - 1));
	nextBtn?.addEventListener('click', () => goTo(currentIndex + 1));

	// Keyboard arrows for carousel
	dialog.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
		if (e.key === 'ArrowRight') goTo(currentIndex + 1);
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initProjectDialog);
} else {
	initProjectDialog();
}

export { initProjectDialog };
