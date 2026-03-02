import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

afterEach(() => {
	cleanup();
});

const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
	const message = args[0];
	if (
		typeof message === 'string' &&
		(message.includes('controlled') || message.includes('uncontrolled') || message.includes('not wrapped in act'))
	) {
		return;
	}
	originalConsoleError.apply(console, args);
};

const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: vi.fn((key: string) => store[key] ?? null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value;
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		}),
		get length() {
			return Object.keys(store).length;
		},
		key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
	};
})();

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

class MockIntersectionObserver {
	callback: IntersectionObserverCallback;
	root: Element | null = null;
	rootMargin = '';
	thresholds: ReadonlyArray<number> = [];

	constructor(callback: IntersectionObserverCallback) {
		this.callback = callback;
	}

	observe(target: Element): void {
		this.callback(
			[
				{
					isIntersecting: true,
					target,
					boundingClientRect: {} as DOMRectReadOnly,
					intersectionRatio: 1,
					intersectionRect: {} as DOMRectReadOnly,
					rootBounds: null,
					time: Date.now(),
				},
			],
			this as unknown as IntersectionObserver,
		);
	}

	unobserve(): void {}
	disconnect(): void {}
	takeRecords(): IntersectionObserverEntry[] {
		return [];
	}
}

Object.defineProperty(window, 'IntersectionObserver', {
	writable: true,
	value: MockIntersectionObserver,
});

class MockResizeObserver {
	observe(): void {}
	unobserve(): void {}
	disconnect(): void {}
}

Object.defineProperty(window, 'ResizeObserver', {
	writable: true,
	value: MockResizeObserver,
});

beforeEach(() => {
	localStorageMock.clear();
	vi.clearAllMocks();
});
