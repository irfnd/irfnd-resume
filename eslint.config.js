import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	globalIgnores([
		'node_modules',
		'dist',
		'build',
		'.vite',
		'.cache',
		'coverage',
		'public',
		'*.d.ts',
		'*.d.ts.map',
		'**/routeTree.gen.ts',
	]),
	{
		files: ['**/*.{ts,tsx}'],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
	},
	{
		rules: {
			'react-refresh/only-export-components': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
		},
	},
]);
