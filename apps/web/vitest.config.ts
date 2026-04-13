import { getViteConfig } from 'astro/config';
import path from 'path';

export default getViteConfig({
	resolve: { alias: { '@': path.resolve(__dirname, './src'), '@test': path.resolve(__dirname, './tests') } },
	test: {
		globals: true,
		include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		exclude: ['node_modules', 'dist', '.git', '.cache'],
		pool: 'threads',
		isolate: false,
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
