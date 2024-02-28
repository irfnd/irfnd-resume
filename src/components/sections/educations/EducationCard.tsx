import { capitalize } from '@/utils/string.utils';

import type { Educations } from '@/utils/types';

import { cn } from '@/utils/cn';
import { IconCalendarTime, IconMapPin, IconUserStar } from '@tabler/icons-react';

interface IEducationCard {
	index: number;
	education: Educations['list'][number];
}

export default function EducationCard({ index, education }: IEducationCard) {
	const { institution, major, location, duration, link, descriptions, points } = education;

	return (
		<div className='relative flex flex-col w-full text-stone-950 dark:text-white'>
			{index === 0 ? (
				<div className='absolute w-5 aspect-square bg-lime-600 rounded-full -left-[2.2em] animate-ping' />
			) : null}
			<div className='absolute w-5 aspect-square bg-lime-600 rounded-full -left-[2.2em]'></div>
			<div className='flex flex-col gap-2'>
				<div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2'>
					<div className='flex flex-col'>
						{link ? (
							<a
								href={link}
								aria-label={capitalize(`${institution} Link`)}
								className={cn([
									'text-lg sm:text-xl font-semibold',
									'hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-lime-600 hover:decoration-dotted',
								])}
							>
								{institution}
							</a>
						) : (
							<p className='text-lg sm:text-xl font-semibold'>{institution}</p>
						)}
						<div className='flex items-center gap-1 text-stone-600 dark:text-stone-400'>
							<IconUserStar size={14} />
							<p className='text-sm'>{major}</p>
						</div>
					</div>
					<div className='flex flex-col sm:items-end gap-1'>
						<div className='flex items-center gap-1'>
							<IconCalendarTime size={14} />
							<p className='text-sm sm:text-xs'>{duration?.join(' - ')}</p>
						</div>
						<div className='flex items-center gap-1 text-stone-600 dark:text-stone-400'>
							<IconMapPin size={14} />
							<p className='text-sm sm:text-xs'>{location}</p>
						</div>
					</div>
				</div>
				{descriptions
					? descriptions.map((desc, i) => (
							<p className='max-w-2xl text-justify' key={i}>
								{desc}
							</p>
						))
					: null}
				{points ? (
					<ul className='text-sm sm:text-base list-disc list-outside max-w-[652px] ml-5'>
						{points.map((point, i) => (
							<li key={i} className='text-justify'>
								{point}
							</li>
						))}
					</ul>
				) : null}
			</div>
		</div>
	);
}
