import type { Projects } from '@/utils/types';

import { Badge } from '@/components/ui/badge';
import Draggable from '@/components/core/Draggable';
import ProjectCardModal from '@/components/sections/projects/ProjectCardModal';
import ProjectCardIcon from '@/components/sections/projects/ProjectCardIcon';

interface IProjectCard {
	project: Projects['list'][number];
}

export default function ProjectCard({ project }: IProjectCard) {
	const { shortDesc, descriptions, links, relatedSkills } = project;

	return (
		<div className='flex flex-col gap-2'>
			<div className='flex justify-between items-center gap-2'>
				<div className='flex flex-col'>
					<ProjectCardModal project={project} />
					<p className='text-sm text-stone-600 dark:text-stone-400'>{shortDesc}</p>
				</div>
				{links ? (
					<div className='flex gap-4'>
						{Object.keys(links)
							.sort((a, b) => b.localeCompare(a))
							.map((link, i) => (
								<ProjectCardIcon key={i} link={link} links={links} />
							))}
					</div>
				) : null}
			</div>
			<p className='line-clamp-3'>{descriptions}</p>
			<Draggable className='flex overflow-auto scrollbar-hide gap-1'>
				{relatedSkills
					? relatedSkills.sort((a, b) => a.localeCompare(b)).map((skill, i) => <Badge key={i}>{skill}</Badge>)
					: null}
			</Draggable>
		</div>
	);
}
