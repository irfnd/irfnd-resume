import { useTranslation } from 'react-i18next';

import type { About } from '@/utils/types';

export default function Avatar() {
	const { t } = useTranslation();

	const photoUrl: About['profile']['url'] = t('portfolio.about.profile.url');
	const altText: About['profile']['alt'] = t('portfolio.about.profile.alt');

	return <img className='w-32 h-32 rounded-full' src={photoUrl} alt={altText} />;
}
