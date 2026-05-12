import { animate, scroll } from 'motion';
import { variants, timing } from './animations';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let entryObserver: IntersectionObserver | null = null;

function setupEntries() {
	entryObserver?.disconnect();
	entryObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const el = entry.target as HTMLElement;
				const variant = el.dataset.animate as string;
				if (!variants[variant]) return;

				if (reduced) {
					const targets = variant === 'stagger' ? Array.from(el.children) : [el];
					targets.forEach((t) => Object.assign((t as HTMLElement).style, { opacity: '1', transform: 'none' }));
				} else {
					const targets = variant === 'stagger' ? Array.from(el.children) : [el];
					animate(targets as Element[], variants[variant], timing[variant]);
				}
				el.dataset.animated = '1';
				entryObserver!.unobserve(el);
			});
		},
		{ threshold: 0.1 },
	);

	document.querySelectorAll<HTMLElement>('[data-animate]').forEach((el) => {
		if (!el.dataset.animated) entryObserver!.observe(el);
	});
}

function setupTimelineBeams() {
	document.querySelectorAll<HTMLElement>('[data-timeline-beam]').forEach((beam) => {
		if (reduced) {
			beam.style.transform = 'scaleY(1)';
			return;
		}
		if (!beam.parentElement) return;
		scroll(animate(beam, { scaleY: [0, 1] }, { ease: 'linear' }), {
			target: beam.parentElement,
			offset: ['start 80%', 'end 20%'],
		});
	});
}

function setup() {
	setupEntries();
	setupTimelineBeams();
}

document.addEventListener('astro:page-load', setup);
