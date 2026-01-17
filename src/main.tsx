import '@/index.css';

import { I18nProvider, ThemeProvider } from '@/components/providers';
import { router } from '@/utils/router';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<I18nProvider>
			<ThemeProvider defaultTheme='system' storageKey='zolutech-theme'>
				<RouterProvider router={router} />
			</ThemeProvider>
		</I18nProvider>
	</StrictMode>,
);
