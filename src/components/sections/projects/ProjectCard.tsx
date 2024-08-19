import type { Projects } from '@/utils/types';

import { Badge } from '@/components/ui/badge';
import Draggable from '@/components/core/Draggable';
import ProjectCardModal from '@/components/sections/projects/ProjectCardModal';
import ProjectCardIcon from '@/components/sections/projects/ProjectCardIcon';

interface IProjectCard {
	project: Projects['list'][number];
}

export default function ProjectCard({ project }: IProjectCard) {
	const { projectName, shortDesc, descriptions, links, relatedSkills, screenshots } = project;

	return (
		<div className='flex flex-col gap-2'>
			{screenshots && screenshots?.length > 0 ? (
				<div className='h-48'>
					<img src={screenshots[0].url} alt={screenshots[0].alt} className='h-full w-full object-cover rounded-lg' />
				</div>
			) : (
				<div className='h-48'>
					<img
						src={`https://placehold.co/1920x1080?text=${projectName.split(' ').join('+')}`}
						alt='no image'
						className='h-full w-full object-cover rounded-lg'
					/>
				</div>
			)}
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
