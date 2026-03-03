import { useTranslation } from '@/hooks';
import * as React from 'react';

import { SlideUp, StaggerContainer, StaggerItem, TechIcon } from '@/components/ui';

export function TechnicalStack() {
	const { technology } = useTranslation();

	return (
		<SlideUp as='section'>
			<div className='flex items-center justify-between mb-8'>
				<h2 className='text-lg font-semibold text-foreground tracking-tight'>{technology.title}</h2>
				<div className='h-px bg-border flex-1 ml-6' />
			</div>

			<div className='glass-card bg-white/60 dark:bg-white/5 border border-white/50 dark:border-white/5 rounded-2xl p-8 light-shadow dark:shadow-none'>
				<div className='space-y-8'>
					{Object.entries(technology.stacks)
						.filter(([, techs]) => techs.length > 0)
						.map(([category, techs], index, arr) => (
							<React.Fragment key={category}>
								<div>
									<h3 className='text-xs font-semibold text-slate-400 dark:text-neutral-400 uppercase tracking-widest mb-6'>
										{category}
									</h3>
									<StaggerContainer className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
										{techs.map((tech) => (
											<StaggerItem key={tech.label}>
												<TechIcon {...tech} withLabel />
											</StaggerItem>
										))}
									</StaggerContainer>
								</div>
								{index < arr.length - 1 && <div className='h-px bg-border w-full' />}
							</React.Fragment>
						))}
				</div>
			</div>
		</SlideUp>
	);
}
