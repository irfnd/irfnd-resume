import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: { alias: { '@': path.resolve(__dirname, './src') } },
	test: {
		globals: true,
		environment: 'node',
		env: { NODE_ENV: 'test' },
		include: ['tests/**/*.{test,spec}.{ts,tsx}'],
		exclude: ['node_modules', 'dist'],
		environmentMatchGlobs: [['tests/**/*.test.tsx', 'jsdom']],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			reportsDirectory: './coverage',
			include: ['src/**/*.{ts,tsx}'],
			exclude: ['src/types/**', 'src/**/index.ts'],
			thresholds: {
				statements: 100,
				branches: 100,
				functions: 100,
				lines: 100,
			},
		},
	},
});
