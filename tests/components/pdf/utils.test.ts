import { resolveText } from '@/components/pdf/utils';
import { describe, expect, it } from 'vitest';

describe('resolveText utility', () => {
	it('should resolve single placeholder', () => {
		const result = resolveText({ value: '{0} World', keywords: ['Hello'] });
		expect(result).toBe('Hello World');
	});

	it('should resolve multiple placeholders', () => {
		const result = resolveText({ value: '{0} World from {1}', keywords: ['Hello', 'TypeScript'] });
		expect(result).toBe('Hello World from TypeScript');
	});

	it('should resolve repeated placeholders', () => {
		const result = resolveText({ value: '{0} is great. I love {0}!', keywords: ['React'] });
		expect(result).toBe('React is great. I love React!');
	});

	it('should handle empty keywords array', () => {
		const result = resolveText({ value: 'Hello World', keywords: [] });
		expect(result).toBe('Hello World');
	});

	it('should handle text without placeholders', () => {
		const result = resolveText({ value: 'Hello World', keywords: ['foo', 'bar'] });
		expect(result).toBe('Hello World');
	});

	it('should handle multiple keywords with mixed placeholders', () => {
		const result = resolveText({
			value: 'I work with {0}, {1}, and {2}',
			keywords: ['React', 'TypeScript', 'Node.js'],
		});
		expect(result).toBe('I work with React, TypeScript, and Node.js');
	});

	it('should handle keywords with special characters', () => {
		const result = resolveText({ value: 'Use {0} for styling', keywords: ['Tailwind CSS'] });
		expect(result).toBe('Use Tailwind CSS for styling');
	});

	it('should handle complex paragraph structure', () => {
		const result = resolveText({
			value: 'Built a {0} application using {1} and {2} with {3} for state management',
			keywords: ['web', 'React', 'TypeScript', 'Redux'],
		});
		expect(result).toBe('Built a web application using React and TypeScript with Redux for state management');
	});

	it('should preserve text when no matching placeholders exist', () => {
		const result = resolveText({
			value: 'No placeholders here',
			keywords: ['keyword1', 'keyword2'],
		});
		expect(result).toBe('No placeholders here');
	});
});
