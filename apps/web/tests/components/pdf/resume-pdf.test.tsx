import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-pdf/renderer', () => ({
	Document: ({ children }: { children: React.ReactNode }) => <div data-testid='pdf-document'>{children}</div>,
	Page: ({ children }: { children: React.ReactNode }) => <div data-testid='pdf-page'>{children}</div>,
	View: ({ children }: { children: React.ReactNode }) => <div data-testid='pdf-view'>{children}</div>,
	Text: ({ children }: { children: React.ReactNode }) => <span data-testid='pdf-text'>{children}</span>,
	Link: ({ children }: { children: React.ReactNode }) => <a data-testid='pdf-link'>{children}</a>,
	Font: { registerHyphenationCallback: vi.fn() },
	StyleSheet: { create: (s: Record<string, unknown>) => s },
}));

vi.mock('@/components/pdf/styles', () => ({
	styles: {
		page: {},
		text: {},
		bold: {},
		italic: {},
		link: {},
		dividerH: {},
		dividerV: {},
	},
}));

import { render, screen } from '@testing-library/react';

import { ResumePDF, type ResumePDFProps } from '@/components/pdf/resume';

describe('ResumePDF', () => {
	const mockProps = {
		profile: {
			firstName: 'John',
			lastName: 'Doe',
			role: 'Software Engineer',
			photo: { url: '', alt: '' },
			description: '',
		},
		contact: [
			{ type: 'location', label: 'Jakarta', url: '' },
			{ type: 'email', label: 'Email', url: 'mailto:john@example.com' },
		],
		experience: {
			title: 'Experience',
			jobs: [],
		},
		education: {
			title: 'Education',
			educations: [],
		},
		technology: {
			title: 'Skills',
			stacks: {},
		},
		portfolio: {
			title: 'Projects',
			tabs: [],
			projects: [],
		},
		common: {
			technologies: 'Technologies',
			liveDemo: 'Demo',
			source: 'Source Code',
		},
		language: 'en',
	} as unknown as ResumePDFProps;

	it('should render Document component', () => {
		render(<ResumePDF {...mockProps} />);
		expect(screen.getByTestId('pdf-document')).toBeInTheDocument();
	});

	it('should render Page component', () => {
		render(<ResumePDF {...mockProps} />);
		expect(screen.getByTestId('pdf-page')).toBeInTheDocument();
	});

	it('should render all sections', () => {
		render(<ResumePDF {...mockProps} />);
		expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
		expect(screen.getByText('EXPERIENCE')).toBeInTheDocument();
		expect(screen.getByText('EDUCATION')).toBeInTheDocument();
		expect(screen.getByText('SKILLS')).toBeInTheDocument();
		expect(screen.getByText('PROJECTS')).toBeInTheDocument();
	});

	it('should pass common prop to ProjectsSection', () => {
		render(<ResumePDF {...(mockProps as ResumePDFProps)} />);
		expect(screen.getByText('PROJECTS')).toBeInTheDocument();
	});
});
