import { cn } from '@/utils/cn';
import { describe, expect, it } from 'vitest';

describe('cn', () => {
	it('merges class names', () => {
		expect(cn('foo', 'bar')).toBe('foo bar');
	});

	it('handles conditional classes', () => {
		const condition = false as boolean;
		expect(cn('foo', condition && 'bar', 'baz')).toBe('foo baz');
	});

	it('merges tailwind conflicts (last wins)', () => {
		expect(cn('p-4', 'p-2')).toBe('p-2');
	});

	it('handles undefined and null', () => {
		expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
	});

	it('handles empty input', () => {
		expect(cn()).toBe('');
	});
});
