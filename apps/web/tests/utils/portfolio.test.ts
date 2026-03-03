import type { IPortfolio } from '@/types';
import { sortProjects } from '@/utils/portfolio';
import { describe, expect, it } from 'vitest';

describe('sortProjects', () => {
	const mockProjects = [
		{ name: 'Zebra', isSelected: false },
		{ name: 'Alpha', isSelected: true },
		{ name: 'Mango', isSelected: false },
		{ name: 'Beta', isSelected: true },
	] as unknown as IPortfolio['projects'];

	it('should sort selected projects first', () => {
		const sorted = sortProjects(mockProjects);
		expect(sorted[0].name).toBe('Alpha');
		expect(sorted[1].name).toBe('Beta');
		expect(sorted[2].name).toBe('Mango');
		expect(sorted[3].name).toBe('Zebra');
	});

	it('should sort alphabetically within selected group', () => {
		const sorted = sortProjects(mockProjects);
		expect(sorted[0].name).toBe('Alpha');
		expect(sorted[1].name).toBe('Beta');
	});

	it('should sort alphabetically within non-selected group', () => {
		const sorted = sortProjects(mockProjects);
		expect(sorted[2].name).toBe('Mango');
		expect(sorted[3].name).toBe('Zebra');
	});

	it('should not mutate the original array', () => {
		const original = [...mockProjects];
		sortProjects(mockProjects);
		expect(mockProjects).toEqual(original);
	});

	it('should handle empty array', () => {
		const sorted = sortProjects([] as unknown as IPortfolio['projects']);
		expect(sorted).toEqual([]);
	});

	it('should handle all selected projects', () => {
		const allSelected = [
			{ name: 'Charlie', isSelected: true },
			{ name: 'Alpha', isSelected: true },
		] as unknown as IPortfolio['projects'];
		const sorted = sortProjects(allSelected);
		expect(sorted[0].name).toBe('Alpha');
		expect(sorted[1].name).toBe('Charlie');
	});

	it('should handle no selected projects', () => {
		const noneSelected = [{ name: 'Charlie' }, { name: 'Alpha' }] as unknown as IPortfolio['projects'];
		const sorted = sortProjects(noneSelected);
		expect(sorted[0].name).toBe('Alpha');
		expect(sorted[1].name).toBe('Charlie');
	});
});
