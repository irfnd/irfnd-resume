import { cn } from '@/utils/cn';
import { describe, expect, it } from 'vitest';

describe('cn utility', () => {
	it('should merge class names', () => {
		expect(cn('foo', 'bar')).toBe('foo bar');
	});

	it('should handle conditional classes', () => {
		const condition1 = false;
		const condition2 = true;
		expect(cn('foo', condition1 && 'bar', 'baz')).toBe('foo baz');
		expect(cn('foo', condition2 && 'bar', 'baz')).toBe('foo bar baz');
	});

	it('should handle undefined and null', () => {
		expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
	});

	it('should merge tailwind classes correctly', () => {
		expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
		expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
	});

	it('should handle arrays', () => {
		expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
	});

	it('should handle objects', () => {
		expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
	});

	it('should handle empty inputs', () => {
		expect(cn()).toBe('');
		expect(cn('')).toBe('');
	});

	it('should handle complex tailwind merging', () => {
		expect(cn('bg-red-500 hover:bg-red-600', 'bg-blue-500')).toBe('hover:bg-red-600 bg-blue-500');
	});
});
