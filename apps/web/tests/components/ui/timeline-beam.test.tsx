import { TimelineBadge, TimelineBeam, TimelineDot, TimelineItem } from '@/components/ui/timeline-beam';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('TimelineBeam', () => {
	it('should render children', () => {
		render(
			<TimelineBeam>
				<div>Timeline Content</div>
			</TimelineBeam>,
		);
		expect(screen.getByText('Timeline Content')).toBeInTheDocument();
	});

	it('should apply className', () => {
		render(
			<TimelineBeam className='custom-class' data-testid='timeline'>
				<div>Content</div>
			</TimelineBeam>,
		);
		expect(screen.getByTestId('timeline')).toHaveClass('custom-class');
	});

	it('should have border-l class for timeline line', () => {
		render(
			<TimelineBeam data-testid='timeline'>
				<div>Content</div>
			</TimelineBeam>,
		);
		expect(screen.getByTestId('timeline')).toHaveClass('border-l');
	});
});

describe('TimelineItem', () => {
	it('should render children', () => {
		render(
			<TimelineItem>
				<div>Item Content</div>
			</TimelineItem>,
		);
		expect(screen.getByText('Item Content')).toBeInTheDocument();
	});

	it('should apply className', () => {
		render(
			<TimelineItem className='custom-class' data-testid='item'>
				<div>Content</div>
			</TimelineItem>,
		);
		expect(screen.getByTestId('item')).toHaveClass('custom-class');
	});

	it('should have group class for hover states', () => {
		render(
			<TimelineItem data-testid='item'>
				<div>Content</div>
			</TimelineItem>,
		);
		expect(screen.getByTestId('item')).toHaveClass('group');
	});
});

describe('TimelineDot', () => {
	it('should render', () => {
		const { container } = render(<TimelineDot />);
		expect(container.firstChild).toBeInTheDocument();
	});

	it('should have rounded-full class', () => {
		const { container } = render(<TimelineDot />);
		expect(container.firstChild).toHaveClass('rounded-full');
	});
});

describe('TimelineBadge', () => {
	it('should render children', () => {
		render(<TimelineBadge>2024</TimelineBadge>);
		expect(screen.getByText('2024')).toBeInTheDocument();
	});

	it('should have badge styling classes', () => {
		render(<TimelineBadge>Badge Text</TimelineBadge>);
		const badge = screen.getByText('Badge Text');
		expect(badge).toHaveClass('text-xs');
		expect(badge).toHaveClass('font-mono');
		expect(badge).toHaveClass('rounded-md');
	});
});
