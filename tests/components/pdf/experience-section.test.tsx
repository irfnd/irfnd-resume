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
		link: {},
	},
}));

import { render, screen } from '@testing-library/react';

import { ExperienceSection } from '@/components/pdf/sections/experience';
import type { IExperience } from '@/types';

describe('ExperienceSection', () => {
	const mockExperience = {
		title: 'Work Experience',
		jobs: [
			{
				company: 'Tech Corp',
				location: 'Remote',
				type: 'Full-time',
				duration: ['Jan 2023', 'Present'],
				link: 'https://techcorp.com',
				stacks: [],
				descriptions: [
					{
						position: 'Senior Developer',
						summary: [{ value: 'Built {0} applications.', keywords: ['scalable'] }],
						points: [{ value: 'Led team of {0} developers.', keywords: ['5'] }],
						stacks: [],
					},
				],
			},
			{
				company: 'Startup Inc',
				location: 'Jakarta',
				type: 'Contract',
				duration: ['Jun 2022', 'Dec 2022'],
				link: '',
				stacks: [],
				descriptions: [
					{
						position: 'Full Stack Developer',
						summary: [],
						points: [],
						stacks: [],
					},
					{
						position: 'Frontend Developer',
						summary: [],
						points: [{ value: 'Implemented UI components.', keywords: [] }],
						stacks: [],
					},
				],
			},
		],
	} as unknown as IExperience;

	it('should render section title in uppercase', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('WORK EXPERIENCE')).toBeInTheDocument();
	});

	it('should render company name in uppercase with link', () => {
		render(<ExperienceSection experience={mockExperience} />);
		const link = screen.getByText('TECH CORP');
		expect(link.closest('a')).toHaveAttribute('href', 'https://techcorp.com');
	});

	it('should render company name without link when not provided', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('STARTUP INC')).toBeInTheDocument();
	});

	it('should render job duration', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Jan 2023 – Present')).toBeInTheDocument();
	});

	it('should render position title', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Senior Developer')).toBeInTheDocument();
	});

	it('should render location and type for first description', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Remote · Full-time')).toBeInTheDocument();
	});

	it('should render duration instead of location for subsequent descriptions', () => {
		render(<ExperienceSection experience={mockExperience} />);
		const durations = screen.getAllByText('Jun 2022 – Dec 2022');
		expect(durations.length).toBeGreaterThanOrEqual(1);
	});

	it('should render summary text', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Built scalable applications.')).toBeInTheDocument();
	});

	it('should render bullet points', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Led team of 5 developers.')).toBeInTheDocument();
	});

	it('should handle empty summary gracefully', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
	});

	it('should render multiple positions for same company', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
		expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
	});
});
