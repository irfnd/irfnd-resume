import { useTranslation } from '@/hooks';
import { cn } from '@/utils/cn';

import { HighlightText, SlideUp, TechIcon, TimelineBadge, TimelineBeam, TimelineDot, TimelineItem } from '@/components/ui';

export function ProfessionalJurney() {
	const { experience } = useTranslation();

	return (
		<SlideUp as='section'>
			<div className='flex items-center justify-between mb-8'>
				<h2 className='text-lg font-semibold text-foreground tracking-tight'>{experience.title}</h2>
				<div className='h-px bg-border flex-1 ml-6' />
			</div>

			<TimelineBeam className='ml-3 space-y-12 pb-4'>
				{experience.jobs.map((job, index) => (
					<TimelineItem key={index} className='relative pl-6 md:pl-10'>
						<TimelineDot />

						<div className='flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2'>
							<div>
								<h3 className='text-lg font-semibold text-foreground tracking-tight'>{job.mainPosition}</h3>
								<div className='flex flex-wrap items-center gap-1 md:gap-2 mt-1'>
									{job.link ? (
										<a
											href={job.link}
											target='_blank'
											rel='noopener noreferrer'
											className='text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-white font-medium outline-none focus-visible:ring focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 rounded transition-colors'
										>
											{job.company}
										</a>
									) : (
										<span className='text-sm text-muted-foreground font-medium'>{job.company}</span>
									)}
									<span className='text-slate-300 dark:text-neutral-700 text-xs'>•</span>
									<span className='text-xs text-muted-foreground'>{job.type}</span>
								</div>
							</div>
							<TimelineBadge>{job.duration.join(' - ')}</TimelineBadge>
						</div>

						{job.descriptions.map((desc, descIndex, descArr) => (
							<div
								key={descIndex}
								className={cn(
									'mb-6 relative',
									descArr.length > 1 && descIndex === descArr.length - 1 && 'mb-0 pt-6 border-t border-dashed border-border/60',
								)}
							>
								{descArr.length > 1 && (
									<div className='flex items-center gap-2 mb-3'>
										{desc.icon ? (
											<desc.icon className='size-3.5 text-muted-foreground group-hover:text-blue-700 group-hover:dark:text-blue-400/90 group-data-active:text-blue-700 group-data-active:dark:text-blue-400/90' />
										) : null}
										<span className='text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider'>
											{desc.position}
										</span>
									</div>
								)}

								{desc.summary.map((summary, summaryIndex) => (
									<p key={summaryIndex} className='text-sm text-muted-foreground font-light leading-relaxed mb-4'>
										<HighlightText text={summary.value} keywords={summary.keywords} />
									</p>
								))}

								{desc.points.length > 0 && (
									<ul className='space-y-1 mb-4'>
										{desc.points.slice(0, 3).map((point, pointIndex) => (
											<li key={pointIndex} className='inline-flex gap-3 text-sm text-muted-foreground font-light leading-relaxed'>
												<span className='text-slate-300 dark:text-neutral-600 mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400 dark:bg-neutral-600'></span>
												<span>
													<HighlightText as='strong' text={point.value} keywords={point.keywords} />
												</span>
											</li>
										))}
									</ul>
								)}

								{desc.stacks.length > 0 && (
									<div className='flex flex-wrap gap-2'>
										{desc.stacks.map((stack, stackIndex) => (
											<TechIcon key={stackIndex} {...stack} className='[&>svg]:size-4 md:[&>svg]:size-5 p-2 rounded-md' />
										))}
									</div>
								)}
							</div>
						))}
					</TimelineItem>
				))}
			</TimelineBeam>
		</SlideUp>
	);
}
