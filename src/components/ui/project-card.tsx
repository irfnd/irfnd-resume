import { useTranslation } from '@/hooks';
import type { InferArray, IPortfolio } from '@/types';
import { motion } from 'framer-motion';

import { HighlightText, TechIcon } from '@/components/ui';
import { IconArrowUpRight, IconBrandGithub } from '@tabler/icons-react';

interface ProjectCardProps extends InferArray<IPortfolio['projects']> {
	isFirst?: boolean;
}

export function ProjectCard(props: ProjectCardProps) {
	const { common } = useTranslation();

	return props.isFirst ? (
		<motion.div
			whileHover={{ y: -8 }}
			whileTap={{ scale: 0.98 }}
			transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
			className='group relative md:col-span-2 glass-card bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/5 rounded-2xl overflow-hidden hover:border-blue-300/60 dark:hover:border-blue-500/30 transition-all duration-300 light-shadow hover:light-shadow-hover dark:shadow-none h-full'
		>
			<div className='grid md:grid-cols-2 h-full'>
				<div className='p-8 flex flex-col justify-between md:h-full relative z-10'>
					<div>
						<div className='flex items-start md:items-center gap-3 mb-4'>
							<div className='size-8 shrink-0 rounded bg-linear-to-br from-blue-50 to-white dark:from-blue-500/10 dark:to-transparent flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm dark:shadow-none duration-300'>
								<props.icon className='size-4' />
							</div>
							<h3 className='text-xl font-bold text-foreground'>{props.name}</h3>
						</div>

						<p className='text-sm text-muted-foreground leading-relaxed mb-4 transition-colors'>
							<HighlightText as='span' text={props.summary[0].value} keywords={props.summary[0].keywords} />
						</p>
					</div>

					<div className='space-y-6'>
						{props.stacks.length > 0 && (
							<div className='flex gap-2 flex-wrap mt-auto'>
								{props.stacks.map((stack) => (
									<TechIcon key={stack.label} {...stack} className='[&>svg]:size-4 md:[&>svg]:size-5 p-2 rounded-md' />
								))}
							</div>
						)}

						{props.type === 'public' && (
							<div className='flex gap-5'>
								{props.source && (
									<a
										href={props.source}
										target='_blank'
										rel='noopener noreferrer'
										className='text-xs font-medium text-foreground flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-sm outline-none focus-visible:ring focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900'
									>
										Source <IconBrandGithub className='size-3' />
									</a>
								)}

								{props.demo && (
									<a
										href='#'
										className='text-xs font-medium text-foreground flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-sm outline-none focus-visible:ring focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900'
									>
										{common.liveDemo} <IconArrowUpRight className='size-3' />
									</a>
								)}
							</div>
						)}
					</div>
				</div>

				<div className='relative bg-slate-50/50 dark:bg-neutral-900/50 border-t md:border-t-0 md:border-l border-white/60 dark:border-white/5 h-72 md:h-auto overflow-hidden'>
					<div className='pattern-grid absolute inset-0 opacity-50' />
					{props.type === 'private' && (
						<span className='absolute right-8 top-4 md:top-5 text-[10px] size-fit font-mono font-semibold px-2.5 py-1 rounded-md text-muted-foreground bg-white dark:bg-neutral-900 border border-border dark:border-neutral-800 group-hover:text-blue-700 group-hover:dark:text-blue-400/90 group-hover:bg-blue-50 group-hover:dark:bg-neutral-900/60 group-hover:border group-hover:border-blue-100 group-hover:dark:border-blue-500/20 shadow-sm dark:shadow-none'>
							Internal
						</span>
					)}

					{props.image.length > 0 ? (
						<div className='absolute h-fit inset-x-8 top-8 bottom-0 bg-card rounded-t-xl border border-border/60 dark:border-neutral-800 shadow-xl transform translate-y-8 group-hover:translate-y-6 transition-transform duration-500'>
							<div className='h-10 border-b border-border/50 dark:border-neutral-800 flex items-center px-4 justify-between bg-slate-50/50 dark:bg-transparent'>
								<div className='flex gap-1.5'>
									<div className='w-2 h-2 rounded-full bg-red-400/80 border border-red-500/20' />
									<div className='w-2 h-2 rounded-full bg-amber-400/80 border border-amber-500/20' />
									<div className='w-2 h-2 rounded-full bg-blue-400/80 border border-blue-500/20' />
								</div>
								<div className='h-1.5 w-16 bg-slate-100 dark:bg-neutral-800 rounded-full' />
							</div>
							<div className='p-4'>
								<img src={props.image[0].url} alt={props.image[0].alt} className='rounded h-fit' />
							</div>
						</div>
					) : (
						<div className='absolute inset-x-8 top-8 bottom-0 bg-card rounded-t-xl border border-border/60 dark:border-neutral-800 shadow-xl transform translate-y-8 group-hover:translate-y-6 transition-transform duration-500'>
							<div className='h-10 border-b border-border/50 dark:border-neutral-800 flex items-center px-4 justify-between bg-slate-50/50 dark:bg-transparent'>
								<div className='flex gap-1.5'>
									<div className='w-2 h-2 rounded-full bg-red-400/80 border border-red-500/20' />
									<div className='w-2 h-2 rounded-full bg-amber-400/80 border border-amber-500/20' />
									<div className='w-2 h-2 rounded-full bg-blue-400/80 border border-blue-500/20' />
								</div>
								<div className='h-1.5 w-16 bg-slate-100 dark:bg-neutral-800 rounded-full' />
							</div>
							<div className='p-5 grid grid-cols-4 gap-4'>
								<div className='col-span-1 h-32 bg-blue-50/50 dark:bg-blue-500/5 rounded border border-blue-100 dark:border-blue-500/10' />
								<div className='col-span-3 space-y-3'>
									<div className='h-8 bg-slate-50 dark:bg-neutral-800 rounded w-full' />
									<div className='h-20 bg-slate-50/50 dark:bg-neutral-900 rounded border border-slate-50 dark:border-neutral-800' />
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	) : (
		<motion.div
			whileHover={{ y: -8 }}
			whileTap={{ scale: 0.98 }}
			transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
			className='group glass-card bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/5 rounded-2xl relative overflow-hidden hover:border-blue-300/60 dark:hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between light-shadow hover:light-shadow dark:shadow-none h-full'
		>
			{props.image.length > 0 && (
				<div className='absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
					<img src={props.image[0].url} alt={props.image[0].alt} className='size-full object-cover object-left' />
					<div className='absolute inset-0 bg-neutral-700/90 dark:bg-neutral-950/85' />
				</div>
			)}

			<div className='p-6 relative z-10 flex flex-col h-full justify-between'>
				<div>
					<div className='flex justify-between items-start mb-4'>
						<div className='size-8 rounded bg-linear-to-br from-blue-50 to-white dark:from-blue-500/10 dark:to-transparent dark:group-hover:bg-neutral-900 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm dark:shadow-none duration-300'>
							<props.icon className='size-5' />
						</div>

						{props.type === 'public' ? (
							<div className='flex gap-1'>
								{props.source && (
									<a
										href={props.source}
										target='_blank'
										rel='noopener noreferrer'
										className='p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white group-hover:text-white/80 group-hover:hover:text-white outline-none focus-visible:ring focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 transition-colors rounded-lg'
									>
										<IconBrandGithub className='size-4' />
									</a>
								)}
								{props.demo && (
									<a
										href={props.demo}
										target='_blank'
										rel='noopener noreferrer'
										className='p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white group-hover:text-white/80 group-hover:hover:text-white outline-none focus-visible:ring focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 transition-colors rounded-lg'
									>
										<IconArrowUpRight className='size-4' />
									</a>
								)}
							</div>
						) : (
							<span className='text-[10px] size-fit font-mono font-semibold px-2.5 py-1 rounded-md text-muted-foreground bg-white dark:bg-neutral-900 border border-border dark:border-neutral-800 group-hover:text-blue-700 group-hover:dark:text-blue-400/90 group-hover:bg-blue-50 group-hover:dark:bg-neutral-900/60 group-hover:border group-hover:border-blue-100 group-hover:dark:border-blue-500/20 shadow-sm dark:shadow-none duration-300'>
								Internal
							</span>
						)}
					</div>

					<h3 className='text-base font-bold text-foreground mb-2 group-hover:text-white transition-colors'>{props.name}</h3>

					<p className='text-sm text-muted-foreground leading-relaxed mb-4 group-hover:text-neutral-200 transition-colors'>
						<HighlightText as='span' text={props.summary[0].value} keywords={props.summary[0].keywords} />
					</p>
				</div>

				<div className='flex gap-2 items-center mt-auto pt-4 border-t border-border/50 dark:border-neutral-800/50 group-hover:border-white/10 transition-colors'>
					{props.stacks.length > 0 && (
						<div className='flex gap-2 flex-wrap'>
							{props.stacks.map((stack) => (
								<TechIcon key={stack.label} {...stack} className='[&>svg]:size-4 md:[&>svg]:size-5 p-2 rounded-md' />
							))}
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
}
