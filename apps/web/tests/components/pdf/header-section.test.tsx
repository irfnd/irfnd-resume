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
		link: {},
	},
}));

import { render, screen } from '@testing-library/react';

import { HeaderSection } from '@/components/pdf/sections/header';
import type { IContact, IProfile } from '@/types';

describe('HeaderSection', () => {
	const mockProfile = {
		firstName: 'John',
		lastName: 'Doe',
		role: 'Software Engineer',
		photo: { url: '', alt: '' },
		description: '',
	} as IProfile;

	const mockContact = [
		{ type: 'location', label: 'Jakarta, Indonesia', url: '' },
		{ type: 'email', label: 'Email', url: 'mailto:john@example.com' },
		{ type: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/johndoe' },
		{ type: 'github', label: 'GitHub', url: 'https://github.com/johndoe' },
	] as unknown as IContact[];

	it('should render profile name in uppercase', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
	});

	it('should render profile role', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		expect(screen.getByText('Software Engineer')).toBeInTheDocument();
	});

	it('should render location', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		expect(screen.getByText('Jakarta, Indonesia')).toBeInTheDocument();
	});

	it('should format mailto URLs correctly', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		expect(screen.getByText('john@example.com')).toBeInTheDocument();
	});

	it('should format LinkedIn URLs correctly', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		expect(screen.getByText('linkedin.com/in/johndoe')).toBeInTheDocument();
	});

	it('should format GitHub URLs correctly', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		expect(screen.getByText('github.com/johndoe')).toBeInTheDocument();
	});

	it('should render without location when not provided', () => {
		const contactWithoutLocation = mockContact.filter((c) => c.type !== 'location') as unknown as IContact[];
		render(<HeaderSection profile={mockProfile} contact={contactWithoutLocation} />);
		expect(screen.queryByText('Jakarta, Indonesia')).not.toBeInTheDocument();
	});

	it('should render links for email, linkedin, and github', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		const links = screen.getAllByTestId('pdf-link');
		expect(links).toHaveLength(3);
	});

	it('should not render non-resume links', () => {
		const contactWithExtraLinks = [
			...mockContact,
			{ type: 'twitter', label: 'Twitter', url: 'https://twitter.com/johndoe' },
		] as unknown as IContact[];
		render(<HeaderSection profile={mockProfile} contact={contactWithExtraLinks} />);
		expect(screen.queryByText('twitter.com/johndoe')).not.toBeInTheDocument();
	});
});
