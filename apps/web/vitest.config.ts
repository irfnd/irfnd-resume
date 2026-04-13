import { getViteConfig } from 'astro/config';
import path from 'path';

export default getViteConfig({
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
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
				'src/types/**',
				'src/**/index.ts',
				'src/env.d.ts',
				'src/vite-env.d.ts',
				'src/main.tsx',
				'src/routeTree.gen.ts',
				'src/utils/router.ts',
				'src/hooks/**',
				'src/components/pdf/**',
				'src/routes/**',
				'src/providers/**',
				'src/components/layout/*.tsx',
				'src/components/ui/*.tsx',
				'src/components/page/**/*.tsx',
				'src/components/providers/**',
			],
			thresholds: {
				statements: 100,
				branches: 100,
				functions: 100,
				lines: 100,
			},
		},
	},
});
