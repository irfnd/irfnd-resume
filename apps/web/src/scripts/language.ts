import { animate } from 'motion';
import { navigate } from 'astro:transitions/client';
import type { Language } from '@/utils/language';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let isClosingDropdown = false;

function getLangFromPath(): Language {
	const [, lang] = window.location.pathname.split('/');
	return lang === 'id' ? 'id' : 'en';
}

function switchLanguage(targetLang: Language) {
	const currentPath = window.location.pathname;
	const newPath = currentPath.replace(/^\/(en|id)/, `/${targetLang}`);
	navigate(newPath);
}

async function openDropdown(dropdown: Element) {
	dropdown.classList.remove('hidden');
	if (!reduced) {
		await animate(
			dropdown,
			{ opacity: [0, 1], scale: [0.95, 1], y: ['-4px', '0px'] },
			{ duration: 0.2, ease: [0.25, 0.1, 0.1, 1] },
		);
	}
}

async function closeDropdown(dropdown: Element) {
	if (isClosingDropdown) return;
	if (!reduced) {
		isClosingDropdown = true;
		await animate(dropdown, { opacity: [1, 0], scale: [1, 0.95], y: ['0px', '-4px'] }, { duration: 0.15, ease: 'easeIn' });
		isClosingDropdown = false;
	}
	dropdown.classList.add('hidden');
}

function initLanguageSwitcher() {
	document.addEventListener('click', (e) => {
		const target = e.target as HTMLElement;
		const dropdown = document.querySelector('[data-lang-dropdown]');
		if (!dropdown) return;

		// Toggle dropdown
		const toggle = target.closest('[data-lang-toggle]');
		if (toggle) {
			if (dropdown.classList.contains('hidden')) {
				openDropdown(dropdown);
			} else {
				closeDropdown(dropdown);
			}
			return;
		}

		// Select language
		const option = target.closest('[data-lang-option]');
		if (option) {
			const lang = option.getAttribute('data-lang-option') as Language;
			closeDropdown(dropdown);
			if (lang && lang !== getLangFromPath()) {
				switchLanguage(lang);
			}
			return;
		}

		// Click outside closes dropdown
		if (!dropdown.classList.contains('hidden')) {
			closeDropdown(dropdown);
		}
	});
}

initLanguageSwitcher();

export { getLangFromPath, initLanguageSwitcher, switchLanguage };
