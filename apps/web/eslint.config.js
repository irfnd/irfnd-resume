import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	globalIgnores([
		'node_modules',
		'dist',
		'build',
		'.vite',
		'.astro',
		'.cache',
		'coverage',
		'public',
		'**/*.d.ts',
		'**/*.d.ts.map',
	]),
	{
		files: ['**/*.{ts,tsx}'],
		extends: [js.configs.recommended, tseslint.configs.recommended],
		languageOptions: { ecmaVersion: 2020, globals: globals.browser, parserOptions: { tsconfigRootDir: import.meta.dirname } },
	},
	...astro.configs['flat/recommended'],
	{
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
		},
	},
]);
