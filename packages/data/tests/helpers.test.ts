import { describe, expect, it } from 'vitest';
import { getByLang, resolveParagraph, resolveTechStacks } from '@/helpers';
import type { I18nData } from '@/helpers';
import type { TechStackItemData } from '@/schemas/common';

describe('getByLang', () => {
	const data: I18nData<string> = { en: 'Hello', id: 'Halo' };

	it('returns English data for "en"', () => {
		expect(getByLang(data, 'en')).toBe('Hello');
	});

	it('returns Indonesian data for "id"', () => {
		expect(getByLang(data, 'id')).toBe('Halo');
	});

	it('works with complex objects', () => {
		const complex: I18nData<{ name: string }> = {
			en: { name: 'English' },
			id: { name: 'Indonesia' },
		};
		expect(getByLang(complex, 'en')).toEqual({ name: 'English' });
	});
});

describe('resolveTechStacks', () => {
	const allStacks: TechStackItemData[] = [
		{ label: 'React', url: 'https://reactjs.org/', icon: 'simple-icons:react', color: '#61DAFB' },
		{ label: 'TypeScript', url: 'https://www.typescriptlang.org/', icon: 'simple-icons:typescript', color: '#3178C6' },
		{
			label: 'Next.js',
			url: 'https://nextjs.org/',
			icon: 'simple-icons:nextdotjs',
			customColor: true,
			border: 'hover:border-black/50',
		},
	];

	it('returns matching tech stack entries', () => {
		const result = resolveTechStacks(allStacks, ['React', 'TypeScript']);
		expect(result).toHaveLength(2);
		expect(result.map((t) => t.label)).toEqual(['React', 'TypeScript']);
	});

	it('returns empty array for no matches', () => {
		expect(resolveTechStacks(allStacks, ['NonExistent'])).toEqual([]);
	});

	it('returns empty array for empty labels', () => {
		expect(resolveTechStacks(allStacks, [])).toEqual([]);
	});

	it('preserves order of labels', () => {
		const result = resolveTechStacks(allStacks, ['TypeScript', 'React']);
		expect(result.map((t) => t.label)).toEqual(['TypeScript', 'React']);
	});

	it('filters out unresolvable labels', () => {
		const result = resolveTechStacks(allStacks, ['React', 'Missing', 'TypeScript']);
		expect(result).toHaveLength(2);
		expect(result.map((t) => t.label)).toEqual(['React', 'TypeScript']);
	});
});

describe('resolveParagraph', () => {
	it('replaces {0} and {1} placeholders with keywords', () => {
		const result = resolveParagraph({
			value: 'Built {0} using {1} framework',
			keywords: ['REST API', 'Express.js'],
		});
		expect(result).toBe('Built REST API using Express.js framework');
	});

	it('returns value as-is when no keywords', () => {
		const result = resolveParagraph({ value: 'Simple text', keywords: [] });
		expect(result).toBe('Simple text');
	});

	it('handles single keyword', () => {
		const result = resolveParagraph({ value: 'Used {0} for auth', keywords: ['JWT'] });
		expect(result).toBe('Used JWT for auth');
	});
});
