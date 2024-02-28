import { useTranslation } from 'react-i18next';

import type { Projects } from '@/utils/types';

import ProjectCard from '@/components/sections/projects/ProjectCard';

export default function Projects() {
	const { t } = useTranslation();

	const title = t('portfolio.projects.title');
	const projects: Projects['list'] = t('portfolio.projects.list', { returnObjects: true });

	return (
		<div className='flex flex-col text-stone-950 dark:text-white gap-4'>
			<p className='text-xl sm:text-2xl font-bold underline underline-offset-4 decoration-2 decoration-lime-600'>{title}</p>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-10'>
				{projects.map((project, i) => (
					<ProjectCard key={i} project={project} />
				))}
			</div>
		</div>
	);
}
