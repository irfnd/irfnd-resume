import { createRootRoute, Outlet } from '@tanstack/react-router';
import * as React from 'react';

import { Footer, LanguageSwitcher, Menu, Profile, ThemeSwitcher } from '@/components/layout';

const TanStackRouterDevtools = import.meta.env.DEV
	? React.lazy(() =>
			import('@tanstack/react-router-devtools').then((m) => ({
				default: m.TanStackRouterDevtools,
			})),
		)
	: () => null;

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<div className='relative overflow-x-clip'>
			<div className='noise-bg mix-blend-multiply dark:mix-blend-overlay' />
			<div className='fixed inset-0 z-0 pointer-events-none overflow-hidden'>
				<div className='absolute -top-[20%] -right-[10%] size-[50%] rounded-full bg-blue-100/40 dark:bg-blue-900/20 blur-3xl filter opacity-70 mix-blend-multiply dark:mix-blend-screen will-change-transform' />
				<div className='absolute top-[10%] -left-[10%] size-[40%] rounded-full bg-indigo-100/40 dark:bg-indigo-900/10 blur-3xl filter opacity-70 mix-blend-multiply dark:mix-blend-screen will-change-transform' />
				<div className='absolute bottom-[10%] left-[20%] size-[40%] rounded-full bg-sky-50/60 dark:bg-sky-900/10 blur-3xl filter opacity-70 mix-blend-multiply dark:mix-blend-screen will-change-transform' />
			</div>

			<div className='fixed top-6 right-6 z-60 flex items-center gap-2'>
				<LanguageSwitcher />
				<ThemeSwitcher />
			</div>

			<div className='relative max-w-7xl mx-auto px-8 py-12 md:px-12 z-10'>
				<div className='grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 xl:gap-24'>
					<aside className='lg:sticky lg:top-12 lg:h-[calc(100vh-96px)] flex flex-col'>
						<Profile />
						<Menu />
					</aside>

					<main className='relative space-y-18 pb-24 lg:pb-0 [&_section:last-child]:pb-12'>
						<Outlet />
						<Footer />
					</main>
				</div>
			</div>

			<React.Suspense fallback={null}>
				<TanStackRouterDevtools />
			</React.Suspense>
		</div>
	);
}
