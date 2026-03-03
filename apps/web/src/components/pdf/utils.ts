import type { IParagraph } from '@/types';

export function resolveText({ value, keywords }: IParagraph): string {
	return keywords.reduce((text, keyword, index) => text.replace(new RegExp(`\\{${index}\\}`, 'g'), keyword), value);
}
