import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';

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
	const Component = motion[as] as typeof motion.div;

	return (
		<Component
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: viewportOnce, amount: threshold }}
			transition={{ duration, delay, ease: 'easeOut' }}
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
	const Component = motion[as] as typeof motion.div;

	return (
		<Component
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: viewportOnce, amount: threshold }}
			transition={{ duration, delay, ease: 'easeOut' }}
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
			variants={containerVariants}
			initial='hidden'
			whileInView='show'
			viewport={{ once: viewportOnce, amount: threshold }}
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
		<motion.div variants={itemVariants} className={className} {...props}>
			{children}
		</motion.div>
	);
}
