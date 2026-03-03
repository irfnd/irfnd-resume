const HTML_ESCAPE_MAP: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#039;',
};

export function escapeHtml(text: string): string {
	/* v8 ignore next -- @preserve */
	return text.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] || char);
}
