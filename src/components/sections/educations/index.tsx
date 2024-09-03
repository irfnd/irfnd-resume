import { useTranslation } from 'react-i18next';

import type { Educations } from '@/utils/types';

import EducationCard from '@/components/sections/educations/EducationCard';
import { cn } from '@/utils/cn';

export default function Educations() {
	const { t } = useTranslation();

	const title = t('portfolio.educations.title');
	const educations: Educations['list'] = t('portfolio.educations.list', { returnObjects: true });

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
					{educations.map((education, i) => (
						<EducationCard key={i} index={i} education={education} />
					))}
				</div>
			</div>
		</div>
	);
}
