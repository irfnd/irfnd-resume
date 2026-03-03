import { useTranslation } from '@/hooks';
import type { InferArray, IPortfolio } from '@/types';
import { cloudinaryResize } from '@/utils/cloudinary';
import { cn } from '@/utils/cn';
import * as React from 'react';

import { HighlightText } from '@/components/ui/highlight-text';
import { TechIcon } from '@/components/ui/tech-icon';
import { Dialog } from '@base-ui/react/dialog';
import { IconArrowUpRight, IconBrandGithub, IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface ProjectDialogProps extends InferArray<IPortfolio['projects']> {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const categoryStyle: Record<string, string> = {
	frontend: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
	backend: 'text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20',
	fullstack: 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20',
};

export function ProjectDialog({ open, onOpenChange, ...project }: ProjectDialogProps) {
	const { common } = useTranslation();
	const [imageIndex, setImageIndex] = React.useState(0);
	const [direction, setDirection] = React.useState(1);

	const hasImages = project.image.length > 0;
	const hasMultipleImages = project.image.length > 1;
	const hasLinks = project.type === 'public' && (project.source || project.demo);
	const [imageLoaded, setImageLoaded] = React.useState(false);

	React.useEffect(() => {
		if (open) setImageIndex(0);
	}, [open]);

	React.useEffect(() => {
		setImageLoaded(false);
	}, [imageIndex]);

	const prevImage = () => {
		setDirection(-1);
		setImageIndex((i) => (i - 1 + project.image.length) % project.image.length);
	};
	const nextImage = () => {
		setDirection(1);
		setImageIndex((i) => (i + 1) % project.image.length);
	};

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Backdrop className='fixed inset-0 z-70 bg-black/60 dark:bg-black/75 backdrop-blur-md opacity-0 transition-opacity duration-300 data-open:opacity-100' />

				<Dialog.Popup className='fixed left-1/2 top-1/2 z-70 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-2xl max-h-[90dvh] flex flex-col rounded-2xl bg-white dark:bg-neutral-900 border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] outline-none overflow-hidden opacity-0 scale-95 transition-all duration-300 data-open:opacity-100 data-open:scale-100'>
					<Dialog.Close
						className='absolute right-4 top-4 z-20 p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-600 backdrop-blur-sm transition-colors outline-none focus-visible:ring focus-visible:ring-red-400 cursor-pointer'
						aria-label='Close dialog'
					>
						<IconX className='size-4' />
					</Dialog.Close>

					{hasImages && (
						<div className='relative aspect-video bg-slate-950 overflow-hidden shrink-0'>
							{!imageLoaded && (
								<div className='absolute inset-0 bg-slate-200 dark:bg-neutral-800 animate-pulse'>
									<div className='absolute inset-0 pattern-grid opacity-30' />
								</div>
							)}

							<AnimatePresence initial={false} custom={direction} mode='popLayout'>
								<motion.div
									key={imageIndex}
									custom={direction}
									variants={{
										enter: (dir: number) => ({ x: dir * 300, opacity: 0 }),
										center: { x: 0, opacity: 1 },
										exit: (dir: number) => ({ x: dir * -300, opacity: 0 }),
									}}
									initial='enter'
									animate='center'
									exit='exit'
									transition={{ type: 'spring', stiffness: 300, damping: 30 }}
									className='absolute inset-0'
								>
									<a
										href={project.image[imageIndex].url}
										target='_blank'
										rel='noopener noreferrer'
										className='block w-full h-full cursor-zoom-in'
									>
										<img
											src={cloudinaryResize(project.image[imageIndex].url, 1200)}
											alt={project.image[imageIndex].alt}
											onLoad={() => setImageLoaded(true)}
											className={cn(
												'w-full h-full object-cover transition-opacity duration-300',
												imageLoaded ? 'opacity-90' : 'opacity-0',
											)}
										/>
									</a>
								</motion.div>
							</AnimatePresence>

							<div className='absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/20 pointer-events-none' />

							{hasMultipleImages && (
								<>
									<button
										onClick={prevImage}
										className='absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/55 text-white backdrop-blur-sm transition-colors outline-none focus-visible:ring focus-visible:ring-white/50 cursor-pointer'
										aria-label='Previous image'
									>
										<IconChevronLeft className='size-4' />
									</button>
									<button
										onClick={nextImage}
										className='absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/55 text-white backdrop-blur-sm transition-colors outline-none focus-visible:ring focus-visible:ring-white/50 cursor-pointer'
										aria-label='Next image'
									>
										<IconChevronRight className='size-4' />
									</button>
								</>
							)}

							<div className='absolute bottom-0 inset-x-0 flex items-end justify-between gap-3 px-4 py-3'>
								<p className='text-xs text-white/70 truncate'>{project.image[imageIndex].alt}</p>
								{hasMultipleImages && (
									<span className='text-[10px] font-mono text-white/60 shrink-0 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full'>
										{imageIndex + 1} / {project.image.length}
									</span>
								)}
							</div>
						</div>
					)}

					<div className='flex flex-col overflow-hidden min-h-0'>
						<div className='px-6 pt-6 pb-4 shrink-0'>
							<div className='flex items-center gap-2 mb-4'>
								<span
									className={cn(
										'text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-md uppercase tracking-wider border',
										categoryStyle[project.category],
									)}
								>
									{project.category}
								</span>
								{project.type === 'private' && (
									<span className='text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-md text-muted-foreground bg-slate-100 dark:bg-neutral-800 border border-border'>
										{common.internal}
									</span>
								)}
							</div>

							<div className='flex items-center gap-3 pr-8'>
								<div className='size-10 shrink-0 rounded-xl bg-linear-to-br from-blue-50 to-white dark:from-blue-500/10 dark:to-transparent flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm dark:shadow-none'>
									<project.icon className='size-5' />
								</div>
								<Dialog.Title className='text-lg font-bold text-foreground tracking-tight leading-tight'>
									{project.name}
								</Dialog.Title>
							</div>
						</div>

						<div className='h-px bg-border/60 shrink-0 mx-6' />

						<div className='overflow-y-auto flex-1 px-6 py-5 space-y-5'>
							<Dialog.Description render={<div />} className='space-y-2.5'>
								{project.summary.map((paragraph, i) => (
									<p key={i} className='text-sm text-muted-foreground leading-relaxed'>
										<HighlightText text={paragraph.value} keywords={paragraph.keywords} />
									</p>
								))}
							</Dialog.Description>

							{project.stacks.length > 0 && (
								<div>
									<p className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3'>Tech Stack</p>
									<div className='flex flex-wrap gap-2'>
										{project.stacks.map((stack) => (
											<TechIcon key={stack.label} {...stack} className='[&>svg]:size-4 md:[&>svg]:size-5 p-2 rounded-md' />
										))}
									</div>
								</div>
							)}
						</div>

						{hasLinks && (
							<div className='px-6 py-4 border-t border-border/60 flex gap-2 shrink-0'>
								{project.source && (
									<a
										href={project.source}
										target='_blank'
										rel='noopener noreferrer'
										className='flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors outline-none focus-visible:ring focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500'
									>
										<IconBrandGithub className='size-4' />
										{common.source}
									</a>
								)}
								{project.demo && (
									<a
										href={project.demo}
										target='_blank'
										rel='noopener noreferrer'
										className='flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white hover:opacity-90 transition-opacity outline-none focus-visible:ring focus-visible:ring-blue-400'
									>
										<IconArrowUpRight className='size-4' />
										{common.liveDemo}
									</a>
								)}
							</div>
						)}
					</div>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
