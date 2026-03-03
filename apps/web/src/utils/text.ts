import type { IParagraph } from '@/types';

export function setHighlightText(text: string, keywords: string[]) {
	let result = text;

	keywords.forEach((keyword, index) => {
		const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regex = new RegExp(escapedKeyword, 'g');
		result = result.replace(regex, `{${index}}`);
	});

	return { value: result, keywords };
}

export function resolveText({ value, keywords }: IParagraph): string {
	return keywords.reduce((text, keyword, index) => text.replace(new RegExp(`\\{${index}\\}`, 'g'), keyword), value);
}
