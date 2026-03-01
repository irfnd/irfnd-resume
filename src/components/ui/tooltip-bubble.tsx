import { Tooltip } from '@base-ui/react/tooltip';
import { motion } from 'framer-motion';
import type { ReactElement, ReactNode } from 'react';

export interface TooltipBubbleProps {
	label: ReactNode;
	side?: 'top' | 'bottom' | 'left' | 'right';
	open?: boolean | undefined;
	children: ReactElement;
}

export function TooltipBubble({ label, side = 'bottom', open, children }: TooltipBubbleProps) {
	return (
		<Tooltip.Provider delay={200} closeDelay={0}>
			<Tooltip.Root open={open}>
				<Tooltip.Trigger render={children} />
				<Tooltip.Portal>
					<Tooltip.Positioner side={side} sideOffset={6} className='z-75'>
						<Tooltip.Popup
							render={
								<motion.div
									initial={{
										opacity: 0,
										y: side === 'bottom' ? -4 : side === 'top' ? 4 : 0,
										x: side === 'left' ? 4 : side === 'right' ? -4 : 0,
										scale: 0.95,
									}}
									animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
									transition={{ type: 'spring', stiffness: 400, damping: 25 }}
									className='rounded-lg bg-neutral-900 dark:bg-neutral-100 px-2.5 py-1.5 text-xs font-medium text-white dark:text-neutral-900 shadow-lg'
								/>
							}
						>
							<Tooltip.Arrow className='data-[side=bottom]:-top-1.5 data-[side=top]:-bottom-1.5 data-[side=top]:rotate-180 data-[side=left]:-right-1.5 data-[side=left]:rotate-90 data-[side=right]:-left-1.5 data-[side=right]:-rotate-90'>
								<svg width='12' height='6' viewBox='0 0 12 6' className='fill-neutral-900 dark:fill-neutral-100'>
									<path d='M0 6L6 0L12 6' />
								</svg>
							</Tooltip.Arrow>
							{label}
						</Tooltip.Popup>
					</Tooltip.Positioner>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}
