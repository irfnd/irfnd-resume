import type { I18nData } from '../helpers';
import type { NavigationData } from '../schemas/navigation';

export const navigation: I18nData<NavigationData> = {
	en: {
		items: [
			{ label: 'Home', url: '/', icon: 'tabler:home' },
			{ label: 'Portfolio', url: '/portfolio', icon: 'tabler:folder-star' },
			{ label: 'Contact', url: '/contact', icon: 'tabler:send' },
			{ label: 'Resume', url: '/resume', icon: 'tabler:file-download' },
		],
	},
	id: {
		items: [
			{ label: 'Beranda', url: '/', icon: 'tabler:home' },
			{ label: 'Portofolio', url: '/portfolio', icon: 'tabler:folder-star' },
			{ label: 'Kontak', url: '/contact', icon: 'tabler:send' },
			{ label: 'Resume', url: '/resume', icon: 'tabler:file-download' },
		],
	},
};
