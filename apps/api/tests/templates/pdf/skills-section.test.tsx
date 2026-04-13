/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-pdf/renderer', () => ({
	Text: ({ children }: { children: React.ReactNode }) => <span data-testid='pdf-text'>{children}</span>,
	View: ({ children }: { children: React.ReactNode }) => <div data-testid='pdf-view'>{children}</div>,
	Font: { registerHyphenationCallback: vi.fn() },
	StyleSheet: { create: (s: Record<string, unknown>) => s },
}));

vi.mock('@/templates/pdf/styles', () => ({
	styles: { text: {}, bold: {}, italic: {}, dividerH: {} },
}));

import type { TechnologyData } from '@irfnd/data';
import { render, screen } from '@testing-library/react';

import { SkillsSection } from '@/templates/pdf/sections/skills';

describe('SkillsSection', () => {
	const mockTechnology: TechnologyData = {
		title: 'Technical Skills',
		stacks: {
			Frontend: ['React', 'Vue.js', 'Angular'],
			Backend: ['Node.js', 'Python'],
			Database: ['PostgreSQL'],
		},
	};

	it('should render section title in uppercase', () => {
		render(<SkillsSection technology={mockTechnology} />);
		expect(screen.getByText('TECHNICAL SKILLS')).toBeInTheDocument();
	});

	it('should render all skill categories', () => {
		render(<SkillsSection technology={mockTechnology} />);
		expect(screen.getByText('Frontend')).toBeInTheDocument();
		expect(screen.getByText('Backend')).toBeInTheDocument();
		expect(screen.getByText('Database')).toBeInTheDocument();
	});

	it('should render skill labels sorted alphabetically', () => {
		render(<SkillsSection technology={mockTechnology} />);
		expect(screen.getByText('Angular, React, Vue.js')).toBeInTheDocument();
	});

	it('should render skills separated by commas', () => {
		render(<SkillsSection technology={mockTechnology} />);
		expect(screen.getByText('Node.js, Python')).toBeInTheDocument();
	});

	it('should render single skill without comma', () => {
		render(<SkillsSection technology={mockTechnology} />);
		expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
	});

	it('should render colon separators', () => {
		render(<SkillsSection technology={mockTechnology} />);
		const colons = screen.getAllByText(':');
		expect(colons).toHaveLength(3);
	});

	it('should handle empty stacks object', () => {
		const emptyTech: TechnologyData = { title: 'Skills', stacks: {} };
		render(<SkillsSection technology={emptyTech} />);
		expect(screen.getByText('SKILLS')).toBeInTheDocument();
	});
});
