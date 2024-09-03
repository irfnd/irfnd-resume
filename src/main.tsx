import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@/App.tsx';
import ThemeProvider from '@/components/core/Theme';
import { Toaster } from '@/components/ui/sonner';
import '@/globals.css';
import '@/i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider defaultTheme='dark' storageKey='theme'>
			<App />
			<Toaster position='top-right' />
		</ThemeProvider>
	</React.StrictMode>
);
