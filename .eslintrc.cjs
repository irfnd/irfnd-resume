/** @type {import("eslint").Linter.Config} */

module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended', 'prettier'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh', 'prettier'],
	ignorePatterns: ['dist', '.eslintrc.cjs', '.prettierrc.cjs'],
	rules: {
		'@typescript-eslint/no-explicit-any': 'off',
		'prettier/prettier': 'off',
		'react-refresh/only-export-components': 'off',
	},
};
