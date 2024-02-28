import { useTranslation } from 'react-i18next';

import type { Works } from '@/utils/types';

import { cn } from '@/utils/cn';
import WorkCard from '@/components/sections/works/WorkCard';

export default function Works() {
	const { t } = useTranslation();

	const title = t('portfolio.works.title');
	const workExperiences: Works['list'] = t('portfolio.works.list', { returnObjects: true });

	return (
		<div className='flex flex-col gap-4'>
			<p
				className={cn([
					'text-xl sm:text-2xl text-stone-950 dark:text-white font-bold',
					'underline underline-offset-4 decoration-2 decoration-lime-600',
				])}
			>
				{title}
			</p>
			<div className='flex ps-2 gap-2'>
				<div className='flex justify-center border-2 border-stone-950 dark:border-stone-700'></div>
				<div className='flex flex-col w-full ps-4 gap-6'>
					{workExperiences.map((work, i) => (
						<WorkCard key={i} index={i} work={work} />
					))}
				</div>
			</div>
		</div>
	);
}
