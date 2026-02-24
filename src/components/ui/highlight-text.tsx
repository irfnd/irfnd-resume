import { cn } from '@/utils/cn';
import type { ElementType } from 'react';
import { format } from 'react-string-format';

export interface HighlightTextProps {
	text: string;
	keywords: string[];
	className?: string;
	as?: ElementType;
}

export function HighlightText({ text, keywords, className, as: Component = 'span' }: HighlightTextProps) {
	return format(
		text,
		...keywords.map((keyword) => (
			<Component
				key={keyword}
				className={cn(
					'text-blue-700 dark:text-foreground font-medium bg-blue-50/80 dark:bg-transparent px-1.5 dark:px-0 h-fit rounded shadow-sm dark:shadow-none border border-blue-100 dark:border-none inline-block wrap-break-words',
					className,
				)}
			>
				{keyword}
			</Component>
		)),
	);
}
