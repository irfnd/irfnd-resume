import { cn } from '@/utils/cn';
import { motion, useInView, useScroll, useSpring, type HTMLMotionProps, type Variants } from 'framer-motion';
import { useRef } from 'react';

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

interface TimelineBeamProps extends Omit<HTMLMotionProps<'div'>, 'as'> {
	children: React.ReactNode;
}

export function TimelineBeam({ children, className, ...props }: TimelineBeamProps) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, amount: 0.05 });

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start 80%', 'end 20%'],
	});

	const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

	return (
		<motion.div
			ref={ref}
			variants={containerVariants}
			initial='hidden'
			animate={isInView ? 'show' : 'hidden'}
			style={{ translateZ: 0 }}
			className={cn('relative border-l border-border', className)}
			{...props}
		>
			<motion.div
				style={{ scaleY, transformOrigin: 'top' }}
				className='absolute -left-px top-0 bottom-0 w-px bg-linear-to-b from-blue-500 via-blue-400 to-transparent'
			/>
			{children}
		</motion.div>
	);
}

interface TimelineItemProps extends HTMLMotionProps<'div'> {
	children: React.ReactNode;
}

export function TimelineItem({ children, className, ...props }: TimelineItemProps) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: false, amount: 0.3, margin: '-5% 0px -30% 0px' });

	return (
		<motion.div
			ref={ref}
			variants={itemVariants}
			style={{ translateZ: 0 }}
			data-active={isInView || undefined}
			className={cn('group', className)}
			{...props}
		>
			{children}
		</motion.div>
	);
}

export function TimelineDot() {
	return (
		<div className='absolute -left-1.25 top-2 h-2.5 w-2.5 rounded-full bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-600 group-hover:border-blue-500 group-hover:bg-blue-500 group-data-active:border-blue-500 group-data-active:bg-blue-500 transition-colors duration-300 shadow-[0_0_0_4px_rgba(248,250,252,1)] dark:shadow-[0_0_0_4px_rgba(3,3,3,1)]' />
	);
}

export function TimelineBadge({ children }: { children: React.ReactNode }) {
	return (
		<span className='text-xs w-fit font-mono font-semibold px-2.5 py-1 rounded-md text-muted-foreground bg-card border border-border shadow-sm dark:shadow-none group-hover:text-blue-700 group-hover:dark:text-blue-400/90 group-hover:bg-blue-50 group-hover:dark:bg-blue-500/10 group-hover:border-blue-100 group-hover:dark:border-blue-500/20 group-data-active:text-blue-700 group-data-active:dark:text-blue-400/90 group-data-active:bg-blue-50 group-data-active:dark:bg-blue-500/10 group-data-active:border-blue-100 group-data-active:dark:border-blue-500/20'>
			{children}
		</span>
	);
}
