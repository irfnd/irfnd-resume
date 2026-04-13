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
	styles: { text: {}, bold: {}, italic: {}, dividerH: {}, link: {} },
}));

import { render, screen } from '@testing-library/react';
import type { ExperienceData } from '@irfnd/data';

import { ExperienceSection } from '@/templates/pdf/sections/experience';

describe('ExperienceSection', () => {
	const mockExperience: ExperienceData = {
		title: 'Work Experience',
		jobs: [
			{
				company: 'Tech Corp',
				mainPosition: 'Senior Developer',
				location: 'Remote',
				type: 'Full-time',
				duration: ['Jan 2023', 'Present'],
				link: 'https://techcorp.com',
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
				mainPosition: 'Full Stack Developer',
				location: 'Jakarta',
				type: 'Contract',
				duration: ['Jun 2022', 'Dec 2022'],
				link: null,
				descriptions: [
					{
						position: 'Full Stack Developer',
						summary: [],
						points: [],
						stacks: [],
					},
					{
						position: 'Frontend Developer',
						duration: ['Jun 2022', 'Sep 2022'],
						summary: [],
						points: [{ value: 'Implemented UI components.', keywords: [] }],
						stacks: [],
					},
				],
			},
		],
	};

	it('should render section title in uppercase', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('WORK EXPERIENCE')).toBeInTheDocument();
	});

	it('should render company name in uppercase with link', () => {
		render(<ExperienceSection experience={mockExperience} />);
		const link = screen.getByText('TECH CORP');
		expect((link as unknown as { closest(s: string): unknown }).closest('a')).toHaveAttribute('href', 'https://techcorp.com');
	});

	it('should render company name without link when null', () => {
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

	it('should render per-description duration for subsequent descriptions', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Jun 2022 – Sep 2022')).toBeInTheDocument();
	});

	it('should fall back to job duration when description has no duration', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Jakarta · Contract')).toBeInTheDocument();
	});

	it('should use job duration for subsequent position without specific duration', () => {
		const dataWithMultiplePositions: ExperienceData = {
			title: 'Experience',
			jobs: [
				{
					company: 'Test Co',
					mainPosition: 'Developer',
					location: 'NYC',
					type: 'Full-time',
					duration: ['Jan 2020', 'Dec 2022'],
					link: null,
					descriptions: [
						{ position: 'Senior Dev', summary: [], points: [], stacks: [] },
						{ position: 'Junior Dev', summary: [], points: [], stacks: [] },
					],
				},
			],
		};
		render(<ExperienceSection experience={dataWithMultiplePositions} />);
		const durations = screen.getAllByText('Jan 2020 – Dec 2022');
		expect(durations).toHaveLength(2); // Job header and fallback for 2nd position
	});

	it('should render summary with resolved placeholders', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Built scalable applications.')).toBeInTheDocument();
	});

	it('should render bullet points with resolved placeholders', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Led team of 5 developers.')).toBeInTheDocument();
	});

	it('should render multiple positions for same company', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
		expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
	});
});
