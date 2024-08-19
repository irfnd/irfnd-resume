import * as path from 'path';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react-swc';

export default defineConfig({
	plugins: [react()],
	resolve: { alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }] },
	build: {
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						return id.toString().split('node_modules/')[1].split('/')[0].toString();
					}
				},
			},
		},
	},
});
