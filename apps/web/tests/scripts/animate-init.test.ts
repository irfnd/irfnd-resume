import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockAnimationControls = {};
const mockAnimate = vi.fn(() => mockAnimationControls);
const mockScroll = vi.fn();

vi.mock('motion', () => ({
	animate: mockAnimate,
	scroll: mockScroll,
	stagger: vi.fn(() => 0),
}));

const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
const mockUnobserve = vi.fn();
let observerCallback: IntersectionObserverCallback | null = null;

function MockIntersectionObserver(callback: IntersectionObserverCallback) {
	observerCallback = callback;
	return { observe: mockObserve, disconnect: mockDisconnect, unobserve: mockUnobserve };
}

function fireIntersection(el: Element, isIntersecting: boolean) {
	observerCallback?.([{ isIntersecting, target: el } as IntersectionObserverEntry], {} as IntersectionObserver);
}

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

describe('animate-init', () => {
	beforeEach(() => {
		vi.resetModules();
		document.body.innerHTML = '';
		mockAnimate.mockClear();
		mockScroll.mockClear();
		mockObserve.mockClear();
		mockDisconnect.mockClear();
		mockUnobserve.mockClear();
		observerCallback = null;
		vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
		vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
		trackListeners();
	});

	afterEach(() => {
		cleanups.forEach((fn) => fn());
		cleanups.length = 0;
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
		document.body.innerHTML = '';
	});

	it('registers astro:page-load listener on import', async () => {
		const addSpy = vi.spyOn(document, 'addEventListener');
		await import('@/scripts/animate-init');
		expect(addSpy).toHaveBeenCalledWith('astro:page-load', expect.any(Function));
	});

	it('calls animate on data-animate="fade" element when it intersects', async () => {
		document.body.innerHTML = '<div data-animate="fade">Fade me</div>';
		await import('@/scripts/animate-init');
		document.dispatchEvent(new Event('astro:page-load'));

		const el = document.querySelector('[data-animate="fade"]')!;
		fireIntersection(el, true);

		expect(mockAnimate).toHaveBeenCalledWith(
			expect.arrayContaining([el]),
			expect.objectContaining({ opacity: [0, 1] }),
			expect.any(Object),
		);
	});

	it('calls animate on data-animate="slide-up" element when it intersects', async () => {
		document.body.innerHTML = '<div data-animate="slide-up">Slide me</div>';
		await import('@/scripts/animate-init');
		document.dispatchEvent(new Event('astro:page-load'));

		const el = document.querySelector('[data-animate="slide-up"]')!;
		fireIntersection(el, true);

		expect(mockAnimate).toHaveBeenCalledWith(
			expect.arrayContaining([el]),
			expect.objectContaining({ opacity: [0, 1], y: ['20px', '0px'] }),
			expect.any(Object),
		);
	});

	it('calls animate with children array for data-animate="stagger" container', async () => {
		document.body.innerHTML = `
			<div data-animate="stagger">
				<div>Child 1</div>
				<div>Child 2</div>
			</div>
		`;
		await import('@/scripts/animate-init');
		document.dispatchEvent(new Event('astro:page-load'));

		const container = document.querySelector('[data-animate="stagger"]')!;
		fireIntersection(container, true);

		expect(mockAnimate).toHaveBeenCalledWith(
			expect.arrayContaining(Array.from(container.children)),
			expect.objectContaining({ opacity: [0, 1] }),
			expect.any(Object),
		);
		// Should animate children, not the container itself
		const animateCall = mockAnimate.mock.calls[0];
		expect(animateCall[0]).not.toContain(container);
	});

	it('sets inline styles instead of calling animate when prefers-reduced-motion is true', async () => {
		vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
		document.body.innerHTML = '<div data-animate="fade">Fade me</div>';
		await import('@/scripts/animate-init');
		document.dispatchEvent(new Event('astro:page-load'));

		const el = document.querySelector<HTMLElement>('[data-animate="fade"]')!;
		fireIntersection(el, true);

		expect(mockAnimate).not.toHaveBeenCalled();
		expect(el.style.opacity).toBe('1');
		expect(el.style.transform).toBe('none');
	});

	it('calls scroll with the beam element when data-timeline-beam exists', async () => {
		document.body.innerHTML = '<div><div data-timeline-beam></div></div>';
		await import('@/scripts/animate-init');
		document.dispatchEvent(new Event('astro:page-load'));

		const beam = document.querySelector<HTMLElement>('[data-timeline-beam]')!;
		expect(mockAnimate).toHaveBeenCalledWith(beam, { scaleY: [0, 1] }, expect.any(Object));
		expect(mockScroll).toHaveBeenCalledWith(mockAnimationControls, expect.objectContaining({ offset: ['start 80%', 'end 20%'] }));
	});

	it('sets beam.style.transform directly and skips scroll when reduced motion is true', async () => {
		vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
		document.body.innerHTML = '<div><div data-timeline-beam></div></div>';
		await import('@/scripts/animate-init');
		document.dispatchEvent(new Event('astro:page-load'));

		const beam = document.querySelector<HTMLElement>('[data-timeline-beam]')!;
		expect(beam.style.transform).toBe('scaleY(1)');
		expect(mockScroll).not.toHaveBeenCalled();
	});

	it('disconnects previous IntersectionObserver when astro:page-load fires a second time', async () => {
		document.body.innerHTML = '<div data-animate="fade">Fade me</div>';
		await import('@/scripts/animate-init');

		document.dispatchEvent(new Event('astro:page-load'));
		expect(mockDisconnect).toHaveBeenCalledTimes(0);

		document.dispatchEvent(new Event('astro:page-load'));
		expect(mockDisconnect).toHaveBeenCalledTimes(1);
	});

	it('unobserves element after animation fires', async () => {
		document.body.innerHTML = '<div data-animate="fade">Fade me</div>';
		await import('@/scripts/animate-init');
		document.dispatchEvent(new Event('astro:page-load'));

		const el = document.querySelector('[data-animate="fade"]')!;
		fireIntersection(el, true);

		expect(mockUnobserve).toHaveBeenCalledWith(el);
	});

	it('does not call animate when intersection is not intersecting', async () => {
		document.body.innerHTML = '<div data-animate="fade">Fade me</div>';
		await import('@/scripts/animate-init');
		document.dispatchEvent(new Event('astro:page-load'));

		const el = document.querySelector('[data-animate="fade"]')!;
		fireIntersection(el, false);

		expect(mockAnimate).not.toHaveBeenCalled();
	});

	it('does nothing when no animated elements exist', async () => {
		document.body.innerHTML = '<div>No animations</div>';
		await import('@/scripts/animate-init');
		document.dispatchEvent(new Event('astro:page-load'));

		expect(mockObserve).not.toHaveBeenCalled();
		expect(mockAnimate).not.toHaveBeenCalled();
	});
});
