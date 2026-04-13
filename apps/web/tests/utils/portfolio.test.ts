import { describe, expect, it } from 'vitest';
import { sortProjects } from '@/utils/portfolio';
import type { IPortfolio } from '@/types';

type Project = IPortfolio['projects'][number];

function makeProject(overrides: Partial<Project> & Pick<Project, 'name'>): Project {
	return {
		icon: 'tabler:code',
		name: overrides.name,
		summary: [],
		image: [],
		type: 'public',
		demo: null,
		source: null,
		stacks: [],
		category: 'frontend',
		isSelected: false,
		...overrides,
	};
}

describe('sortProjects', () => {
	it('puts selected projects first', () => {
		const projects = [makeProject({ name: 'Bravo' }), makeProject({ name: 'Alpha', isSelected: true })];
		const sorted = sortProjects(projects);
		expect(sorted[0].name).toBe('Alpha');
		expect(sorted[1].name).toBe('Bravo');
	});

	it('sorts alphabetically within same selection status', () => {
		const projects = [
			makeProject({ name: 'Charlie', isSelected: true }),
			makeProject({ name: 'Alpha', isSelected: true }),
			makeProject({ name: 'Bravo', isSelected: true }),
		];
		const sorted = sortProjects(projects);
		expect(sorted.map((p) => p.name)).toEqual(['Alpha', 'Bravo', 'Charlie']);
	});

	it('handles empty array', () => {
		expect(sortProjects([])).toEqual([]);
	});

	it('does not mutate the original array', () => {
		const projects = [makeProject({ name: 'Bravo' }), makeProject({ name: 'Alpha' })];
		const original = [...projects];
		sortProjects(projects);
		expect(projects[0].name).toBe(original[0].name);
	});

	it('handles mixed selected/unselected with alphabetical sub-sort', () => {
		const projects = [
			makeProject({ name: 'Delta' }),
			makeProject({ name: 'Alpha', isSelected: true }),
			makeProject({ name: 'Charlie' }),
			makeProject({ name: 'Bravo', isSelected: true }),
		];
		const sorted = sortProjects(projects);
		expect(sorted.map((p) => p.name)).toEqual(['Alpha', 'Bravo', 'Charlie', 'Delta']);
	});
});
