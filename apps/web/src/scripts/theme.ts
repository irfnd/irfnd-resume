const STORAGE_KEY = 'irfnd-ui-theme';
type Theme = 'dark' | 'light';

function getStoredTheme(): Theme {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'light' || stored === 'dark') return stored;
	return 'dark';
}

function applyTheme(theme: Theme) {
	const root = document.documentElement;
	root.classList.remove('light', 'dark');
	root.classList.add(theme);
	localStorage.setItem(STORAGE_KEY, theme);
}

function initTheme() {
	applyTheme(getStoredTheme());

	document.addEventListener('click', (e) => {
		const btn = (e.target as HTMLElement).closest('[data-theme-toggle]');
		if (!btn) return;
		const current = getStoredTheme();
		applyTheme(current === 'dark' ? 'light' : 'dark');
	});
}

initTheme();

export { applyTheme, getStoredTheme, initTheme };
export type { Theme };
