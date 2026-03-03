import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from '@/components/ui/motion-wrapper';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('FadeIn', () => {
	it('should render children', () => {
		render(
			<FadeIn>
				<span>Test Content</span>
			</FadeIn>,
		);
		expect(screen.getByText('Test Content')).toBeInTheDocument();
	});

	it('should render as div by default', () => {
		render(
			<FadeIn data-testid='fade-in'>
				<span>Content</span>
			</FadeIn>,
		);
		expect(screen.getByTestId('fade-in').tagName).toBe('DIV');
	});

	it('should render as custom element', () => {
		render(
			<FadeIn as='section' data-testid='fade-in'>
				<span>Content</span>
			</FadeIn>,
		);
		expect(screen.getByTestId('fade-in').tagName).toBe('SECTION');
	});

	it('should apply className', () => {
		render(
			<FadeIn className='test-class' data-testid='fade-in'>
				<span>Content</span>
			</FadeIn>,
		);
		expect(screen.getByTestId('fade-in')).toHaveClass('test-class');
	});

	it('should accept custom delay and duration', () => {
		render(
			<FadeIn delay={0.5} duration={1} data-testid='fade-in'>
				<span>Content</span>
			</FadeIn>,
		);
		expect(screen.getByTestId('fade-in')).toBeInTheDocument();
	});

	it('should accept viewportOnce and threshold props', () => {
		render(
			<FadeIn viewportOnce={false} threshold={0.5} data-testid='fade-in'>
				<span>Content</span>
			</FadeIn>,
		);
		expect(screen.getByTestId('fade-in')).toBeInTheDocument();
	});
});

describe('SlideUp', () => {
	it('should render children', () => {
		render(
			<SlideUp>
				<span>Test Content</span>
			</SlideUp>,
		);
		expect(screen.getByText('Test Content')).toBeInTheDocument();
	});

	it('should render as div by default', () => {
		render(
			<SlideUp data-testid='slide-up'>
				<span>Content</span>
			</SlideUp>,
		);
		expect(screen.getByTestId('slide-up').tagName).toBe('DIV');
	});

	it('should render as custom element', () => {
		render(
			<SlideUp as='article' data-testid='slide-up'>
				<span>Content</span>
			</SlideUp>,
		);
		expect(screen.getByTestId('slide-up').tagName).toBe('ARTICLE');
	});

	it('should apply className', () => {
		render(
			<SlideUp className='test-class' data-testid='slide-up'>
				<span>Content</span>
			</SlideUp>,
		);
		expect(screen.getByTestId('slide-up')).toHaveClass('test-class');
	});

	it('should accept all motion wrapper props', () => {
		render(
			<SlideUp delay={0.2} duration={0.8} viewportOnce={true} threshold={0.1} data-testid='slide-up'>
				<span>Content</span>
			</SlideUp>,
		);
		expect(screen.getByTestId('slide-up')).toBeInTheDocument();
	});
});

describe('StaggerContainer', () => {
	it('should render children', () => {
		render(
			<StaggerContainer>
				<div>Child 1</div>
				<div>Child 2</div>
			</StaggerContainer>,
		);
		expect(screen.getByText('Child 1')).toBeInTheDocument();
		expect(screen.getByText('Child 2')).toBeInTheDocument();
	});

	it('should render as div by default', () => {
		render(
			<StaggerContainer data-testid='stagger'>
				<div>Content</div>
			</StaggerContainer>,
		);
		expect(screen.getByTestId('stagger').tagName).toBe('DIV');
	});

	it('should render as custom element', () => {
		render(
			<StaggerContainer as='nav' data-testid='stagger'>
				<div>Content</div>
			</StaggerContainer>,
		);
		expect(screen.getByTestId('stagger').tagName).toBe('NAV');
	});

	it('should apply className', () => {
		render(
			<StaggerContainer className='test-class' data-testid='stagger'>
				<div>Content</div>
			</StaggerContainer>,
		);
		expect(screen.getByTestId('stagger')).toHaveClass('test-class');
	});

	it('should accept staggerDelay prop', () => {
		render(
			<StaggerContainer staggerDelay={0.2} data-testid='stagger'>
				<div>Content</div>
			</StaggerContainer>,
		);
		expect(screen.getByTestId('stagger')).toBeInTheDocument();
	});
});

describe('StaggerItem', () => {
	it('should render children', () => {
		render(
			<StaggerItem>
				<span>Item Content</span>
			</StaggerItem>,
		);
		expect(screen.getByText('Item Content')).toBeInTheDocument();
	});

	it('should apply className', () => {
		render(
			<StaggerItem className='test-class' data-testid='item'>
				<span>Content</span>
			</StaggerItem>,
		);
		expect(screen.getByTestId('item')).toHaveClass('test-class');
	});

	it('should render as motion.div', () => {
		render(
			<StaggerItem data-testid='item'>
				<span>Content</span>
			</StaggerItem>,
		);
		expect(screen.getByTestId('item').tagName).toBe('DIV');
	});
});
