import { TechnicalStack } from '@/components/page/home/technical-stack';
import { I18nProvider, ThemeProvider } from '@/components/providers';
import { en } from '@/i18n';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

function Wrapper({ children }: { children: ReactNode }) {
	return (
		<I18nProvider defaultLang='en'>
			<ThemeProvider defaultTheme='dark'>{children}</ThemeProvider>
		</I18nProvider>
	);
}

describe('TechnicalStack', () => {
	it('should render section title', () => {
		render(<TechnicalStack />, { wrapper: Wrapper });
		expect(screen.getByText(en.technology.title)).toBeInTheDocument();
	});

	it('should render all stack categories', () => {
		render(<TechnicalStack />, { wrapper: Wrapper });
		const categories = Object.keys(en.technology.stacks).filter(
			(cat) => en.technology.stacks[cat as keyof typeof en.technology.stacks].length > 0,
		);
		categories.forEach((category) => {
			expect(screen.getByText(category)).toBeInTheDocument();
		});
	});

	it('should render tech icons with labels', () => {
		render(<TechnicalStack />, { wrapper: Wrapper });
		const allStacks = Object.values(en.technology.stacks).flat();
		if (allStacks.length > 0) {
			expect(screen.getByRole('link', { name: allStacks[0].label })).toBeInTheDocument();
		}
	});
});
