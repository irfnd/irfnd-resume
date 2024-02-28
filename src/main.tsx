import React from 'react';
import ReactDOM from 'react-dom/client';

import '@/i18n';
import '@/globals.css';
import App from '@/App.tsx';
import ThemeProvider from '@/components/core/Theme';
import { Toaster } from '@/components/ui/sonner';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider defaultTheme='dark' storageKey='theme'>
			<App />
			<Toaster position='top-right' />
		</ThemeProvider>
	</React.StrictMode>
);
