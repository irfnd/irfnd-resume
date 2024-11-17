import { useTranslation } from 'react-i18next';

import type { About } from '@/utils/types';

export default function About() {
	const { t } = useTranslation();

	const title = t('portfolio.about.title');
	const about: About['aboutMe'] = t('portfolio.about.aboutMe', { returnObjects: true });

	return (
		<div className='flex flex-col text-stone-950 dark:text-white gap-4'>
			<p className='text-xl sm:text-2xl font-bold underline underline-offset-4 decoration-2 decoration-lime-600'>{title}</p>
			{about.map((item, i) => (
				<p key={i}>{item}</p>
			))}
		</div>
	);
}
