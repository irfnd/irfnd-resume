import * as React from 'react';
import { capitalize } from '@/utils/string.utils';

import type { Projects } from '@/utils/types';

import { IconBrandGithub, IconBrandGitlab, IconExternalLink } from '@tabler/icons-react';

interface IProjectCardIcon {
	links: Projects['list'][number]['links'];
	link: string;
}

export default function ProjectCardIcon({ link, links }: IProjectCardIcon) {
	const iconList = {
		github: <IconBrandGithub />,
		gitlab: <IconBrandGitlab />,
		demo: <IconExternalLink />,
	};

	return (
		<a href={links ? links[link] : '#'} target='_blank' aria-label={capitalize(`${link} Link`)}>
			{React.cloneElement(iconList[link as keyof typeof iconList], {
				size: 20,
				className: 'text-stone-600 dark:text-stone-400 hover:text-black hover:scale-110 dark:hover:text-lime-400',
			})}
		</a>
	);
}
