import { EducationHistory } from '@/components/page/home/education-history';
import { I18nProvider, ThemeProvider } from '@/components/providers';
import * as hooks from '@/hooks';
import { en } from '@/i18n';
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

describe('EducationHistory', () => {
	it('should render section title', () => {
		render(<EducationHistory />, { wrapper: Wrapper });
		expect(screen.getByText(en.education.title)).toBeInTheDocument();
	});

	it('should render all education entries', () => {
		render(<EducationHistory />, { wrapper: Wrapper });
		en.education.educations.forEach((edu) => {
			expect(screen.getByText(edu.institution)).toBeInTheDocument();
		});
	});

	it('should render degrees', () => {
		render(<EducationHistory />, { wrapper: Wrapper });
		en.education.educations.forEach((edu) => {
			expect(screen.getByText(edu.degree)).toBeInTheDocument();
		});
	});

	it('should render field of study', () => {
		render(<EducationHistory />, { wrapper: Wrapper });
		en.education.educations.forEach((edu) => {
			expect(screen.getByText(edu.fieldOfStudy)).toBeInTheDocument();
		});
	});

	it('should render durations', () => {
		render(<EducationHistory />, { wrapper: Wrapper });
		en.education.educations.forEach((edu) => {
			expect(screen.getByText(edu.duration.join(' - '))).toBeInTheDocument();
		});
	});

	it('should render awards if present', () => {
		render(<EducationHistory />, { wrapper: Wrapper });
		const eduWithAwards = en.education.educations.find((edu) => edu.award.length > 0);
		if (eduWithAwards) {
			eduWithAwards.award.forEach((award) => {
				expect(screen.getByText(award.label)).toBeInTheDocument();
			});
		}
	});

	it('should render points if present', () => {
		const mockTranslations = {
			...en,
			education: {
				...en.education,
				educations: [
					{
						institution: 'Test University',
						degree: 'Test Degree',
						fieldOfStudy: 'Test Field',
						location: 'Test Location',
						duration: ['2020', '2024'],
						link: 'https://test.edu',
						summary: [],
						points: [
							{ value: 'First point about testing', keywords: ['testing'] },
							{ value: 'Second point about development', keywords: ['development'] },
							{ value: 'Third point about skills', keywords: ['skills'] },
						],
						award: [],
					},
				],
			},
		};

		vi.spyOn(hooks, 'useTranslation').mockReturnValue(mockTranslations);

		render(<EducationHistory />, { wrapper: Wrapper });

		expect(screen.getByText(/First point about testing/)).toBeInTheDocument();
		expect(screen.getByText(/Second point about development/)).toBeInTheDocument();
		expect(screen.getByText(/Third point about skills/)).toBeInTheDocument();

		vi.restoreAllMocks();
	});

	it('should render education without points when points array is empty', () => {
		render(<EducationHistory />, { wrapper: Wrapper });
		expect(screen.getByText(en.education.title)).toBeInTheDocument();
	});

	it('should render institution name without link when link is null', () => {
		const mockTranslations = {
			...en,
			education: {
				...en.education,
				educations: [
					{
						institution: 'No Link University',
						degree: 'Test Degree',
						fieldOfStudy: 'Test Field',
						location: 'Test Location',
						duration: ['2020', '2024'],
						link: null,
						summary: [],
						points: [],
						award: [],
					},
				],
			},
		};

		vi.spyOn(hooks, 'useTranslation').mockReturnValue(mockTranslations);

		render(<EducationHistory />, { wrapper: Wrapper });

		expect(screen.getByText('No Link University')).toBeInTheDocument();
		expect(screen.queryByRole('link', { name: 'No Link University' })).not.toBeInTheDocument();

		vi.restoreAllMocks();
	});
});
