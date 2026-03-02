import { HighlightText } from '@/components/ui/highlight-text';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('HighlightText', () => {
	it('should render text with highlighted keywords', () => {
		render(<HighlightText text='Hello {0} World' keywords={['Beautiful']} />);
		expect(screen.getByText('Beautiful')).toBeInTheDocument();
	});

	it('should apply default span element', () => {
		render(<HighlightText text='Hello {0}' keywords={['Test']} />);
		const keyword = screen.getByText('Test');
		expect(keyword.tagName).toBe('SPAN');
	});

	it('should use custom element when specified', () => {
		render(<HighlightText text='Hello {0}' keywords={['Test']} as='strong' />);
		const keyword = screen.getByText('Test');
		expect(keyword.tagName).toBe('STRONG');
	});

	it('should apply custom className to keywords', () => {
		render(<HighlightText text='Hello {0}' keywords={['Test']} className='custom-class' />);
		const keyword = screen.getByText('Test');
		expect(keyword).toHaveClass('custom-class');
	});

	it('should render multiple keywords', () => {
		render(<HighlightText text='{0} and {1}' keywords={['First', 'Second']} />);
		expect(screen.getByText('First')).toBeInTheDocument();
		expect(screen.getByText('Second')).toBeInTheDocument();
	});

	it('should preserve non-keyword text', () => {
		const { container } = render(<HighlightText text='Before {0} After' keywords={['Middle']} />);
		expect(container.textContent).toContain('Before');
		expect(container.textContent).toContain('Middle');
		expect(container.textContent).toContain('After');
	});
});
