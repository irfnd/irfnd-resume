import Autoplay from 'embla-carousel-autoplay';

import type { Projects } from '@/utils/types';

import Draggable from '@/components/core/Draggable';
import ProjectCardModalBtn from '@/components/sections/projects/ProjectCardModalBtn';
import ProjectScreenshots from '@/components/sections/projects/ProjectScreenshots';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/utils/cn';

interface IProjectCardModal {
	project: Projects['list'][number];
}

export default function ProjectCardModal({ project }: IProjectCardModal) {
	const { projectName, shortDesc, descriptions, relatedSkills, screenshots, links } = project;

	return (
		<Dialog>
			<DialogTrigger>
				<p
					className={cn([
						'w-fit cursor-pointer',
						'text-lg sm:text-xl font-semibold',
						'hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-lime-600 hover:decoration-dotted',
					])}
				>
					{projectName}
				</p>
			</DialogTrigger>
			<DialogContent className='w-full max-w-5xl overflow-y-auto max-h-screen text-stone-950 dark:text-white'>
				<DialogHeader className='w-full space-y-1'>
					<DialogTitle className='text-2xl font-bold'>{projectName}</DialogTitle>
					<DialogDescription>{shortDesc}</DialogDescription>
				</DialogHeader>
				<div className='flex flex-col w-full gap-3'>
					{/* Screenshot */}
					{screenshots ? (
						<div className='flex w-full justify-center items-center'>
							<Carousel className='w-full' plugins={[Autoplay({ delay: 3500 })]}>
								<CarouselContent>
									{screenshots.map((screenshot, i) => (
										<CarouselItem key={i}>
											<ProjectScreenshots screenshot={screenshot} />
										</CarouselItem>
									))}
								</CarouselContent>
								<CarouselPrevious variant='primary' />
								<CarouselNext variant='primary' />
							</Carousel>
						</div>
					) : null}

					{/* Descriptions */}
					<div className='flex flex-col gap-2'>
						{descriptions?.map((desc, i) => (
							<p key={i} className='text-justify'>
								{desc}
							</p>
						))}
					</div>

					{/* Related Skills */}
					{relatedSkills ? (
						<Draggable className='flex overflow-auto scrollbar-hide gap-1'>
							{relatedSkills
								.sort((a, b) => a.localeCompare(b))
								.map((skill) => (
									<Badge key={skill}>{skill}</Badge>
								))}
						</Draggable>
					) : null}
				</div>
				<DialogFooter className='gap-2'>
					{links
						? Object.keys(links)
								.sort((a, b) => b.localeCompare(a))
								.map((link, i) => <ProjectCardModalBtn key={i} link={link} links={links} />)
						: null}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
