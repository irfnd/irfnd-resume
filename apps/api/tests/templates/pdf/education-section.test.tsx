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
import type { EducationData } from '@irfnd/data';

import { EducationSection } from '@/templates/pdf/sections/education';

describe('EducationSection', () => {
	const mockEducation: EducationData = {
		title: 'Education',
		educations: [
			{
				institution: 'University of Technology',
				location: 'Jakarta',
				degree: 'Bachelor of Science',
				fieldOfStudy: 'Computer Science',
				duration: ['2018', '2022'],
				link: 'https://university.edu',
				summary: [{ value: 'Graduated with {0}.', keywords: ['honors'] }],
				points: [{ value: "Dean's List {0}.", keywords: ['2020'] }],
				award: [{ label: 'Best Thesis', description: 'Machine Learning Project', icon: '' }],
			},
			{
				institution: 'High School',
				location: 'Bandung',
				degree: 'High School Diploma',
				fieldOfStudy: 'Science',
				duration: ['2015', '2018'],
				link: null,
				summary: [],
				points: [],
				award: [],
			},
		],
	};

	it('should render section title in uppercase', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText('EDUCATION')).toBeInTheDocument();
	});

	it('should render institution name in uppercase with link', () => {
		render(<EducationSection education={mockEducation} />);
		const link = screen.getByText('UNIVERSITY OF TECHNOLOGY');
		expect((link as unknown as { closest(s: string): unknown }).closest('a')).toHaveAttribute('href', 'https://university.edu');
	});

	it('should render institution name without link when null', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText('HIGH SCHOOL')).toBeInTheDocument();
	});

	it('should render education duration', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText('2018 – 2022')).toBeInTheDocument();
	});

	it('should render degree and field of study', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText('Bachelor of Science · Computer Science')).toBeInTheDocument();
	});

	it('should render location', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText('Jakarta')).toBeInTheDocument();
	});

	it('should render summary with resolved placeholders', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText('Graduated with honors.')).toBeInTheDocument();
	});

	it('should render bullet points with resolved placeholders', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText("Dean's List 2020.")).toBeInTheDocument();
	});

	it('should render awards', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText('Best Thesis — Machine Learning Project')).toBeInTheDocument();
	});

	it('should handle empty summary, points, and awards', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText('HIGH SCHOOL')).toBeInTheDocument();
		expect(screen.getByText('High School Diploma · Science')).toBeInTheDocument();
	});

	it('should render multiple education entries', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText('UNIVERSITY OF TECHNOLOGY')).toBeInTheDocument();
		expect(screen.getByText('HIGH SCHOOL')).toBeInTheDocument();
	});
});
