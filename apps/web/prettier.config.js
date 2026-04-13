import irfndConfig from '@irfnd/prettier-config';

/** @type {import("prettier").Config} */
export default {
	...irfndConfig,
	plugins: [...irfndConfig.plugins, 'prettier-plugin-tailwindcss'],
};
