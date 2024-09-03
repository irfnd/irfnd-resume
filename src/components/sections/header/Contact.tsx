import { capitalize } from '@/utils/string.utils';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import type { About } from '@/utils/types';

import { IconBrandGithub, IconBrandInstagram, IconBrandLinkedin, IconBrandX, IconMail } from '@tabler/icons-react';

export default function Contact() {
	const { t } = useTranslation();

	const socialMedia: About['socialMedia'] = t('portfolio.about.socialMedia', { returnObjects: true });

	const iconList = {
		github: <IconBrandGithub />,
		linkedIn: <IconBrandLinkedin />,
		twitter: <IconBrandX />,
		instagram: <IconBrandInstagram />,
		email: <IconMail />,
	};

	return (
		<div className='flex text-stone-200 gap-4'>
			{Object.keys(socialMedia)
				.filter((name) => name !== 'portfolio')
				.map((name) => (
					<a href={socialMedia[name]} target='_blank' aria-label={capitalize(`${name} Link`)} key={name}>
						{React.cloneElement(iconList[name as keyof typeof iconList], {
							className: 'transition-all hover:text-lime-500 hover:scale-125 cursor-pointer',
							size: 22,
						})}
					</a>
				))}
		</div>
	);
}
