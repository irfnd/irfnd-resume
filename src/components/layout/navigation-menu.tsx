import { useTranslation } from '@/hooks';
import * as React from 'react';

export function Menu() {
	const { navigation } = useTranslation();

	return (
		<nav className='fixed bottom-6 inset-x-0 mx-auto w-[90%] max-w-100 lg:static lg:w-full lg:max-w-none flex items-center justify-between p-1.5 rounded-2xl bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 light-shadow hover:light-shadow dark:shadow-none z-50 lg:flex-col lg:justify-start lg:gap-1 lg:p-2 lg:bg-white/40 lg:dark:bg-white/5 lg:hover:border-blue-300/50 lg:dark:hover:border-blue-500/20 transition-all duration-300'>
			{navigation.map((item, index, arr) => (
				<React.Fragment key={item.label}>
					{index === arr.length - 1 && <div className='hidden lg:block w-full h-px bg-slate-200 dark:bg-white/5 my-1' />}
					<a
						href={item.url}
						className='group w-full flex flex-col lg:flex-row items-center gap-1 lg:gap-3 p-2 rounded-xl hover:bg-white/60 dark:hover:bg-neutral-800 transition-all duration-300 flex-1 lg:flex-none justify-center lg:justify-start outline-none focus-visible:ring focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500 focus-visible:bg-white/60 dark:focus-visible:bg-neutral-800'
					>
						<div className='size-8 flex items-center justify-center rounded-lg bg-transparent lg:bg-white/80 lg:dark:bg-neutral-900 border border-transparent lg:border-slate-200 lg:dark:border-neutral-800 text-slate-500 dark:text-neutral-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-200 dark:group-hover:border-blue-900 group-focus-visible:text-blue-600 dark:group-focus-visible:text-blue-400 group-focus-visible:border-blue-200 dark:group-focus-visible:border-blue-900 transition-colors shadow-sm'>
							<item.icon className='size-5 lg:size-4' />
						</div>
						<span className='text-[10px] lg:text-sm font-medium text-slate-600 dark:text-neutral-400 group-hover:text-slate-900 dark:group-hover:text-white group-focus-visible:text-slate-900 dark:group-focus-visible:text-white transition-colors'>
							{item.label}
						</span>
					</a>
				</React.Fragment>
			))}
		</nav>
	);
}
