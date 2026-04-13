export type LangCode = 'en' | 'id';
export type I18nData<T> = Record<LangCode, T>;

export function getByLang<T>(data: I18nData<T>, lang: LangCode): T {
	return data[lang];
}

export function resolveTechStacks<T extends { label: string }>(allStacks: readonly T[], labels: string[]): T[] {
	return labels.map((label) => allStacks.find((s) => s.label === label)).filter((s): s is T => s !== undefined);
}
