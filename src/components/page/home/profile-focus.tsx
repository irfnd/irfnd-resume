import { useTranslation } from '@/hooks';

import { HighlightText, SlideUp, StaggerContainer, StaggerItem } from '@/components/ui';

export function ProfileFocus() {
	const { about } = useTranslation();

	return (
		<SlideUp as='section' className='scroll-mt-24'>
			<div className='flex items-center justify-between mb-8'>
				<h2 className='text-lg font-semibold text-foreground tracking-tight'>{about.title}</h2>
				<div className='h-px bg-border flex-1 ml-6' />
			</div>

			<StaggerContainer className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<StaggerItem
					whileHover={{ y: -5 }}
					whileTap={{ y: -5, scale: 0.98 }}
					transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
					className='glass-card bg-white/60 dark:bg-white/5 border border-white/50 dark:border-white/5 p-6 md:p-8 rounded-2xl md:col-span-3 light-shadow hover:light-shadow dark:shadow-none hover:border-blue-300/50 dark:hover:border-blue-500/20 transition-colors'
				>
					<div className='prose prose-slate dark:prose-invert'>
						{about.description?.map((paragraph, index) => (
							<p key={index} className='text-base font-normal text-slate-600 dark:text-neutral-300 leading-relaxed'>
								<HighlightText text={paragraph.value} keywords={paragraph.keywords} className='font-semibold' />
							</p>
						))}
					</div>
				</StaggerItem>

				{about.focus.map((item, index) => (
					<StaggerItem
						key={index}
						whileHover={{ y: -5 }}
						whileTap={{ y: -5, scale: 0.98 }}
						transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
						className='glass-card bg-white/60 dark:bg-white/5 border border-white/50 dark:border-white/5 p-6 rounded-2xl flex flex-col justify-between group hover:border-blue-300/50 dark:hover:border-blue-500/20 transition-all duration-300 light-shadow hover:light-shadow dark:shadow-none'
					>
						<div className='size-8 rounded bg-linear-to-br from-blue-50 to-white dark:from-blue-500/10 dark:to-transparent flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm dark:shadow-none duration-300 mb-4'>
							<item.icon className='size-5' />
						</div>
						<div>
							<div className='text-2xl font-bold text-foreground tracking-tight'>{item.value}</div>
							<div className='text-xs text-muted-foreground uppercase tracking-wider mt-1 font-semibold'>{item.label}</div>
						</div>
					</StaggerItem>
				))}
			</StaggerContainer>
		</SlideUp>
	);
}
