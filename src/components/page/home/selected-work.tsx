import { useTranslation } from '@/hooks';

import { ProjectCard } from '@/components/ui';
import { IconArrowRight } from '@tabler/icons-react';

export function SelectedWork() {
	const { portfolio, common } = useTranslation();

	return (
		<section>
			<div className='flex items-center justify-between mb-8'>
				<h2 className='text-lg font-semibold text-slate-900 dark:text-white tracking-tight'>{portfolio.title}</h2>
				<div className='h-px bg-slate-200 dark:bg-neutral-800 flex-1 mx-6' />
				<a
					href='/portfolio'
					className='text-xs text-slate-600 hover:text-blue-600 dark:hover:text-white transition-colors flex items-center gap-1 shrink-0 font-medium rounded-sm outline-none focus-visible:ring focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900'
				>
					{common.viewMore} <IconArrowRight className='size-3' />
				</a>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				{portfolio.projects.map((project, projectIndex) => (
					<ProjectCard key={projectIndex} {...project} isFirst={projectIndex === 0} />
				))}
			</div>
		</section>
	);
}
