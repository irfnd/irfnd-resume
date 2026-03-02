import { getTechStack } from '@/contents/tech-stack-list';
import { describe, expect, it } from 'vitest';

describe('getTechStack', () => {
	it('should return tech stack items for given labels', () => {
		const result = getTechStack(['React', 'TypeScript']);
		expect(result).toHaveLength(2);
		expect(result.map((t) => t.label)).toEqual(['TypeScript', 'React']);
	});

	it('should return correct properties for each tech stack item', () => {
		const result = getTechStack(['React']);
		expect(result).toHaveLength(1);
		expect(result[0]).toHaveProperty('label', 'React');
		expect(result[0]).toHaveProperty('url');
		expect(result[0]).toHaveProperty('icon');
		expect(result[0]).toHaveProperty('color');
	});

	it('should return empty array for empty input', () => {
		const result = getTechStack([]);
		expect(result).toHaveLength(0);
	});

	it('should filter out non-matching labels', () => {
		const result = getTechStack(['React', 'NonExistent' as 'React']);
		expect(result).toHaveLength(1);
		expect(result[0].label).toBe('React');
	});

	it('should return multiple tech stacks in order from the list', () => {
		const result = getTechStack(['Docker', 'PostgreSQL', 'Redis']);
		expect(result).toHaveLength(3);
		const labels = result.map((t) => t.label);
		expect(labels).toContain('Docker');
		expect(labels).toContain('PostgreSQL');
		expect(labels).toContain('Redis');
	});

	it('should handle tech stacks with customColor property', () => {
		const result = getTechStack(['Next.js']);
		expect(result).toHaveLength(1);
		expect(result[0]).toHaveProperty('customColor', true);
		expect(result[0]).toHaveProperty('border');
	});

	it('should handle all available tech stack labels', () => {
		const allLabels = [
			'JavaScript',
			'TypeScript',
			'Python',
			'Go',
			'Alpine.js',
			'React',
			'Vue.js',
			'Next.js',
			'Express.js',
			'NestJS',
			'Flask',
			'Django',
			'Tailwind CSS',
			'Shadcn UI',
			'Ant Design',
			'Material UI',
			'Chakra UI',
			'PostgreSQL',
			'MongoDB',
			'Redis',
			'Firebase',
			'Supabase',
			'GraphQL',
			'Docker',
			'Linux',
			'Swagger',
			'Redux',
			'Turborepo',
			'Mapbox',
			'Framer Motion',
		] as const;

		const result = getTechStack([...allLabels]);
		expect(result).toHaveLength(allLabels.length);
	});

	it('should maintain correct URLs for tech stacks', () => {
		const result = getTechStack(['React', 'TypeScript']);
		const react = result.find((t) => t.label === 'React');
		const typescript = result.find((t) => t.label === 'TypeScript');

		expect(react?.url).toBe('https://reactjs.org/');
		expect(typescript?.url).toBe('https://www.typescriptlang.org/');
	});
});
