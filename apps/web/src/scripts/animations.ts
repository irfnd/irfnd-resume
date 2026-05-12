import { stagger } from 'motion';
import type { AnimationOptions, DOMKeyframesDefinition } from 'motion';

export const variants: Record<string, DOMKeyframesDefinition> = {
	fade: { opacity: [0, 1] },
	'slide-up': { opacity: [0, 1], y: ['20px', '0px'] },
	stagger: { opacity: [0, 1], y: ['16px', '0px'] },
};

export const timing: Record<string, AnimationOptions> = {
	fade: { duration: 0.7, ease: 'easeOut' },
	'slide-up': { duration: 0.7, ease: [0.25, 0.1, 0.1, 1] },
	stagger: { duration: 0.5, ease: [0.25, 0.1, 0.1, 1], delay: stagger(0.08) },
};
