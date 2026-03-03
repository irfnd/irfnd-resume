import { TechIcon } from '@/components/ui/tech-icon';
import { getTechStack } from '@/contents/tech-stack-list';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('TechIcon', () => {
	const reactStack = getTechStack(['React'])[0];
	const nextStack = getTechStack(['Next.js'])[0];

	it('should render with tooltip when withLabel is false', () => {
		render(<TechIcon {...reactStack} />);
		expect(screen.getByRole('link', { name: 'React' })).toBeInTheDocument();
	});

	it('should render with label when withLabel is true', () => {
		render(<TechIcon {...reactStack} withLabel />);
		expect(screen.getAllByText('React').length).toBeGreaterThan(0);
	});

	it('should have correct link attributes', () => {
		render(<TechIcon {...reactStack} />);
		const link = screen.getByRole('link', { name: 'React' });
		expect(link).toHaveAttribute('href', reactStack.url);
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('should apply custom className', () => {
		render(<TechIcon {...reactStack} className='custom-class' />);
		const link = screen.getByRole('link', { name: 'React' });
		expect(link).toHaveClass('custom-class');
	});

	it('should handle customColor tech stacks', () => {
		render(<TechIcon {...nextStack} />);
		const link = screen.getByRole('link', { name: 'Next.js' });
		expect(link).toBeInTheDocument();
		expect(link).not.toHaveStyle({ '--stack-color': expect.any(String) });
	});

	it('should set --stack-color style for non-customColor stacks', () => {
		render(<TechIcon {...reactStack} />);
		const link = screen.getByRole('link', { name: 'React' });
		expect(link).toHaveAttribute('style');
	});
});
