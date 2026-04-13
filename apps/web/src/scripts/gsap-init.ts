import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function initGSAP() {
	// Fade-in animations
	document.querySelectorAll('[data-gsap-fade]').forEach((el) => {
		gsap.fromTo(
			el,
			{ autoAlpha: 0 },
			{
				autoAlpha: 1,
				duration: 0.6,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: el,
					start: 'top 85%',
					toggleActions: 'play none none none',
				},
			},
		);
	});

	// Slide-up animations
	document.querySelectorAll('[data-gsap-slide-up]').forEach((el) => {
		gsap.fromTo(
			el,
			{ autoAlpha: 0, y: 30 },
			{
				autoAlpha: 1,
				y: 0,
				duration: 0.6,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: el,
					start: 'top 85%',
					toggleActions: 'play none none none',
				},
			},
		);
	});

	// Stagger animations
	document.querySelectorAll('[data-gsap-stagger]').forEach((container) => {
		const children = container.children;
		if (!children.length) return;

		gsap.fromTo(
			children,
			{ autoAlpha: 0, y: 20 },
			{
				autoAlpha: 1,
				y: 0,
				duration: 0.4,
				stagger: 0.1,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: container,
					start: 'top 85%',
					toggleActions: 'play none none none',
				},
			},
		);
	});
}

// Run on DOM ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initGSAP);
} else {
	initGSAP();
}

export { initGSAP };
