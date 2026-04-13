/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-pdf/renderer', () => ({
	Link: ({ children, src }: { children: React.ReactNode; src: string }) => (
		<a href={src} data-testid="pdf-link">{children}</a>
	),
	Text: ({ children }: { children: React.ReactNode }) => <span data-testid="pdf-text">{children}</span>,
	View: ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-view">{children}</div>,
	Font: { registerHyphenationCallback: vi.fn() },
	StyleSheet: { create: (s: Record<string, unknown>) => s },
}));

vi.mock('@/templates/pdf/styles', () => ({
	styles: { text: {}, bold: {}, italic: {}, dividerH: {}, dividerV: {}, link: {} },
}));

import { render, screen } from '@testing-library/react';
import type { PortfolioData } from '@irfnd/data';

import { ProjectsSection } from '@/templates/pdf/sections/projects';

describe('ProjectsSection', () => {
	const mockPortfolio: PortfolioData = {
		header: 'Portfolio',
		title: 'Projects',
		subtitle: 'My projects',
		projects: [
			{
				icon: '',
				name: 'Project Alpha',
				category: 'frontend',
				type: 'public',
				summary: [{ value: 'A {0} web app.', keywords: ['modern'] }],
				stacks: ['TypeScript', 'React'],
				demo: 'https://alpha.example.com',
				source: 'https://github.com/example/alpha',
				image: [],
				isSelected: true,
			},
			{
				icon: '',
				name: 'Project Beta',
				category: 'backend',
				type: 'private',
				summary: [{ value: 'Internal API service.', keywords: [] }],
				stacks: [],
				demo: null,
				source: null,
				image: [],
				isSelected: true,
			},
			{
				icon: '',
				name: 'Project Gamma',
				category: 'fullstack',
				type: 'public',
				summary: [],
				stacks: ['Node.js'],
				demo: 'https://gamma.example.com',
				source: null,
				image: [],
				isSelected: true,
			},
			{
				icon: '',
				name: 'Hidden Project',
				category: 'frontend',
				type: 'public',
				summary: [],
				stacks: [],
				demo: null,
				source: null,
				image: [],
			},
		],
	};

	describe('English language', () => {
		it('should render section title in uppercase', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.getByText('PROJECTS')).toBeInTheDocument();
		});

		it('should render project name in uppercase with demo link', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			const link = screen.getByText('PROJECT ALPHA');
			expect(link.closest('a')).toHaveAttribute('href', 'https://alpha.example.com');
		});

		it('should render project name without link when no demo', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.getByText('PROJECT BETA')).toBeInTheDocument();
		});

		it('should render summary with resolved placeholders', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.getByText('A modern web app.')).toBeInTheDocument();
		});

		it('should render technology stacks sorted alphabetically', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.getByText('React, TypeScript')).toBeInTheDocument();
		});

		it('should render Technologies label in English', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.getAllByText(/Technologies:/)).toHaveLength(2);
		});

		it('should render Live Demo link in English', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.getAllByText('Live Demo')).toHaveLength(2);
		});

		it('should render Source Code link in English', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.getByText('Source Code')).toBeInTheDocument();
		});

		it('should not render projects without isSelected', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.queryByText('HIDDEN PROJECT')).not.toBeInTheDocument();
		});

		it('should handle empty summary', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.getByText('PROJECT GAMMA')).toBeInTheDocument();
		});

		it('should handle empty stacks', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.getByText('PROJECT BETA')).toBeInTheDocument();
		});

		it('should not render links when neither demo nor source', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			const links = screen.getAllByTestId('pdf-link');
			const sourceLinks = links.filter((l) => l.textContent === 'Source Code');
			expect(sourceLinks).toHaveLength(1);
		});
	});

	describe('Indonesian language', () => {
		it('should render Technologies label in Indonesian', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="id" />);
			expect(screen.getAllByText(/Teknologi:/)).toHaveLength(2);
		});

		it('should render Live Demo link in Indonesian', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="id" />);
			expect(screen.getAllByText('Lihat Demo')).toHaveLength(2);
		});

		it('should render Source Code link in Indonesian', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="id" />);
			expect(screen.getByText('Lihat Source Code')).toBeInTheDocument();
		});
	});
});
