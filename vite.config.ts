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
					if (id.includes('node_modules')) {
						// TanStack packages
						if (id.includes('@tanstack')) return 'tanstack';

						// Animation
						if (id.includes('framer-motion')) return 'framer-motion';

						// React and all React-dependent UI packages together
						if (
							id.includes('/react/') ||
							id.includes('/react-dom/') ||
							id.includes('use-sync-external-store') ||
							id.includes('@floating-ui') ||
							id.includes('@tabler') ||
							id.includes('@base-ui') ||
							id.includes('@icons-pack')
						) {
							return 'react-vendor';
						}
					}
				},
			},
		},
	},
});
