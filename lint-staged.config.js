/** @type {import('lint-staged').Configuration} */
export default {
	'apps/web/**/*.{js,jsx,ts,tsx}': [
		'bun run --cwd apps/web eslint --fix',
		'bun run --cwd apps/web prettier --write',
		'bun run --cwd apps/web vitest related --run',
	],
	'apps/web/**/*.{json,md,html,css}': 'bun run --cwd apps/web prettier --write',
	'apps/api/**/*.{js,ts}': ['bun run --cwd apps/api eslint --fix', 'bun run --cwd apps/api prettier --write'],
};
