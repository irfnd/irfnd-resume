import type { ITechStack } from '@/types';
import { cn } from '@/utils/cn';

export interface TechIconProps extends ITechStack {
	className?: string;
	withLabel?: boolean;
}

export function TechIcon(props: TechIconProps) {
	return (
		<a
			href={props.url}
			target='_blank'
			rel='noopener noreferrer'
			key={props.label}
			style={!props.customColor ? ({ '--stack-color': props.color } as React.CSSProperties) : undefined}
			className={cn(
				'flex flex-col items-center justify-center gap-3 p-4 bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800 rounded-xl transition-colors group shadow-sm dark:shadow-none outline-none focus-visible:ring focus-visible:ring-(--stack-color) focus-visible:border-(--stack-color)',
				props.customColor ? props.border : 'hover:border-(--stack-color)/50',
				props.className,
			)}
		>
			<props.icon
				className={cn(
					'size-8 transition-[color_opacity] opacity-70 group-hover:opacity-100',
					props.customColor ? props.color : 'fill-neutral-500 group-hover:fill-(--stack-color)',
				)}
			/>
			{props.withLabel && <span className='text-xs font-medium text-slate-700 dark:text-neutral-400'>{props.label}</span>}
		</a>
	);
}
