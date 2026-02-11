import { useTranslation } from '@/hooks';
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import * as React from 'react';

import { ProjectCard, SlideUp, StaggerContainer, StaggerItem } from '@/components/ui';
import { Tabs } from '@base-ui/react/tabs';

const MotionTab = motion(Tabs.Tab);

export const Route = createFileRoute('/portfolio')({
	component: RouteComponent,
});

function RouteComponent() {
	const { common, portfolio } = useTranslation();
	const [tabActive, setTabActive] = React.useState<'all' | 'frontend' | 'backend' | 'fullstack'>('all');

	const filteredProjects = React.useMemo(() => {
		if (!portfolio.projects || portfolio.projects.length === 0) return [];
		return tabActive === 'all' ? portfolio.projects : portfolio.projects.filter((project) => project.category === tabActive);
	}, [portfolio.projects, tabActive]);

	return (
		<SlideUp className='grid mb-8 gap-8'>
			<div className='flex items-center'>
				<h2 className='text-lg font-semibold text-foreground tracking-tight'>{portfolio.header}</h2>
				<div className='h-px bg-border w-full ml-6'></div>
			</div>

			<Tabs.Root value={tabActive} onValueChange={setTabActive}>
				<div className='flex flex-col sm:flex-row md:justify-between sm:gap-0 gap-6'>
					<p className='text-muted-foreground max-w-md'>{portfolio.subtitle}</p>

					<Tabs.List className='flex gap-1 p-1.5 h-fit bg-background/80 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/10 light-shadow dark:shadow-none'>
						{common.portfolioCategories.map((tab) => (
							<MotionTab
								key={tab.value}
								value={tab.value}
								initial={{ scale: 1 }}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 1 }}
								transition={{ type: 'spring', stiffness: 400, damping: 10 }}
								className='px-3 py-1.5 w-full rounded-xl text-xs font-medium transition-colors duration-300 cursor-pointer outline-none focus-visible:ring focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500 text-muted-foreground/80 hover:text-foreground hover:bg-white/60 dark:hover:bg-secondary data-active:bg-white/80 data-active:dark:bg-secondary data-active:text-foreground'
							>
								{tab.label}
							</MotionTab>
						))}
					</Tabs.List>
				</div>

				{common.portfolioCategories.map((tab) => (
					<Tabs.Panel key={tab.value} value={tab.value}>
						<StaggerContainer className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
							{filteredProjects.length > 0
								? filteredProjects.map((project, projectIndex) => (
										<StaggerItem key={`${tab.value}-${projectIndex}`} className={projectIndex === 0 ? 'md:col-span-2' : ''}>
											<ProjectCard {...project} isFirst={projectIndex === 0} />
										</StaggerItem>
									))
								: null}
						</StaggerContainer>
					</Tabs.Panel>
				))}
			</Tabs.Root>
		</SlideUp>
	);
}
