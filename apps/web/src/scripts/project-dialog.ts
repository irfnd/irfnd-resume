import { animate } from 'motion';

let carouselKeyHandler: ((e: KeyboardEvent) => void) | null = null;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let isClosing = false;

// Document-level: opens dialog — runs once at module load
document.addEventListener('click', (e) => {
	const card = (e.target as HTMLElement).closest('[data-project-id]');
	if (!card) return;

	const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]');
	if (!dialog) return;

	const projectId = card.getAttribute('data-project-id');
	if (!projectId) return;

	const template = document.querySelector(`[data-project-detail="${projectId}"]`);
	if (!template) return;

	const dialogContent = dialog.querySelector('[data-dialog-content]');
	if (dialogContent) {
		dialogContent.innerHTML = template.innerHTML;
	}

	if (!reduced) dialog.style.opacity = '0';
	dialog.showModal();
	document.body.style.overflow = 'hidden';
	initCarousel(dialog);

	if (!reduced) {
		animate(dialog, { opacity: [0, 1], scale: [0.95, 1] }, { duration: 0.3, ease: [0.25, 0.1, 0.1, 1] });
	} else {
		dialog.style.opacity = '';
	}
});

async function closeDialog(dialog: HTMLDialogElement) {
	if (isClosing) return;
	if (!reduced) {
		isClosing = true;
		dialog.classList.add('is-closing');
		await animate(dialog, { opacity: [1, 0], scale: [1, 0.95] }, { duration: 0.2, ease: 'easeIn' });
		dialog.classList.remove('is-closing');
		isClosing = false;
	}
	dialog.close();
	dialog.style.opacity = '';
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
		if (reduced) {
			track!.style.transform = `translateX(-${currentIndex * 100}%)`;
		} else {
			animate(track!, { x: `-${currentIndex * 100}%` }, { duration: 0.35, ease: [0.25, 0.1, 0.1, 1] });
		}
		if (counter) counter.textContent = `${currentIndex + 1} / ${total}`;
		if (altText) {
			const img = slides[currentIndex].querySelector('img');
			if (img) altText.textContent = img.alt;
		}
	}

	prevBtn?.addEventListener('click', () => goTo(currentIndex - 1));
	nextBtn?.addEventListener('click', () => goTo(currentIndex + 1));

	// Remove previous carousel key handler before adding new one
	if (carouselKeyHandler) {
		dialog.removeEventListener('keydown', carouselKeyHandler);
	}
	carouselKeyHandler = (e: KeyboardEvent) => {
		if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
		if (e.key === 'ArrowRight') goTo(currentIndex + 1);
	};
	dialog.addEventListener('keydown', carouselKeyHandler);
}

// Per-page: bind dialog close listeners — runs on every navigation
function setupProjectDialog() {
	const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]');
	if (!dialog || dialog.dataset.bound) return;
	dialog.dataset.bound = '1';

	dialog.addEventListener('click', (e) => {
		const target = e.target as HTMLElement;
		if (target === dialog || target.closest('[data-dialog-close]')) {
			closeDialog(dialog);
		}
	});

	// Intercept native Escape close so we can play the exit animation first
	dialog.addEventListener('cancel', (e) => {
		e.preventDefault();
		closeDialog(dialog);
	});
}

document.addEventListener('astro:page-load', setupProjectDialog);

export { initCarousel, setupProjectDialog };
