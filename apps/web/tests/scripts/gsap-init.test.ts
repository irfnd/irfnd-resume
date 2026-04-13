import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockFromTo = vi.fn();
const mockRegisterPlugin = vi.fn();
const MockScrollTrigger = { name: 'ScrollTrigger' };

vi.mock('gsap', () => ({
	default: { fromTo: mockFromTo, registerPlugin: mockRegisterPlugin },
}));

vi.mock('gsap/ScrollTrigger', () => ({
	ScrollTrigger: MockScrollTrigger,
}));

describe('gsap-init', () => {
	beforeEach(() => {
		vi.resetModules();
		mockFromTo.mockClear();
		mockRegisterPlugin.mockClear();
		document.body.innerHTML = '';

		vi.doMock('gsap', () => ({
			default: { fromTo: mockFromTo, registerPlugin: mockRegisterPlugin },
		}));
		vi.doMock('gsap/ScrollTrigger', () => ({
			ScrollTrigger: MockScrollTrigger,
		}));
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('registers ScrollTrigger plugin', async () => {
		await import('@/scripts/gsap-init');
		expect(mockRegisterPlugin).toHaveBeenCalledWith(MockScrollTrigger);
	});

	it('animates data-gsap-fade elements', async () => {
		document.body.innerHTML = '<div data-gsap-fade>Fade me</div>';
		await import('@/scripts/gsap-init');

		expect(mockFromTo).toHaveBeenCalledWith(
			expect.any(Element),
			{ autoAlpha: 0 },
			expect.objectContaining({ autoAlpha: 1, duration: 0.6 }),
		);
	});

	it('animates data-gsap-slide-up elements', async () => {
		document.body.innerHTML = '<div data-gsap-slide-up>Slide me</div>';
		await import('@/scripts/gsap-init');

		expect(mockFromTo).toHaveBeenCalledWith(
			expect.any(Element),
			{ autoAlpha: 0, y: 30 },
			expect.objectContaining({ autoAlpha: 1, y: 0, duration: 0.6 }),
		);
	});

	it('animates children of data-gsap-stagger containers', async () => {
		document.body.innerHTML = `
			<div data-gsap-stagger>
				<div>Child 1</div>
				<div>Child 2</div>
			</div>
		`;
		await import('@/scripts/gsap-init');

		expect(mockFromTo).toHaveBeenCalledWith(
			expect.any(HTMLCollection),
			{ autoAlpha: 0, y: 20 },
			expect.objectContaining({ autoAlpha: 1, y: 0, stagger: 0.1 }),
		);
	});

	it('skips stagger container with no children', async () => {
		document.body.innerHTML = '<div data-gsap-stagger></div>';
		await import('@/scripts/gsap-init');

		expect(mockFromTo).not.toHaveBeenCalled();
	});

	it('handles multiple elements of each type', async () => {
		document.body.innerHTML = `
			<div data-gsap-fade>A</div>
			<div data-gsap-fade>B</div>
			<div data-gsap-slide-up>C</div>
		`;
		await import('@/scripts/gsap-init');

		expect(mockFromTo).toHaveBeenCalledTimes(3);
	});

	it('does nothing when no animated elements exist', async () => {
		document.body.innerHTML = '<div>No animations</div>';
		await import('@/scripts/gsap-init');
		expect(mockFromTo).not.toHaveBeenCalled();
	});
});
