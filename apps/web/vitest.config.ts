import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: { alias: { '@': path.resolve(__dirname, './src'), '@test': path.resolve(__dirname, './tests') } },
	test: {
		globals: true,
		environment: 'happy-dom',
		include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		exclude: ['node_modules', 'dist', '.git', '.cache'],
		pool: 'threads',
		isolate: false,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			reportsDirectory: './coverage',
			include: ['src/**/*.ts'],
			exclude: ['src/types/**', 'src/**/index.ts', 'src/env.d.ts', 'src/vite-env.d.ts', 'src/content.config.ts'],
			thresholds: {
				statements: 100,
				branches: 100,
				functions: 100,
				lines: 100,
			},
		},
	},
});
