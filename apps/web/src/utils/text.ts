export interface Paragraph {
	value: string;
	keywords: string[];
}

export function setHighlightText(text: string, keywords: string[]): Paragraph {
	let result = text;

	keywords.forEach((keyword, index) => {
		const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regex = new RegExp(escapedKeyword, 'g');
		result = result.replace(regex, `{${index}}`);
	});

	return { value: result, keywords };
}

export function resolveText({ value, keywords }: Paragraph): string {
	return keywords.reduce((text, keyword, index) => text.replace(new RegExp(`\\{${index}\\}`, 'g'), keyword), value);
}
