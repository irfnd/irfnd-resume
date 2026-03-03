import '@/index.css';

import { router } from '@/utils/router';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { I18nProvider, ThemeProvider } from '@/components/providers';
import { ToastProvider } from '@/components/ui';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<I18nProvider>
			<ThemeProvider defaultTheme='dark'>
				<ToastProvider>
					<RouterProvider router={router} />
				</ToastProvider>
			</ThemeProvider>
		</I18nProvider>
	</StrictMode>,
);
