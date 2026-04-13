import { describe, expect, it } from 'vitest';
import { resolveTechStacks } from '@irfnd/data';

const allStacks = [
	{ label: 'React', url: 'https://reactjs.org/', icon: 'simple-icons:react', color: '#61DAFB' },
	{ label: 'TypeScript', url: 'https://www.typescriptlang.org/', icon: 'simple-icons:typescript', color: '#3178C6' },
	{ label: 'Docker', url: 'https://www.docker.com/', icon: 'simple-icons:docker', color: '#2496ED' },
];

describe('resolveTechStacks', () => {
	it('resolves labels to matching tech stack objects', () => {
		const result = resolveTechStacks(allStacks, ['React', 'Docker']);
		expect(result).toHaveLength(2);
		expect(result[0].label).toBe('React');
		expect(result[1].label).toBe('Docker');
	});

	it('preserves the order of the labels array', () => {
		const result = resolveTechStacks(allStacks, ['Docker', 'React']);
		expect(result.map((s) => s.label)).toEqual(['Docker', 'React']);
	});

	it('skips labels that do not match any stack', () => {
		const result = resolveTechStacks(allStacks, ['React', 'NonExistent', 'Docker']);
		expect(result).toHaveLength(2);
		expect(result.map((s) => s.label)).toEqual(['React', 'Docker']);
	});

	it('returns empty array for empty labels', () => {
		expect(resolveTechStacks(allStacks, [])).toEqual([]);
	});

	it('returns empty array when allStacks is empty', () => {
		expect(resolveTechStacks([], ['React'])).toEqual([]);
	});

	it('preserves all properties of matched stacks', () => {
		const [item] = resolveTechStacks(allStacks, ['TypeScript']);
		expect(item).toEqual({
			label: 'TypeScript',
			url: 'https://www.typescriptlang.org/',
			icon: 'simple-icons:typescript',
			color: '#3178C6',
		});
	});
});
