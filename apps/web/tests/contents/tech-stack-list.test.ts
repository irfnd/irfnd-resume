import { describe, expect, it } from 'vitest';
import { getTechStack } from '@/contents/tech-stack-list';

describe('getTechStack', () => {
	it('returns matching tech stack entries', () => {
		const result = getTechStack(['React', 'TypeScript']);
		expect(result).toHaveLength(2);
		expect(result.map((t) => t.label)).toEqual(expect.arrayContaining(['React', 'TypeScript']));
	});

	it('returns empty array for no matches', () => {
		const result = getTechStack(['NonExistent' as never]);
		expect(result).toEqual([]);
	});

	it('returns entries with required properties', () => {
		const [item] = getTechStack(['React']);
		expect(item).toHaveProperty('label', 'React');
		expect(item).toHaveProperty('url');
		expect(item).toHaveProperty('icon');
	});

	it('returns single item for single key', () => {
		const result = getTechStack(['Docker']);
		expect(result).toHaveLength(1);
		expect(result[0].label).toBe('Docker');
	});

	it('handles entries with customColor property', () => {
		const result = getTechStack(['Next.js']);
		expect(result).toHaveLength(1);
		expect(result[0].customColor).toBe(true);
		expect(result[0]).toHaveProperty('border');
	});

	it('returns empty array for empty keys', () => {
		expect(getTechStack([])).toEqual([]);
	});
});
