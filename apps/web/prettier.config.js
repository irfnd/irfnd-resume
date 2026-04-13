import irfndConfig from '@irfnd/prettier-config';

/** @type {import("prettier").Config} */
export default {
	...irfndConfig,
	plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss', 'prettier-plugin-astro-organize-imports'],
	overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
};
