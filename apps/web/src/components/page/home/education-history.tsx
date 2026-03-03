import { useTranslation } from '@/hooks';

import { HighlightText, SlideUp, TimelineBadge, TimelineBeam, TimelineDot, TimelineItem } from '@/components/ui';

export function EducationHistory() {
	const { education } = useTranslation();

	return (
		<SlideUp as='section'>
			<div className='flex items-center justify-between mb-8'>
				<h2 className='text-lg font-semibold text-foreground tracking-tight'>{education.title}</h2>
				<div className='h-px bg-border flex-1 ml-6' />
			</div>

			<TimelineBeam className='ml-3 space-y-12'>
				{education.educations.map((edu, index) => (
					<TimelineItem key={index} className='relative pl-6 md:pl-10'>
						<TimelineDot />

						<div className='flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2'>
							<div>
								{edu.link ? (
									<a
										href={edu.link}
										target='_blank'
										rel='noopener noreferrer'
										className='text-lg font-semibold text-foreground tracking-tight'
									>
										{edu.institution}
									</a>
								) : (
									<h3 className='text-lg font-semibold text-foreground tracking-tight'>{edu.institution}</h3>
								)}
								<div className='flex flex-wrap items-center gap-1 md:gap-2'>
									<span className='text-sm text-muted-foreground font-medium'>{edu.degree}</span>
									<span className='text-slate-300 dark:text-neutral-700 text-xs'>•</span>
									<span className='text-xs text-muted-foreground'>{edu.fieldOfStudy}</span>
								</div>
							</div>
							<TimelineBadge>{edu.duration.join(' - ')}</TimelineBadge>
						</div>

						{edu.summary.length > 0 &&
							edu.summary.map((summary, idx) => (
								<div key={idx} className='space-y-1 mb-4'>
									<p className='text-sm text-muted-foreground font-light leading-relaxed'>
										<HighlightText text={summary.value} keywords={summary.keywords} />
									</p>
								</div>
							))}

						{edu.points.length > 0 && (
							<ul className='space-y-1 mb-4'>
								{edu.points.slice(0, 3).map((point, idx) => (
									<li key={idx} className='inline-flex gap-3 text-sm text-muted-foreground font-light leading-relaxed'>
										<span className='text-slate-300 dark:text-neutral-600 mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400 dark:bg-neutral-600'></span>
										<span>
											<HighlightText as='strong' text={point.value} keywords={point.keywords} />
										</span>
									</li>
								))}
							</ul>
						)}

						{edu.award.length > 0 && (
							<div className='flex flex-wrap w-full gap-2'>
								{edu.award.map((award, idx) => (
									<div
										key={idx}
										className='p-4 w-full glass-card bg-white/60 dark:bg-white/5 border border-white/50 dark:border-white/5 rounded-xl flex flex-col justify-between group hover:border-blue-300/50 dark:hover:border-blue-500/20 transition-all duration-300 light-shadow hover:light-shadow dark:shadow-none'
									>
										<div className='flex items-center gap-3'>
											<div className='size-8 rounded bg-linear-to-br from-blue-50 to-white dark:from-blue-500/10 dark:to-transparent flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm dark:shadow-none duration-300'>
												<award.icon className='size-4' />
											</div>
											<div>
												<p className='text-xs font-bold text-foreground uppercase tracking-wider'>{award.label}</p>
												<p className='text-xs text-muted-foreground mt-0.5'>{award.description}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</TimelineItem>
				))}
			</TimelineBeam>
		</SlideUp>
	);
}
