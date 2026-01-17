import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), tanstackRouter({ target: 'react', autoCodeSplitting: true }), react()],
	resolve: { alias: { '@': path.resolve(__dirname, './src') } },
	optimizeDeps: { include: ['@icons-pack/react-simple-icons'] },
});
