import { useTranslation } from 'react-i18next';

import type { About } from '@/utils/types';

export default function Name() {
	const { t } = useTranslation();

	const fullname: About['name'][] = t('portfolio.about.name').split(' ');
	const headline: About['headline'] = t('portfolio.about.headline');
	const location: About['location'] = t('portfolio.about.location');

	return (
		<div className='flex flex-col text-center sm:text-right'>
			<p className='text-3xl text-stone-100 font-thin'>
				<span className='font-bold'>{fullname[0]}</span> {fullname.slice(1).join(' ') ?? null}
			</p>
			<p className='text-sm text-lime-500 font-semibold uppercase tracking-widest'>{headline}</p>
			<p className='text-sm text-stone-300 font-thin'>{location}</p>
		</div>
	);
}
