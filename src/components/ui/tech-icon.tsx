import { TooltipBubble } from '@/components/ui/tooltip-bubble';
import type { ITechStack } from '@/types';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

export interface TechIconProps extends ITechStack {
	className?: string;
	withLabel?: boolean;
}

export function TechIcon(props: TechIconProps) {
	const iconClass = cn(
		'size-8 transition-[color_opacity] opacity-70 group-hover:opacity-100 group-data-active:opacity-100',
		props.customColor
			? props.color
			: 'fill-muted-foreground group-data-active:fill-(--stack-color) group-hover:fill-(--stack-color)',
	);
	const baseClass = cn(
		'flex flex-col items-center justify-center gap-3 p-4 bg-card dark:bg-card/50 border border-border rounded-xl transition-colors group shadow-sm dark:shadow-none outline-none focus-visible:ring focus-visible:ring-(--stack-color) focus-visible:border-(--stack-color)',
		props.customColor ? props.border : 'hover:border-(--stack-color)/50',
		props.className,
	);
	const style = !props.customColor ? ({ '--stack-color': props.color } as React.CSSProperties) : undefined;

	const link = (
		<motion.a
			href={props.url}
			target='_blank'
			rel='noopener noreferrer'
			aria-label={props.label}
			style={style}
			whileHover={{ scale: 1.1, rotate: 5 }}
			whileTap={{ scale: 0.9, rotate: 5 }}
			transition={{ type: 'spring', stiffness: 400, damping: 10 }}
			className={baseClass}
		>
			<props.icon className={iconClass} />
			{props.withLabel && <span className='text-xs font-medium text-muted-foreground'>{props.label}</span>}
		</motion.a>
	);

	if (props.withLabel) return link;

	return <TooltipBubble label={props.label}>{link}</TooltipBubble>;
}
