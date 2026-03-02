import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tailwindcss(), tanstackRouter({ target: 'react', autoCodeSplitting: true }), react()],
	resolve: { alias: { '@': path.resolve(__dirname, './src'), '@test': path.resolve(__dirname, './tests') } },
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes('node_modules')) return;

					if (id.includes('@tanstack')) return 'tanstack';
					if (id.includes('framer-motion')) return 'framer-motion';

					if (
						id.includes('fontkit') ||
						id.includes('linebreak') ||
						id.includes('brotli') ||
						id.includes('/dfa/') ||
						id.includes('restructure') ||
						id.includes('tiny-inflate') ||
						id.includes('unicode-properties') ||
						id.includes('unicode-trie')
					) {
						return 'pdf-font';
					}

					if (id.includes('yoga-layout')) return 'pdf-layout';
					if (id.includes('@react-pdf')) return 'react-pdf';

					if (/\/(react|react-dom)\/|use-sync-external-store|@(floating-ui|tabler|base-ui|icons-pack)/.test(id)) {
						return 'react-vendor';
					}
				},
			},
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./tests/setup.ts'],
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
				'src/routeTree.gen.ts',
				'src/main.tsx',
				'src/types/**',
				'src/**/index.ts',
				'src/utils/router.ts',
				'src/routes/**',
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
