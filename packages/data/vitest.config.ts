import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: { alias: { '@': path.resolve(__dirname, './src') } },
	test: {
		globals: true,
		environment: 'node',
		include: ['tests/**/*.{test,spec}.ts'],
		exclude: ['node_modules', 'dist'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			reportsDirectory: './coverage',
			include: ['src/**/*.ts'],
			exclude: ['src/**/index.ts'],
			thresholds: {
				statements: 100,
				branches: 100,
				functions: 100,
				lines: 100,
			},
		},
	},
});
