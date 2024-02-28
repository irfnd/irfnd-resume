import * as React from 'react';
import { capitalize } from '@/utils/string.utils';
import { useTranslation } from 'react-i18next';

import type { Projects } from '@/utils/types';

import { IconBrandGithub, IconBrandGitlab, IconExternalLink } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

interface IProjectCardModalBtn {
	links: Projects['list'][number]['links'];
	link: string;
}

export default function ProjectCardModalBtn({ link, links }: IProjectCardModalBtn) {
	const { i18n } = useTranslation();

	const isDemo = i18n.language === 'en' ? 'See Demo' : 'Lihat Demo';
	const notDemo = i18n.language === 'en' ? 'Source Code' : 'Lihat Source Code';
	const iconList = {
		github: <IconBrandGithub />,
		gitlab: <IconBrandGitlab />,
		demo: <IconExternalLink />,
	};

	return (
		<a href={links ? links[link] : '#'} target='_blank' aria-label={capitalize(`${link} Link`)}>
			<Button variant='primary' className='w-full sm:w-fit space-x-1'>
				<span>{link === 'demo' ? isDemo : notDemo}</span>
				{React.cloneElement(iconList[link as keyof typeof iconList], { size: 20 })}
			</Button>
		</a>
	);
}
