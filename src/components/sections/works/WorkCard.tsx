import useHumanizeDuration from '@/utils/hooks/useHumanizeDuration';
import { capitalize } from '@/utils/string.utils';
import { useTranslation } from 'react-i18next';

import type { Works } from '@/utils/types';

import { cn } from '@/utils/cn';
import { IconCalendarTime, IconMapPin, IconUserStar } from '@tabler/icons-react';

interface IWorkCard {
	index: number;
	work: Works['list'][number];
}

export default function WorkCard({ index, work }: IWorkCard) {
	const { company, location, link, descriptions } = work;
	const { i18n } = useTranslation();

	const durations = descriptions.map((item) => item.duration);
	const humanizedDuration = useHumanizeDuration({ locale: i18n.language as 'id' | 'en', rangeDates: durations });

	return (
		<div className='flex flex-col gap-4'>
			{descriptions.map((item, i) => (
				<div className='relative flex flex-col w-full text-stone-950 dark:text-white' key={i}>
					{i === 0 ? (
						<>
							{index === 0 ? (
								<div className='absolute w-5 aspect-square bg-lime-600 rounded-full -left-[2.2em] animate-ping' />
							) : null}
							<div className='absolute w-5 aspect-square bg-lime-600 rounded-full -left-[2.2em]'></div>
						</>
					) : null}
					<div className='flex flex-col gap-2'>
						<div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2'>
							<div className='flex flex-col'>
								{i === 0 ? (
									<>
										{link ? (
											<a
												href={link}
												aria-label={capitalize(`${company} Link`)}
												className={cn([
													'text-lg sm:text-xl font-bold',
													'hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-lime-600 hover:decoration-dotted',
												])}
											>
												{company}
											</a>
										) : (
											<p className='text-lg sm:text-xl font-bold'>{company}</p>
										)}
									</>
								) : null}
								<div className='flex w-fit items-center gap-1 border-b-[1px] border-b-lime-600'>
									<IconUserStar size={16} />
									<p className='font-semibold'>{item.position}</p>
								</div>
							</div>
							<div className='flex flex-col sm:items-end gap-1'>
								<div className='flex items-center gap-1'>
									<IconCalendarTime size={14} />
									<p className='text-sm sm:text-xs'>
										{item.duration?.join(' - ')}{' '}
										<span className='text-stone-600 dark:text-stone-400'>({humanizedDuration[i]})</span>
									</p>
								</div>
								{i === 0 ? (
									<div className='flex items-center gap-1 text-stone-600 dark:text-stone-400'>
										<IconMapPin size={14} />
										<p className='text-sm sm:text-xs'>{location}</p>
									</div>
								) : null}
							</div>
						</div>
						{item.shortDesc
							? item.shortDesc?.map((desc, i) => (
									<p className='max-w-2xl' key={i}>
										{desc}
									</p>
								))
							: null}
						{item.points ? (
							<ul className='text-sm sm:text-base list-disc list-outside max-w-[652px] ml-5'>
								{item.points.map((point, i) => (
									<li key={i}>{point}</li>
								))}
							</ul>
						) : null}
					</div>
				</div>
			))}
		</div>
	);
}
