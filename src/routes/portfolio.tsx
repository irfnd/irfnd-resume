import { useTranslation } from '@/hooks';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';

import { ProjectCard } from '@/components/ui';
import { Tabs } from '@base-ui/react/tabs';

export const Route = createFileRoute('/portfolio')({
	component: RouteComponent,
});

function RouteComponent() {
	const { common, portfolio } = useTranslation();
	const [tabActive, setTabActive] = React.useState<'all' | 'frontend' | 'backend' | 'fullstack'>('all');

	const filteredProjects = React.useMemo(() => {
		return tabActive === 'all' ? portfolio.projects : portfolio.projects.filter((project) => project.category === tabActive);
	}, [portfolio.projects, tabActive]);

	return (
		<React.Fragment>
			<div className='grid mb-8 gap-8'>
				<div className='flex items-center'>
					<h2 className='text-lg font-semibold text-slate-900 dark:text-white tracking-tight'>Portfolio</h2>
					<div className='h-px bg-slate-200 dark:bg-neutral-800 w-full ml-6'></div>
				</div>

				<Tabs.Root value={tabActive} onValueChange={setTabActive}>
					<div className='flex flex-col sm:flex-row md:justify-between sm:gap-0 gap-6'>
						<p className='text-slate-500 dark:text-neutral-400 max-w-md'>
							A selection of production-grade applications, APIs, and experiments built with modern technologies.
						</p>

						<Tabs.List className='flex p-1 h-fit bg-slate-100 dark:bg-neutral-900/50 rounded-lg border border-slate-200 dark:border-neutral-800'>
							{common.portfolioCategories.map((tab) => (
								<Tabs.Tab
									key={tab.value}
									value={tab.value}
									className='px-3 py-1.5 w-full rounded-md text-xs font-medium border border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors data-active:bg-white data-active:dark:bg-neutral-800 data-active:text-slate-900 data-active:dark:text-white data-active:shadow-sm data-active:border-slate-200 data-active:dark:border-neutral-700 cursor-pointer'
								>
									{tab.label}
								</Tabs.Tab>
							))}
						</Tabs.List>
					</div>

					{common.portfolioCategories.map((tab) => (
						<Tabs.Panel key={tab.value} value={tab.value} className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
							{filteredProjects.length > 0
								? filteredProjects.map((project, projectIndex) => (
										<ProjectCard key={project.name} {...project} isFirst={projectIndex === 0} />
									))
								: null}
						</Tabs.Panel>
					))}
				</Tabs.Root>
			</div>
		</React.Fragment>
	);
}
