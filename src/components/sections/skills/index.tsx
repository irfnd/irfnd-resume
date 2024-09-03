import { useTranslation } from 'react-i18next';

import type { MergeUnion, Skills } from '@/utils/types';

import SkillItem from '@/components/sections/skills/SkillItem';

export default function Skills() {
	const { t } = useTranslation();

	const { title, ...skills }: MergeUnion<Skills> = t('portfolio.skills', { returnObjects: true });

	return (
		<div className='flex flex-col text-stone-950 dark:text-white gap-4'>
			<p className='text-xl sm:text-2xl font-bold underline underline-offset-4 decoration-2 decoration-lime-600'>{title}</p>
			<div className='flex flex-col gap-6 sm:gap-2'>
				{Object.keys(skills).map((skill, i) => (
					<div key={i} className='flex flex-col sm:flex-row gap-2'>
						<div className='w-full sm:w-32'>
							<p className='capitalize font-semibold'>{skill}</p>
						</div>
						<p className='hidden sm:flex text-stone-600 dark:text-stone-400'>:</p>
						<SkillItem skills={skills} skill={skill as keyof Omit<MergeUnion<Skills>, 'title'>} />
					</div>
				))}
			</div>
		</div>
	);
}
