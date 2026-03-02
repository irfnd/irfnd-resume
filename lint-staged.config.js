/** @type {import('lint-staged').Configuration} */
export default {
	'*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write', 'vitest related --run'],
	'*.{json,md,html,css}': 'prettier --write',
};
