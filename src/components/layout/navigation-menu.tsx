import { useTranslation } from '@/hooks';
import { cn } from '@/utils/cn';
import { Link, useRouterState } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import * as React from 'react';

import { SlideUp } from '@/components/ui';

const MotionLink = motion(Link);

export function Menu() {
	const { navigation } = useTranslation();
	const pathname = useRouterState({ select: (s) => s.location.pathname });

	return (
		<SlideUp
			as='nav'
			delay={0.4}
			className='fixed gap-1 bottom-6 inset-x-0 mx-auto w-[90%] max-w-100 lg:static lg:w-full lg:max-w-none flex items-center justify-between p-1.5 rounded-2xl bg-background/80 backdrop-blur-xl border border-white/40 dark:border-white/10 light-shadow hover:light-shadow dark:shadow-none z-50 lg:flex-col lg:justify-start lg:gap-1 lg:p-2 lg:bg-white/40 lg:dark:bg-white/5 lg:hover:border-blue-300/50 lg:dark:hover:border-blue-500/20'
		>
			{navigation.map((item, index, arr) => {
				const isActive = pathname === item.url;
				return (
					<React.Fragment key={item.label}>
						{index === arr.length - 1 && <div className='hidden lg:block w-full h-px bg-border my-1' />}
						<MotionLink
							to={item.url}
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 1 }}
							transition={{ type: 'spring', stiffness: 400, damping: 10 }}
							className={cn(
								'group w-full flex flex-col lg:flex-row items-center gap-1 lg:gap-3 p-2 rounded-xl transition-colors duration-300 flex-1 lg:flex-none justify-center lg:justify-start outline-none focus-visible:ring focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500',
								isActive
									? 'bg-white/80 dark:bg-secondary text-foreground'
									: 'hover:bg-white/60 dark:hover:bg-secondary focus-visible:bg-white/60 dark:focus-visible:bg-secondary',
							)}
						>
							<div
								className={cn(
									'size-8 flex items-center justify-center rounded-lg border transition-colors shadow-sm',
									isActive
										? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400'
										: 'bg-transparent lg:bg-white/80 lg:dark:bg-secondary border-transparent lg:border-border text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-200 dark:group-hover:border-blue-900 group-focus-visible:text-blue-600 dark:group-focus-visible:text-blue-400 group-focus-visible:border-blue-200 dark:group-focus-visible:border-blue-900',
								)}
							>
								<item.icon className='size-5 lg:size-4' />
							</div>
							<span
								className={cn(
									'text-[10px] lg:text-sm font-medium transition-colors',
									isActive
										? 'text-foreground'
										: 'text-muted-foreground/80 group-hover:text-foreground group-focus-visible:text-foreground',
								)}
							>
								{item.label}
							</span>
						</MotionLink>
					</React.Fragment>
				);
			})}
		</SlideUp>
	);
}
