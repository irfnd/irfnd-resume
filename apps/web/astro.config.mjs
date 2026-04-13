import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://irfnd.id',
	output: 'static',
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'id'],
		routing: { prefixDefaultLocale: true },
	},
	vite: { plugins: [tailwindcss()] },
	integrations: [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en-US', id: 'id-ID' } } }), icon()],
});
