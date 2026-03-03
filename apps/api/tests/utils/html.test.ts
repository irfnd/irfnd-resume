import { escapeHtml } from '@/utils';
import { describe, expect, it } from 'vitest';

describe('escapeHtml', () => {
	it('should escape ampersands', () => {
		expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
	});

	it('should escape less than', () => {
		expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
	});

	it('should escape greater than', () => {
		expect(escapeHtml('a > b')).toBe('a &gt; b');
	});

	it('should escape double quotes', () => {
		expect(escapeHtml('He said "hello"')).toBe('He said &quot;hello&quot;');
	});

	it('should escape single quotes', () => {
		expect(escapeHtml("It's fine")).toBe('It&#039;s fine');
	});

	it('should escape multiple characters', () => {
		expect(escapeHtml('<div class="test">Hello & Goodbye</div>')).toBe(
			'&lt;div class=&quot;test&quot;&gt;Hello &amp; Goodbye&lt;/div&gt;',
		);
	});

	it('should handle empty string', () => {
		expect(escapeHtml('')).toBe('');
	});

	it('should not modify safe strings', () => {
		expect(escapeHtml('Hello World')).toBe('Hello World');
	});
});
