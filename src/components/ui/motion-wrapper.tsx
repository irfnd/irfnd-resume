import { motion, useInView, type HTMLMotionProps, type Variants } from 'framer-motion';
import { useRef } from 'react';

interface MotionWrapperProps extends HTMLMotionProps<'div'> {
	children: React.ReactNode;
	delay?: number;
	duration?: number;
	viewportOnce?: boolean;
	threshold?: number;
}

export function FadeIn({
	children,
	delay = 0,
	duration = 0.5,
	viewportOnce = true,
	threshold = 0.2,
	className,
	...props
}: MotionWrapperProps) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: viewportOnce, amount: threshold });

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0 }}
			animate={isInView ? { opacity: 1 } : { opacity: 0 }}
			transition={{ duration, delay, ease: 'easeOut' }}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	);
}

export function SlideUp({
	children,
	delay = 0,
	duration = 0.5,
	viewportOnce = true,
	threshold = 0.2,
	className,
	...props
}: MotionWrapperProps) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: viewportOnce, amount: threshold });

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 20 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
			transition={{ duration, delay, ease: 'easeOut' }}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	);
}

interface StaggerContainerProps extends HTMLMotionProps<'div'> {
	children: React.ReactNode;
	staggerDelay?: number;
	viewportOnce?: boolean;
	threshold?: number;
}

export function StaggerContainer({
	children,
	staggerDelay = 0.1,
	viewportOnce = true,
	threshold = 0.1,
	className,
	...props
}: StaggerContainerProps) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: viewportOnce, amount: threshold });

	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: staggerDelay,
			},
		},
	};

	return (
		<motion.div
			ref={ref}
			variants={containerVariants}
			initial='hidden'
			animate={isInView ? 'show' : 'hidden'}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	);
}

export function StaggerItem({ children, className, ...props }: HTMLMotionProps<'div'>) {
	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
	};

	return (
		<motion.div variants={itemVariants} className={className} {...props}>
			{children}
		</motion.div>
	);
}
