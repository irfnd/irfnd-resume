import { I18nProvider, ThemeProvider } from '@/components/providers';
import { useResumeDownload } from '@/hooks/useResumeDownload';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@react-pdf/renderer', () => ({
	pdf: vi.fn(() => ({
		toBlob: vi.fn(() => Promise.resolve(new Blob(['test'], { type: 'application/pdf' }))),
	})),
	Font: {
		registerHyphenationCallback: vi.fn(),
	},
	StyleSheet: {
		create: vi.fn((styles) => styles),
	},
	Document: vi.fn(() => null),
	Page: vi.fn(() => null),
	View: vi.fn(() => null),
	Text: vi.fn(() => null),
	Link: vi.fn(() => null),
}));

vi.mock('@/components/pdf/resume', () => ({
	ResumePDF: vi.fn(() => null),
}));

function Wrapper({ children }: { children: ReactNode }) {
	return (
		<I18nProvider defaultLang='en'>
			<ThemeProvider defaultTheme='dark'>{children}</ThemeProvider>
		</I18nProvider>
	);
}

describe('useResumeDownload hook', () => {
	let mockCreateObjectURL: ReturnType<typeof vi.fn>;
	let mockRevokeObjectURL: ReturnType<typeof vi.fn>;
	let mockClick: ReturnType<typeof vi.fn>;
	let mockCreateElement: typeof document.createElement;

	beforeEach(() => {
		mockCreateObjectURL = vi.fn(() => 'blob:test-url');
		mockRevokeObjectURL = vi.fn();
		mockClick = vi.fn();

		Object.defineProperty(window.URL, 'createObjectURL', {
			value: mockCreateObjectURL,
			writable: true,
		});
		Object.defineProperty(window.URL, 'revokeObjectURL', {
			value: mockRevokeObjectURL,
			writable: true,
		});

		mockCreateElement = document.createElement.bind(document);
		vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
			const element = mockCreateElement(tagName);
			if (tagName === 'a') {
				element.click = mockClick as () => void;
			}
			return element;
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should return download function and loading state', () => {
		const { result } = renderHook(() => useResumeDownload(), { wrapper: Wrapper });

		expect(result.current).toHaveProperty('download');
		expect(result.current).toHaveProperty('loading');
		expect(typeof result.current.download).toBe('function');
		expect(typeof result.current.loading).toBe('boolean');
	});

	it('should have loading as false initially', () => {
		const { result } = renderHook(() => useResumeDownload(), { wrapper: Wrapper });

		expect(result.current.loading).toBe(false);
	});

	it('should set loading to true during download', async () => {
		const { result } = renderHook(() => useResumeDownload(), { wrapper: Wrapper });

		act(() => {
			result.current.download();
		});

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});
	});

	it('should create and click download link', async () => {
		const { result } = renderHook(() => useResumeDownload(), { wrapper: Wrapper });

		await act(async () => {
			await result.current.download();
		});

		expect(mockClick).toHaveBeenCalled();
	});

	it('should create and revoke object URL', async () => {
		const { result } = renderHook(() => useResumeDownload(), { wrapper: Wrapper });

		await act(async () => {
			await result.current.download();
		});

		expect(mockCreateObjectURL).toHaveBeenCalled();
		expect(mockRevokeObjectURL).toHaveBeenCalled();
	});

	it('should not start another download while loading', async () => {
		const slowToBlob = vi.fn(
			() =>
				new Promise<Blob>((resolve) => {
					setTimeout(() => resolve(new Blob(['test'], { type: 'application/pdf' })), 100);
				}),
		);

		const { pdf } = await import('@react-pdf/renderer');
		vi.mocked(pdf).mockReturnValue({ toBlob: slowToBlob } as unknown as ReturnType<typeof pdf>);

		const { result } = renderHook(() => useResumeDownload(), { wrapper: Wrapper });

		let firstDownload: Promise<void>;
		act(() => {
			firstDownload = result.current.download();
		});

		expect(result.current.loading).toBe(true);

		act(() => {
			result.current.download();
		});

		await act(async () => {
			await firstDownload!;
		});

		expect(mockClick).toHaveBeenCalledTimes(1);
	});
});
