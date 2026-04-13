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
	styles: { text: {}, bold: {}, italic: {}, link: {} },
}));

import { render, screen } from '@testing-library/react';
import type { ContactData, ProfileData } from '@irfnd/data';

import { HeaderSection } from '@/templates/pdf/sections/header';

describe('HeaderSection', () => {
	const mockProfile: ProfileData = {
		firstName: 'John',
		lastName: 'Doe',
		role: 'Software Engineer',
		photo: { url: '', alt: '' },
		description: '',
	};

	const mockContact: ContactData = {
		items: [
			{ type: 'location', label: 'Jakarta, Indonesia', url: 'https://maps.example.com', icon: 'tabler:map-pin', showInResume: true },
			{ type: 'contact', label: 'irfandi@example.com', url: 'mailto:irfandi@example.com', icon: 'tabler:mail', showInResume: true },
			{ type: 'contact', label: 'LinkedIn', url: 'https://www.linkedin.com/in/johndoe', icon: 'tabler:brand-linkedin', showInResume: true },
			{ type: 'contact', label: 'GitHub', url: 'https://github.com/johndoe', icon: 'tabler:brand-github', showInResume: true },
			{ type: 'contact', label: 'Whatsapp', url: 'https://wa.me/123456', icon: 'tabler:brand-whatsapp', showInContactPage: true },
		],
	};

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
		expect(screen.getByText('irfandi@example.com')).toBeInTheDocument();
	});

	it('should format LinkedIn URLs correctly', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		expect(screen.getByText('linkedin.com/in/johndoe')).toBeInTheDocument();
	});

	it('should format GitHub URLs correctly', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		expect(screen.getByText('github.com/johndoe')).toBeInTheDocument();
	});

	it('should only render items with showInResume', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		expect(screen.queryByText(/wa\.me/)).not.toBeInTheDocument();
	});

	it('should render links for non-location resume contacts', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		const links = screen.getAllByTestId('pdf-link');
		expect(links).toHaveLength(3);
	});

	it('should render without location when none has showInResume', () => {
		const noLocation: ContactData = {
			items: mockContact.items.filter((c) => c.type !== 'location'),
		};
		render(<HeaderSection profile={mockProfile} contact={noLocation} />);
		expect(screen.queryByText('Jakarta, Indonesia')).not.toBeInTheDocument();
	});

	it('should render pipe separators between contact items', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		const pipes = screen.getAllByText('|');
		expect(pipes).toHaveLength(3);
	});
});
