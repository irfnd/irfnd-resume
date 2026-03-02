import { ProfessionalJurney } from '@/components/page/home/professional-jurney';
import { I18nProvider, ThemeProvider } from '@/components/providers';
import * as hooks from '@/hooks';
import { en } from '@/i18n';
import type { Translations } from '@/types';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

function Wrapper({ children }: { children: ReactNode }) {
	return (
		<I18nProvider defaultLang='en'>
			<ThemeProvider defaultTheme='dark'>{children}</ThemeProvider>
		</I18nProvider>
	);
}

describe('ProfessionalJurney', () => {
	it('should render section title', () => {
		render(<ProfessionalJurney />, { wrapper: Wrapper });
		expect(screen.getByText(en.experience.title)).toBeInTheDocument();
	});

	it('should render all jobs', () => {
		render(<ProfessionalJurney />, { wrapper: Wrapper });
		en.experience.jobs.forEach((job) => {
			expect(screen.getByText(job.mainPosition)).toBeInTheDocument();
		});
	});

	it('should render company names', () => {
		render(<ProfessionalJurney />, { wrapper: Wrapper });
		en.experience.jobs.forEach((job) => {
			expect(screen.getByText(job.company)).toBeInTheDocument();
		});
	});

	it('should render job durations', () => {
		render(<ProfessionalJurney />, { wrapper: Wrapper });
		en.experience.jobs.forEach((job) => {
			expect(screen.getByText(job.duration.join(' - '))).toBeInTheDocument();
		});
	});

	it('should render tech stacks for jobs with stacks', () => {
		render(<ProfessionalJurney />, { wrapper: Wrapper });
		const jobWithStacks = en.experience.jobs.find((job) => job.descriptions.some((desc) => desc.stacks.length > 0));
		if (jobWithStacks) {
			const stacks = jobWithStacks.descriptions.flatMap((desc) => desc.stacks);
			if (stacks.length > 0) {
				expect(screen.getByRole('link', { name: stacks[0].label })).toBeInTheDocument();
			}
		}
	});

	it('should render job description without icon when icon is undefined', () => {
		const mockTranslations = {
			...en,
			experience: {
				...en.experience,
				jobs: [
					{
						company: 'Test Company',
						mainPosition: 'Test Position',
						type: 'Full-time',
						location: 'Test Location',
						duration: ['Jan 2020', 'Dec 2023'],
						link: 'https://test.com',
						descriptions: [
							{
								position: 'First Role',
								icon: undefined,
								summary: [{ value: 'Did some testing work', keywords: ['testing'] }],
								points: [],
								stacks: [],
							},
							{
								position: 'Second Role',
								icon: undefined,
								summary: [{ value: 'Did more work', keywords: ['work'] }],
								points: [],
								stacks: [],
							},
						],
					},
				],
			},
		} as Translations;

		vi.spyOn(hooks, 'useTranslation').mockReturnValue(mockTranslations);

		render(<ProfessionalJurney />, { wrapper: Wrapper });

		expect(screen.getByText('First Role')).toBeInTheDocument();
		expect(screen.getByText('Second Role')).toBeInTheDocument();

		vi.restoreAllMocks();
	});
});
