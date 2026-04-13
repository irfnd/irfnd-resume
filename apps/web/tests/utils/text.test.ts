import { describe, expect, it } from 'vitest';
import { resolveText, setHighlightText } from '@/utils/text';

describe('setHighlightText', () => {
	it('replaces keywords with indexed placeholders', () => {
		const result = setHighlightText('Hello World', ['World']);
		expect(result.value).toBe('Hello {0}');
		expect(result.keywords).toEqual(['World']);
	});

	it('handles multiple keywords', () => {
		const result = setHighlightText('foo bar baz', ['foo', 'baz']);
		expect(result.value).toBe('{0} bar {1}');
	});

	it('replaces all occurrences of a keyword', () => {
		const result = setHighlightText('go go go', ['go']);
		expect(result.value).toBe('{0} {0} {0}');
	});

	it('escapes special regex characters in keywords', () => {
		const result = setHighlightText('price is $100 (USD)', ['$100', '(USD)']);
		expect(result.value).toBe('price is {0} {1}');
	});

	it('returns original text when keywords is empty', () => {
		const result = setHighlightText('Hello World', []);
		expect(result.value).toBe('Hello World');
		expect(result.keywords).toEqual([]);
	});
});

describe('resolveText', () => {
	it('replaces placeholders with keywords', () => {
		expect(resolveText({ value: 'Hello {0}', keywords: ['World'] })).toBe('Hello World');
	});

	it('handles multiple placeholders', () => {
		expect(resolveText({ value: '{0} and {1}', keywords: ['Alpha', 'Bravo'] })).toBe('Alpha and Bravo');
	});

	it('handles repeated placeholders', () => {
		expect(resolveText({ value: '{0} or {0}', keywords: ['same'] })).toBe('same or same');
	});

	it('returns value unchanged when no keywords', () => {
		expect(resolveText({ value: 'no placeholders', keywords: [] })).toBe('no placeholders');
	});

	it('roundtrips with setHighlightText', () => {
		const original = 'Build with React and TypeScript';
		const highlighted = setHighlightText(original, ['React', 'TypeScript']);
		expect(resolveText(highlighted)).toBe(original);
	});
});
