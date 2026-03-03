import { TooltipBubble } from '@/components/ui/tooltip-bubble';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('TooltipBubble', () => {
	it('should render trigger element', () => {
		render(
			<TooltipBubble label='Tooltip text'>
				<button>Hover me</button>
			</TooltipBubble>,
		);
		expect(screen.getByText('Hover me')).toBeInTheDocument();
	});

	it('should accept different side positions', () => {
		const sides = ['top', 'bottom', 'left', 'right'] as const;

		sides.forEach((side) => {
			const { unmount } = render(
				<TooltipBubble label='Tooltip' side={side}>
					<button>Trigger</button>
				</TooltipBubble>,
			);
			expect(screen.getByText('Trigger')).toBeInTheDocument();
			unmount();
		});
	});

	it('should accept disabled state', () => {
		render(
			<TooltipBubble label='Tooltip' disabled>
				<button>Trigger</button>
			</TooltipBubble>,
		);
		expect(screen.getByText('Trigger')).toBeInTheDocument();
	});

	it('should render ReactNode as label', () => {
		render(
			<TooltipBubble label={<span data-testid='custom-label'>Custom Label</span>}>
				<button>Trigger</button>
			</TooltipBubble>,
		);
		expect(screen.getByText('Trigger')).toBeInTheDocument();
	});
});
