import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-pdf/renderer', () => ({
	Link: ({ children, src }: { children: React.ReactNode; src: string }) => (
		<a href={src} data-testid='pdf-link'>
			{children}
		</a>
	),
	Text: ({ children }: { children: React.ReactNode }) => <span data-testid='pdf-text'>{children}</span>,
	View: ({ children }: { children: React.ReactNode }) => <div data-testid='pdf-view'>{children}</div>,
	Font: { registerHyphenationCallback: vi.fn() },
	StyleSheet: { create: (s: Record<string, unknown>) => s },
}));

vi.mock('@/components/pdf/styles', () => ({
	styles: {
		text: {},
		bold: {},
		italic: {},
		dividerH: {},
		dividerV: {},
		link: {},
	},
}));

import { render, screen } from '@testing-library/react';

import { ProjectsSection } from '@/components/pdf/sections/projects';
import type { IPortfolio } from '@/types';

describe('ProjectsSection', () => {
	const mockPortfolio = {
		title: 'Projects',
		tabs: [],
		projects: [
			{
				name: 'Project Alpha',
				category: 'frontend',
				type: 'public',
				summary: [{ value: 'A {0} web app.', keywords: ['modern'] }],
				stacks: [
					{ label: 'React', url: '', icon: null, color: '' },
					{ label: 'TypeScript', url: '', icon: null, color: '' },
				],
				demo: 'https://alpha.example.com',
				source: 'https://github.com/example/alpha',
				image: [],
			},
			{
				name: 'Project Beta',
				category: 'backend',
				type: 'private',
				summary: [{ value: 'Internal API service.', keywords: [] }],
				stacks: [],
				demo: '',
				source: '',
				image: [],
			},
			{
				name: 'Project Gamma',
				category: 'fullstack',
				type: 'public',
				summary: [],
				stacks: [{ label: 'Node.js', url: '', icon: null, color: '' }],
				demo: 'https://gamma.example.com',
				source: '',
				image: [],
			},
		],
	} as unknown as IPortfolio;

	describe('English language', () => {
		it('should render section title in uppercase', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language='en' />);
			expect(screen.getByText('PROJECTS')).toBeInTheDocument();
		});

		it('should render project name in uppercase with demo link', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language='en' />);
			const link = screen.getByText('PROJECT ALPHA');
			expect(link.closest('a')).toHaveAttribute('href', 'https://alpha.example.com');
		});

		it('should render project name without link when no demo', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language='en' />);
			expect(screen.getByText('PROJECT BETA')).toBeInTheDocument();
		});

		it('should render summary with resolved placeholders', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language='en' />);
			expect(screen.getByText('A modern web app.')).toBeInTheDocument();
		});

		it('should render technology stacks sorted alphabetically', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language='en' />);
			expect(screen.getByText('React, TypeScript')).toBeInTheDocument();
		});

		it('should render Technologies label in English', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language='en' />);
			expect(screen.getAllByText(/Technologies:/)).toHaveLength(2);
		});

		it('should render Live Demo link in English', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language='en' />);
			expect(screen.getAllByText('Live Demo')).toHaveLength(2);
		});

		it('should render Source Code link in English', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language='en' />);
			expect(screen.getByText('Source Code')).toBeInTheDocument();
		});

		it('should not render demo/source links when not provided', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language='en' />);
			const links = screen.getAllByTestId('pdf-link');
			const sourceLinks = links.filter((l) => l.textContent === 'Source Code');
			expect(sourceLinks).toHaveLength(1);
		});

		it('should handle empty summary gracefully', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language='en' />);
			expect(screen.getByText('PROJECT GAMMA')).toBeInTheDocument();
		});

		it('should handle empty stacks gracefully', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language='en' />);
			expect(screen.getByText('PROJECT BETA')).toBeInTheDocument();
		});
	});

	describe('Indonesian language', () => {
		it('should render Technologies label in Indonesian', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language='id' />);
			expect(screen.getAllByText(/Teknologi:/)).toHaveLength(2);
		});

		it('should render Live Demo link in Indonesian', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language='id' />);
			expect(screen.getAllByText('Lihat Demo')).toHaveLength(2);
		});

		it('should render Source Code link in Indonesian', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language='id' />);
			expect(screen.getByText('Lihat Source Code')).toBeInTheDocument();
		});
	});

	it('should render project with only demo link (no source)', () => {
		render(<ProjectsSection portfolio={mockPortfolio} language='en' />);
		expect(screen.getByText('PROJECT GAMMA')).toBeInTheDocument();
		const gammaLinks = screen.getAllByTestId('pdf-link');
		const gammaDemo = gammaLinks.find(
			(l) => l.getAttribute('href') === 'https://gamma.example.com' && l.textContent === 'Live Demo',
		);
		expect(gammaDemo).toBeTruthy();
	});
});
