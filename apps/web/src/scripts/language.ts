import type { Language } from '@/types/i18n';

function getLangFromPath(): Language {
	const [, lang] = window.location.pathname.split('/');
	return lang === 'id' ? 'id' : 'en';
}

function switchLanguage(targetLang: Language) {
	const currentPath = window.location.pathname;
	const newPath = currentPath.replace(/^\/(en|id)/, `/${targetLang}`);
	window.location.href = newPath;
}

function initLanguageSwitcher() {
	document.addEventListener('click', (e) => {
		const target = e.target as HTMLElement;

		// Toggle dropdown
		const toggle = target.closest('[data-lang-toggle]');
		if (toggle) {
			const dropdown = document.querySelector('[data-lang-dropdown]');
			dropdown?.classList.toggle('hidden');
			return;
		}

		// Select language
		const option = target.closest('[data-lang-option]');
		if (option) {
			const lang = option.getAttribute('data-lang-option') as Language;
			if (lang && lang !== getLangFromPath()) {
				switchLanguage(lang);
			}
			document.querySelector('[data-lang-dropdown]')?.classList.add('hidden');
			return;
		}

		// Click outside closes dropdown
		document.querySelector('[data-lang-dropdown]')?.classList.add('hidden');
	});
}

initLanguageSwitcher();

export { getLangFromPath, initLanguageSwitcher, switchLanguage };
