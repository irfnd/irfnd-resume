import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-pdf/renderer', () => ({
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
	},
}));

import { render, screen } from '@testing-library/react';

import { SkillsSection } from '@/components/pdf/sections/skills';
import type { ITechnology } from '@/types';

describe('SkillsSection', () => {
	const mockTechnology = {
		title: 'Technical Skills',
		stacks: {
			Frontend: [
				{ label: 'React', url: '', icon: null, color: '' },
				{ label: 'Vue.js', url: '', icon: null, color: '' },
				{ label: 'Angular', url: '', icon: null, color: '' },
			],
			Backend: [
				{ label: 'Node.js', url: '', icon: null, color: '' },
				{ label: 'Python', url: '', icon: null, color: '' },
			],
			Database: [{ label: 'PostgreSQL', url: '', icon: null, color: '' }],
		},
	} as unknown as ITechnology;

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
		const emptyTech: ITechnology = {
			title: 'Skills',
			stacks: {},
		};
		render(<SkillsSection technology={emptyTech} />);
		expect(screen.getByText('SKILLS')).toBeInTheDocument();
	});
});
