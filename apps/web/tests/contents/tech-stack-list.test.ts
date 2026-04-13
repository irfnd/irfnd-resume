import { describe, expect, it } from 'vitest';
import { resolveTechStacks } from '@/utils/tech-stacks';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const techStacksFile = join(import.meta.dirname, '../../src/content/data/tech-stacks.json');
const allStacks: Array<{
	label: string;
	url: string;
	icon: string;
	color?: string;
	border?: string;
	customColor?: boolean;
}> = JSON.parse(readFileSync(techStacksFile, 'utf-8')).all.stacks;

describe('resolveTechStacks with real data', () => {
	it('returns matching tech stack entries', () => {
		const result = resolveTechStacks(allStacks, ['React', 'TypeScript']);
		expect(result).toHaveLength(2);
		expect(result.map((t) => t.label)).toEqual(expect.arrayContaining(['React', 'TypeScript']));
	});

	it('returns empty array for no matches', () => {
		const result = resolveTechStacks(allStacks, ['NonExistent']);
		expect(result).toEqual([]);
	});

	it('returns entries with required properties', () => {
		const [item] = resolveTechStacks(allStacks, ['React']);
		expect(item).toHaveProperty('label', 'React');
		expect(item).toHaveProperty('url');
		expect(item).toHaveProperty('icon');
	});

	it('handles entries with customColor property', () => {
		const result = resolveTechStacks(allStacks, ['Next.js']);
		expect(result).toHaveLength(1);
		expect(result[0].customColor).toBe(true);
		expect(result[0]).toHaveProperty('border');
	});

	it('returns empty array for empty labels', () => {
		expect(resolveTechStacks(allStacks, [])).toEqual([]);
	});
});
