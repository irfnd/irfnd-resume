export function resolveTechStacks<T extends { label: string }>(allStacks: readonly T[], labels: string[]): T[] {
	return labels.map((label) => allStacks.find((s) => s.label === label)).filter((s): s is T => s !== undefined);
}
