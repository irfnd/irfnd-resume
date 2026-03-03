import { setHighlightText } from '@/utils/text';
import { describe, expect, it } from 'vitest';

describe('setHighlightText utility', () => {
	it('should replace keywords with placeholders', () => {
		const result = setHighlightText('Hello World', ['Hello']);
		expect(result.value).toBe('{0} World');
		expect(result.keywords).toEqual(['Hello']);
	});

	it('should replace multiple keywords', () => {
		const result = setHighlightText('Hello World from TypeScript', ['Hello', 'TypeScript']);
		expect(result.value).toBe('{0} World from {1}');
		expect(result.keywords).toEqual(['Hello', 'TypeScript']);
	});

	it('should replace all occurrences of a keyword', () => {
		const result = setHighlightText('React is great. I love React!', ['React']);
		expect(result.value).toBe('{0} is great. I love {0}!');
		expect(result.keywords).toEqual(['React']);
	});

	it('should handle keywords with special regex characters', () => {
		const result = setHighlightText('Use C++ and C# for programming', ['C++', 'C#']);
		expect(result.value).toBe('Use {0} and {1} for programming');
		expect(result.keywords).toEqual(['C++', 'C#']);
	});

	it('should handle empty keywords array', () => {
		const result = setHighlightText('Hello World', []);
		expect(result.value).toBe('Hello World');
		expect(result.keywords).toEqual([]);
	});

	it('should handle text without matching keywords', () => {
		const result = setHighlightText('Hello World', ['foo', 'bar']);
		expect(result.value).toBe('Hello World');
		expect(result.keywords).toEqual(['foo', 'bar']);
	});

	it('should handle special regex characters in keywords', () => {
		const result = setHighlightText('Price is $100 (including tax)', ['$100', '(including tax)']);
		expect(result.value).toBe('Price is {0} {1}');
		expect(result.keywords).toEqual(['$100', '(including tax)']);
	});

	it('should handle keywords with brackets and pipes', () => {
		const result = setHighlightText('Test [array] and |pipe|', ['[array]', '|pipe|']);
		expect(result.value).toBe('Test {0} and {1}');
		expect(result.keywords).toEqual(['[array]', '|pipe|']);
	});

	it('should handle keywords with backslashes', () => {
		const result = setHighlightText('Path is C:\\Users\\test', ['C:\\Users\\test']);
		expect(result.value).toBe('Path is {0}');
		expect(result.keywords).toEqual(['C:\\Users\\test']);
	});

	it('should preserve keyword order in result', () => {
		const result = setHighlightText('A B C', ['C', 'A', 'B']);
		expect(result.value).toBe('{1} {2} {0}');
		expect(result.keywords).toEqual(['C', 'A', 'B']);
	});
});
