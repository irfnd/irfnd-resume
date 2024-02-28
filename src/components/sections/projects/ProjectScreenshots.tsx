import type { Projects } from '@/utils/types';

interface IProjectScreenshots {
	screenshot: Exclude<Projects['list'][number]['screenshots'], null>[number];
}

export default function ProjectScreenshots({ screenshot }: IProjectScreenshots) {
	return (
		<div className='w-full flex flex-col gap-2'>
			<img src={screenshot.url} alt={screenshot.alt} className='w-full rounded-md' />
			<p className='text-xs text-stone-600 dark:text-stone-400'>{screenshot.alt}</p>
		</div>
	);
}
