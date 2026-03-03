import { useYear } from '@/hooks/useYear';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useYear hook', () => {
	it('should return the current year', () => {
		const { result } = renderHook(() => useYear());
		expect(result.current).toBe(new Date().getFullYear());
	});

	it('should return a number', () => {
		const { result } = renderHook(() => useYear());
		expect(typeof result.current).toBe('number');
	});

	it('should return a four-digit year', () => {
		const { result } = renderHook(() => useYear());
		expect(result.current).toBeGreaterThanOrEqual(2020);
		expect(result.current).toBeLessThanOrEqual(2100);
	});

	it('should return consistent value on re-render', () => {
		const { result, rerender } = renderHook(() => useYear());
		const initialYear = result.current;
		rerender();
		expect(result.current).toBe(initialYear);
	});

	it('should handle mocked date', () => {
		const mockDate = new Date('2030-06-15');
		vi.setSystemTime(mockDate);

		const { result } = renderHook(() => useYear());
		expect(result.current).toBe(2030);

		vi.useRealTimers();
	});
});
