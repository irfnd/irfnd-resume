import { I18nProvider, ThemeProvider } from '@/components/providers';
import { ProjectDialog } from '@/components/ui/project-dialog';
import { en } from '@/i18n';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

function Wrapper({ children }: { children: ReactNode }) {
	return (
		<I18nProvider defaultLang='en'>
			<ThemeProvider defaultTheme='dark'>{children}</ThemeProvider>
		</I18nProvider>
	);
}

describe('ProjectDialog', () => {
	const publicProject = en.portfolio.projects.find((p) => p.type === 'public')!;
	const privateProject = en.portfolio.projects.find((p) => p.type === 'private')!;
	const projectWithImages = en.portfolio.projects.find((p) => p.image.length > 1)!;

	it('should render when open is true', () => {
		render(<ProjectDialog open={true} onOpenChange={() => {}} {...publicProject} />, { wrapper: Wrapper });
		expect(screen.getByText(publicProject.name)).toBeInTheDocument();
	});

	it('should not render content when open is false', () => {
		render(<ProjectDialog open={false} onOpenChange={() => {}} {...publicProject} />, { wrapper: Wrapper });
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('should show category badge', () => {
		render(<ProjectDialog open={true} onOpenChange={() => {}} {...publicProject} />, { wrapper: Wrapper });
		expect(screen.getByText(publicProject.category)).toBeInTheDocument();
	});

	it('should show internal badge for private projects', () => {
		render(<ProjectDialog open={true} onOpenChange={() => {}} {...privateProject} />, { wrapper: Wrapper });
		expect(screen.getByText(/internal/i)).toBeInTheDocument();
	});

	it('should render summary paragraphs', () => {
		render(<ProjectDialog open={true} onOpenChange={() => {}} {...publicProject} />, { wrapper: Wrapper });
		expect(screen.getByText(publicProject.summary[0].keywords[0])).toBeInTheDocument();
	});

	it('should render tech stacks', () => {
		render(<ProjectDialog open={true} onOpenChange={() => {}} {...publicProject} />, { wrapper: Wrapper });
		expect(screen.getByText('Tech Stack')).toBeInTheDocument();
	});

	it('should show source and demo links for public projects', () => {
		render(<ProjectDialog open={true} onOpenChange={() => {}} {...publicProject} />, { wrapper: Wrapper });
		if (publicProject.source) {
			expect(screen.getByRole('link', { name: /source/i })).toBeInTheDocument();
		}
		if (publicProject.demo) {
			expect(screen.getByRole('link', { name: /live demo/i })).toBeInTheDocument();
		}
	});

	it('should call onOpenChange when close button is clicked', async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();

		render(<ProjectDialog open={true} onOpenChange={onOpenChange} {...publicProject} />, { wrapper: Wrapper });

		await user.click(screen.getByRole('button', { name: /close dialog/i }));

		await waitFor(() => {
			expect(onOpenChange).toHaveBeenCalled();
		});
	});

	it('should show image navigation for projects with multiple images', () => {
		if (projectWithImages) {
			render(<ProjectDialog open={true} onOpenChange={() => {}} {...projectWithImages} />, { wrapper: Wrapper });
			expect(screen.getByRole('button', { name: /previous image/i })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /next image/i })).toBeInTheDocument();
		}
	});

	it('should navigate images with prev/next buttons', async () => {
		if (projectWithImages) {
			const user = userEvent.setup();
			render(<ProjectDialog open={true} onOpenChange={() => {}} {...projectWithImages} />, { wrapper: Wrapper });

			expect(screen.getByText(`1 / ${projectWithImages.image.length}`)).toBeInTheDocument();

			await user.click(screen.getByRole('button', { name: /next image/i }));

			await waitFor(() => {
				expect(screen.getByText(`2 / ${projectWithImages.image.length}`)).toBeInTheDocument();
			});

			await user.click(screen.getByRole('button', { name: /previous image/i }));

			await waitFor(() => {
				expect(screen.getByText(`1 / ${projectWithImages.image.length}`)).toBeInTheDocument();
			});
		}
	});

	it('should handle image load event', async () => {
		if (projectWithImages) {
			render(<ProjectDialog open={true} onOpenChange={() => {}} {...projectWithImages} />, { wrapper: Wrapper });

			const img = screen.getByRole('img');
			img.dispatchEvent(new Event('load'));

			await waitFor(() => {
				expect(img.className).toContain('opacity');
			});
		}
	});
});
