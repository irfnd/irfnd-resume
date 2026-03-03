import type { IPortfolio } from '@/types';

export function sortProjects(projects: IPortfolio['projects']): IPortfolio['projects'] {
	return [...projects].sort((a, b) => {
		if (a.isSelected !== b.isSelected) return a.isSelected ? -1 : 1;
		return a.name.localeCompare(b.name);
	});
}
