import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), tanstackRouter({ target: 'react', autoCodeSplitting: true }), react()],
	resolve: { alias: { '@': path.resolve(__dirname, './src') } },
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes('node_modules')) {
						return;
					}

					// TanStack packages
					if (id.includes('@tanstack')) {
						return 'tanstack';
					}

					// Animation
					if (id.includes('framer-motion')) {
						return 'framer-motion';
					}

					// React and all React-dependent UI packages together
					if (/\/(react|react-dom)\/|use-sync-external-store|@(floating-ui|tabler|base-ui|icons-pack)/.test(id)) {
						return 'react-vendor';
					}
				},
			},
		},
	},
});
