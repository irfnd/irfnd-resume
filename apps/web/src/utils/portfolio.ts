export function sortProjects<T extends { isSelected?: boolean; name: string }>(projects: T[]): T[] {
	return [...projects].sort((a, b) => {
		if (a.isSelected !== b.isSelected) return a.isSelected ? -1 : 1;
		return a.name.localeCompare(b.name);
	});
}
