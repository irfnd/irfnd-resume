import '@/index.css';

import { router } from '@/utils/router';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { I18nProvider, ThemeProvider } from '@/components/providers';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<I18nProvider>
			<ThemeProvider defaultTheme='dark'>
				<RouterProvider router={router} />
			</ThemeProvider>
		</I18nProvider>
	</StrictMode>,
);
