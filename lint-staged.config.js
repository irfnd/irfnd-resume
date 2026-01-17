/** @type {import('lint-staged').Configuration} */
export default {
	'*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
	'*.{json,md,html,css}': 'prettier --write',
};
