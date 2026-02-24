import type { IParagraph } from '@/types';

/** Restores the original text from an IParagraph by replacing {0}, {1}… placeholders with their keywords. */
export function resolveText({ value, keywords }: IParagraph): string {
	return keywords.reduce((text, keyword, index) => text.replace(new RegExp(`\\{${index}\\}`, 'g'), keyword), value);
}
