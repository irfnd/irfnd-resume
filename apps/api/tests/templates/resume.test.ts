import { describe, expect, it } from 'vitest';
import { generateResumeHTML } from '@/templates/resume';
import type { ResumeData } from '@/templates/resume';

const mockData: ResumeData = {
	name: 'Test User',
	role: 'Developer',
	email: 'test@example.com',
	location: 'Test City',
	linkedin: 'linkedin.com/test',
	github: 'github.com/test',
	summary: 'A test summary',
	experience: [
		{
			company: 'Test Corp',
			position: 'Senior Dev',
			duration: '2020 - Present',
			location: 'Remote',
			points: ['Built stuff', 'Fixed things'],
		},
	],
	education: [
		{
			institution: 'Test University',
			degree: 'BS Computer Science',
			duration: '2016 - 2020',
			location: 'Test City',
		},
	],
	skills: ['TypeScript', 'React'],
};

describe('generateResumeHTML', () => {
	it('generates valid HTML with all sections', () => {
		const html = generateResumeHTML(mockData);
		expect(html).toContain('<!DOCTYPE html>');
		expect(html).toContain('Test User');
		expect(html).toContain('Developer');
		expect(html).toContain('test@example.com');
		expect(html).toContain('Test Corp');
		expect(html).toContain('Senior Dev');
		expect(html).toContain('Built stuff');
		expect(html).toContain('BS Computer Science');
		expect(html).toContain('TypeScript');
	});

	it('includes summary when provided', () => {
		const html = generateResumeHTML(mockData);
		expect(html).toContain('A test summary');
		expect(html).toContain('Summary');
	});

	it('omits summary section when empty', () => {
		const data = { ...mockData, summary: '' };
		const html = generateResumeHTML(data);
		expect(html).not.toContain('<h2>Summary</h2>');
	});
});
