import { I18nProvider, ThemeProvider } from '@/components/providers';
import { ProjectCard } from '@/components/ui/project-card';
import type { InferArray, IPortfolio } from '@/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

function Wrapper({ children }: { children: ReactNode }) {
	return (
		<I18nProvider defaultLang='en'>
			<ThemeProvider defaultTheme='dark'>{children}</ThemeProvider>
		</I18nProvider>
	);
}

type ProjectItem = InferArray<IPortfolio['projects']>;

const MockIcon = (() => null) as unknown as ProjectItem['icon'];
const MockStackIcon = (({ className }: { className?: string }) => (
	<svg className={className} data-testid='mock-stack-icon' />
)) as unknown as ProjectItem['stacks'][number]['icon'];

const createProject = (overrides: Partial<ProjectItem>): ProjectItem => ({
	icon: MockIcon,
	name: 'Test Project',
	category: 'frontend',
	type: 'public',
	source: 'https://github.com/test',
	demo: 'https://test.com',
	image: [],
	summary: [{ value: 'A test project', keywords: ['test'] }],
	stacks: [],
	...overrides,
});

const publicWithBoth = createProject({
	name: 'Public Both Links',
	source: 'https://github.com/source',
	demo: 'https://demo.com',
});

const publicSourceOnly = createProject({
	name: 'Public Source Only',
	source: 'https://github.com/source',
	demo: undefined,
});

const publicDemoOnly = createProject({
	name: 'Public Demo Only',
	source: undefined,
	demo: 'https://demo.com',
});

const publicNoLinks = createProject({
	name: 'Public No Links',
	source: undefined,
	demo: undefined,
});

const privateProject = createProject({
	name: 'Private Project',
	type: 'private',
	source: undefined,
	demo: undefined,
});

const projectWithImage = createProject({
	name: 'With Image',
	image: [{ url: 'https://cdn.cloudinary.com/image.jpg', alt: 'Test image' }],
});

const projectNoImage = createProject({
	name: 'No Image',
	image: [],
});

const projectWithStacks = createProject({
	name: 'With Stacks',
	stacks: [
		{ label: 'React', url: 'https://react.dev', icon: MockStackIcon, color: '#61DAFB' },
		{ label: 'TypeScript', url: 'https://typescript.com', icon: MockStackIcon, color: '#3178C6' },
	],
});

const projectNoStacks = createProject({
	name: 'No Stacks',
	stacks: [],
});

describe('ProjectCard', () => {
	describe('Regular card (isFirst=false)', () => {
		it('should render project name', () => {
			render(<ProjectCard {...publicWithBoth} />, { wrapper: Wrapper });
			expect(screen.getByText(publicWithBoth.name)).toBeInTheDocument();
		});

		it('should render public project with source and demo links', () => {
			render(<ProjectCard {...publicWithBoth} />, { wrapper: Wrapper });
			expect(screen.getByRole('link', { name: /source/i })).toHaveAttribute('href', publicWithBoth.source);
			expect(screen.getByRole('link', { name: /^demo$/i })).toHaveAttribute('href', publicWithBoth.demo);
		});

		it('should render public project with source only', () => {
			render(<ProjectCard {...publicSourceOnly} />, { wrapper: Wrapper });
			expect(screen.getByRole('link', { name: /source/i })).toHaveAttribute('href', publicSourceOnly.source);
			expect(screen.queryByRole('link', { name: /^demo$/i })).not.toBeInTheDocument();
		});

		it('should render public project with demo only', () => {
			render(<ProjectCard {...publicDemoOnly} />, { wrapper: Wrapper });
			expect(screen.queryByRole('link', { name: /source/i })).not.toBeInTheDocument();
			expect(screen.getByRole('link', { name: /^demo$/i })).toHaveAttribute('href', publicDemoOnly.demo);
		});

		it('should render public project without any links', () => {
			render(<ProjectCard {...publicNoLinks} />, { wrapper: Wrapper });
			expect(screen.queryByRole('link', { name: /source/i })).not.toBeInTheDocument();
			expect(screen.queryByRole('link', { name: /^demo$/i })).not.toBeInTheDocument();
		});

		it('should render private project with internal badge', () => {
			render(<ProjectCard {...privateProject} />, { wrapper: Wrapper });
			expect(screen.getByText(privateProject.name)).toBeInTheDocument();
			expect(screen.getByText(/internal/i)).toBeInTheDocument();
		});

		it('should render project with image', () => {
			render(<ProjectCard {...projectWithImage} isFirst={false} />, { wrapper: Wrapper });
			expect(screen.getByText(projectWithImage.name)).toBeInTheDocument();
		});

		it('should render project without image', () => {
			render(<ProjectCard {...projectNoImage} isFirst={false} />, { wrapper: Wrapper });
			expect(screen.getByText(projectNoImage.name)).toBeInTheDocument();
		});

		it('should render tech stacks', () => {
			render(<ProjectCard {...projectWithStacks} />, { wrapper: Wrapper });
			projectWithStacks.stacks.forEach((stack) => {
				expect(screen.getByRole('link', { name: stack.label })).toBeInTheDocument();
			});
		});

		it('should render without tech stacks', () => {
			render(<ProjectCard {...projectNoStacks} />, { wrapper: Wrapper });
			expect(screen.getByText(projectNoStacks.name)).toBeInTheDocument();
		});

		it('should stop propagation when clicking on tech stack links', async () => {
			const user = userEvent.setup();
			render(<ProjectCard {...projectWithStacks} />, { wrapper: Wrapper });

			const stackLink = screen.getByRole('link', { name: projectWithStacks.stacks[0].label });
			await user.click(stackLink);

			expect(screen.getAllByText(projectWithStacks.name).length).toBe(1);
		});

		it('should stop propagation when clicking on source link', async () => {
			const user = userEvent.setup();
			render(<ProjectCard {...publicWithBoth} />, { wrapper: Wrapper });

			const sourceLink = screen.getByRole('link', { name: /source/i });
			await user.click(sourceLink);

			expect(screen.getAllByText(publicWithBoth.name).length).toBe(1);
		});

		it('should stop propagation when clicking on demo link', async () => {
			const user = userEvent.setup();
			render(<ProjectCard {...publicWithBoth} />, { wrapper: Wrapper });

			const demoLink = screen.getByRole('link', { name: /^demo$/i });
			await user.click(demoLink);

			expect(screen.getAllByText(publicWithBoth.name).length).toBe(1);
		});

		it('should open dialog on click', async () => {
			const user = userEvent.setup();
			render(<ProjectCard {...publicWithBoth} />, { wrapper: Wrapper });

			const projectName = screen.getByText(publicWithBoth.name);
			await user.click(projectName.closest('[class*="glass-card"]')!);

			expect(screen.getAllByText(publicWithBoth.name).length).toBeGreaterThan(1);
		});
	});

	describe('Featured card (isFirst=true)', () => {
		it('should render featured card with image', () => {
			render(<ProjectCard {...projectWithImage} isFirst />, { wrapper: Wrapper });
			expect(screen.getByText(projectWithImage.name)).toBeInTheDocument();
		});

		it('should render featured card without image', () => {
			render(<ProjectCard {...projectNoImage} isFirst />, { wrapper: Wrapper });
			expect(screen.getByText(projectNoImage.name)).toBeInTheDocument();
		});

		it('should render featured public project with source and demo links', () => {
			render(<ProjectCard {...publicWithBoth} isFirst />, { wrapper: Wrapper });
			expect(screen.getByRole('link', { name: /source/i })).toHaveAttribute('href', publicWithBoth.source);
			expect(screen.getByRole('link', { name: /^demo$/i })).toHaveAttribute('href', publicWithBoth.demo);
		});

		it('should render featured public project with source only', () => {
			render(<ProjectCard {...publicSourceOnly} isFirst />, { wrapper: Wrapper });
			expect(screen.getByRole('link', { name: /source/i })).toHaveAttribute('href', publicSourceOnly.source);
			expect(screen.queryByRole('link', { name: /^demo$/i })).not.toBeInTheDocument();
		});

		it('should render featured public project with demo only', () => {
			render(<ProjectCard {...publicDemoOnly} isFirst />, { wrapper: Wrapper });
			expect(screen.queryByRole('link', { name: /source/i })).not.toBeInTheDocument();
			expect(screen.getByRole('link', { name: /^demo$/i })).toHaveAttribute('href', publicDemoOnly.demo);
		});

		it('should render featured public project without any links', () => {
			render(<ProjectCard {...publicNoLinks} isFirst />, { wrapper: Wrapper });
			expect(screen.queryByRole('link', { name: /source/i })).not.toBeInTheDocument();
			expect(screen.queryByRole('link', { name: /^demo$/i })).not.toBeInTheDocument();
		});

		it('should render featured private project with internal badge', () => {
			render(<ProjectCard {...privateProject} isFirst />, { wrapper: Wrapper });
			expect(screen.getByText(/internal/i)).toBeInTheDocument();
		});

		it('should render featured card with tech stacks', () => {
			render(<ProjectCard {...projectWithStacks} isFirst />, { wrapper: Wrapper });
			projectWithStacks.stacks.forEach((stack) => {
				expect(screen.getByRole('link', { name: stack.label })).toBeInTheDocument();
			});
		});

		it('should render featured card without tech stacks', () => {
			render(<ProjectCard {...projectNoStacks} isFirst />, { wrapper: Wrapper });
			expect(screen.getByText(projectNoStacks.name)).toBeInTheDocument();
		});

		it('should stop propagation when clicking on featured tech stack links', async () => {
			const user = userEvent.setup();
			render(<ProjectCard {...projectWithStacks} isFirst />, { wrapper: Wrapper });

			const stackLink = screen.getByRole('link', { name: projectWithStacks.stacks[0].label });
			await user.click(stackLink);

			expect(screen.getAllByText(projectWithStacks.name).length).toBe(1);
		});

		it('should stop propagation when clicking on featured source link', async () => {
			const user = userEvent.setup();
			render(<ProjectCard {...publicWithBoth} isFirst />, { wrapper: Wrapper });

			const sourceLink = screen.getByRole('link', { name: /source/i });
			await user.click(sourceLink);

			expect(screen.getAllByText(publicWithBoth.name).length).toBe(1);
		});

		it('should stop propagation when clicking on featured demo link', async () => {
			const user = userEvent.setup();
			render(<ProjectCard {...publicWithBoth} isFirst />, { wrapper: Wrapper });

			const demoLink = screen.getByRole('link', { name: /^demo$/i });
			await user.click(demoLink);

			expect(screen.getAllByText(publicWithBoth.name).length).toBe(1);
		});

		it('should open dialog on click for featured card', async () => {
			const user = userEvent.setup();
			render(<ProjectCard {...publicWithBoth} isFirst />, { wrapper: Wrapper });

			const projectName = screen.getByText(publicWithBoth.name);
			await user.click(projectName.closest('[class*="glass-card"]')!);

			expect(screen.getAllByText(publicWithBoth.name).length).toBeGreaterThan(1);
		});
	});
});
