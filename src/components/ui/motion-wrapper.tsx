import { motion, useInView, type HTMLMotionProps, type Variants } from 'framer-motion';
import { useRef } from 'react';

type MotionElement = 'div' | 'section' | 'nav' | 'article' | 'aside' | 'footer' | 'header' | 'main';

interface MotionWrapperProps extends Omit<HTMLMotionProps<'div'>, 'as'> {
	children: React.ReactNode;
	delay?: number;
	duration?: number;
	viewportOnce?: boolean;
	threshold?: number;
	as?: MotionElement;
}

export function FadeIn({
	children,
	delay = 0,
	duration = 0.5,
	viewportOnce = true,
	threshold = 0.05,
	className,
	as = 'div',
	...props
}: MotionWrapperProps) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: viewportOnce, amount: threshold });
	const Component = motion[as] as typeof motion.div;

	return (
		<Component
			ref={ref}
			initial={{ opacity: 0 }}
			animate={isInView ? { opacity: 1 } : { opacity: 0 }}
			transition={{ duration, delay, ease: 'easeOut' }}
			style={{ translateZ: 0 }}
			className={className}
			{...props}
		>
			{children}
		</Component>
	);
}

export function SlideUp({
	children,
	delay = 0,
	duration = 0.5,
	viewportOnce = true,
	threshold = 0.05,
	className,
	as = 'div',
	...props
}: MotionWrapperProps) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: viewportOnce, amount: threshold });
	const Component = motion[as] as typeof motion.div;

	return (
		<Component
			ref={ref}
			initial={{ opacity: 0, y: 20 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
			transition={{ duration, delay, ease: 'easeOut' }}
			style={{ translateZ: 0 }}
			className={className}
			{...props}
		>
			{children}
		</Component>
	);
}

interface StaggerContainerProps extends Omit<HTMLMotionProps<'div'>, 'as'> {
	children: React.ReactNode;
	staggerDelay?: number;
	viewportOnce?: boolean;
	threshold?: number;
	as?: MotionElement;
}

export function StaggerContainer({
	children,
	staggerDelay = 0.1,
	viewportOnce = true,
	threshold = 0.05,
	className,
	as = 'div',
	...props
}: StaggerContainerProps) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: viewportOnce, amount: threshold });
	const Component = motion[as] as typeof motion.div;

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
		<Component
			ref={ref}
			variants={containerVariants}
			initial='hidden'
			animate={isInView ? 'show' : 'hidden'}
			style={{ translateZ: 0 }}
			className={className}
			{...props}
		>
			{children}
		</Component>
	);
}

export function StaggerItem({ children, className, ...props }: HTMLMotionProps<'div'>) {
	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
	};

	return (
		<motion.div variants={itemVariants} style={{ translateZ: 0 }} className={className} {...props}>
			{children}
		</motion.div>
	);
}
