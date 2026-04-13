import { describe, expect, it } from 'vitest';
import { generateResumeHTML } from '@/templates/resume';
import type { ResumeData } from '@/templates/resume';

const mockData: ResumeData = {
	name: 'Test User',
	contacts: ['Test City', 'test@example.com', 'linkedin.com/in/test', 'github.com/test', 'test.dev'],
	experience: [
		{
			company: 'Test Corp',
			companyUrl: 'https://testcorp.com',
			positions: [
				{
					title: 'Senior Dev',
					duration: 'Jan 2023 - Present',
					location: 'Remote',
					points: ['Built microservices', 'Led team of 5'],
				},
				{
					title: 'Junior Dev',
					duration: 'Jan 2020 - Dec 2022',
					location: 'On-site',
					points: ['Developed APIs'],
				},
			],
		},
		{
			company: 'Startup Inc',
			companyUrl: null,
			positions: [
				{
					title: 'Fullstack Dev',
					duration: 'Jun 2019 - Dec 2019',
					location: 'Remote',
					points: ['Built web app'],
				},
			],
		},
	],
	education: [
		{
			institution: 'Test University',
			institutionUrl: 'https://testuni.edu',
			degree: "Bachelor's — Computer Science",
			duration: '2015 - 2019',
			location: 'Test City',
			points: ['GPA: 3.9/4.0'],
		},
		{
			institution: 'Community College',
			institutionUrl: null,
			degree: 'Associate — IT',
			duration: '2013 - 2015',
			location: 'Test Town',
			points: [],
		},
	],
	skills: {
		Languages: ['JavaScript', 'TypeScript'],
		'Frameworks & UI': ['React', 'Next.js'],
	},
	portfolios: [
		{
			name: 'Cool Project',
			description: 'A project that does cool things with modern tech.',
			technologies: ['React', 'TypeScript'],
			demo: 'https://cool.dev',
			source: 'https://github.com/test/cool',
		},
		{
			name: 'Private Project',
			description: 'An internal enterprise tool.',
			technologies: ['Vue.js'],
			demo: null,
			source: null,
		},
	],
};

describe('generateResumeHTML', () => {
	it('generates valid HTML document', () => {
		const html = generateResumeHTML(mockData);
		expect(html).toContain('<!DOCTYPE html>');
		expect(html).toContain('</html>');
	});

	it('renders name and contacts', () => {
		const html = generateResumeHTML(mockData);
		expect(html).toContain('Test User');
		expect(html).toContain('test@example.com');
		expect(html).toContain('linkedin.com/in/test');
		expect(html).toContain('test.dev');
	});

	it('uses serif font family', () => {
		const html = generateResumeHTML(mockData);
		expect(html).toContain('Times New Roman');
	});

	it('renders experience with company and positions', () => {
		const html = generateResumeHTML(mockData);
		expect(html).toContain('Test Corp');
		expect(html).toContain('Senior Dev');
		expect(html).toContain('Junior Dev');
		expect(html).toContain('Built microservices');
		expect(html).toContain('Startup Inc');
		expect(html).toContain('Fullstack Dev');
	});

	it('renders company as link when URL provided', () => {
		const html = generateResumeHTML(mockData);
		expect(html).toContain('href="https://testcorp.com"');
		expect(html).not.toContain('href="null"');
	});

	it('renders education with points', () => {
		const html = generateResumeHTML(mockData);
		expect(html).toContain('Test University');
		expect(html).toContain("Bachelor&#039;s — Computer Science");
		expect(html).toContain('GPA: 3.9/4.0');
	});

	it('renders skills by category', () => {
		const html = generateResumeHTML(mockData);
		expect(html).toContain('Languages');
		expect(html).toContain('JavaScript, TypeScript');
		expect(html).toContain('Frameworks &amp; UI');
		expect(html).toContain('React, Next.js');
	});

	it('renders portfolio section', () => {
		const html = generateResumeHTML(mockData);
		expect(html).toContain('Cool Project');
		expect(html).toContain('A project that does cool things');
		expect(html).toContain('React, TypeScript');
	});

	it('renders demo and source links when available', () => {
		const html = generateResumeHTML(mockData);
		expect(html).toContain('href="https://cool.dev"');
		expect(html).toContain('href="https://github.com/test/cool"');
	});

	it('omits links for projects without demo/source', () => {
		const html = generateResumeHTML(mockData);
		const privateStart = html.indexOf('Private Project');
		const projectStart = html.lastIndexOf('<div class="project">', privateStart);
		const projectEnd = html.indexOf('<div class="project">', privateStart + 1);
		const section = html.slice(projectStart, projectEnd === -1 ? undefined : projectEnd);
		expect(section).not.toContain('project-link');
	});

	it('does not contain summary section', () => {
		const html = generateResumeHTML(mockData);
		expect(html).not.toContain('>Summary<');
	});

	it('renders section headers in uppercase via CSS', () => {
		const html = generateResumeHTML(mockData);
		expect(html).toContain('text-transform: uppercase');
		expect(html).toContain('Work Experience');
		expect(html).toContain('Education');
		expect(html).toContain('Skills');
		expect(html).toContain('Portfolio');
	});

	it('escapes HTML in user-provided data', () => {
		const xssData: ResumeData = {
			...mockData,
			name: '<script>alert("xss")</script>',
			experience: [
				{
					company: '"><img src=x onerror=alert(1)>',
					companyUrl: null,
					positions: [{ title: 'Dev', duration: '2024', location: 'Remote', points: [] }],
				},
			],
		};
		const html = generateResumeHTML(xssData);
		expect(html).not.toContain('<script>');
		expect(html).toContain('&lt;script&gt;');
		expect(html).not.toContain('<img');
		expect(html).toContain('&lt;img');
	});

	it('renders education without URL as plain text', () => {
		const html = generateResumeHTML(mockData);
		expect(html).toContain('href="https://testuni.edu"');
		expect(html).toContain('Community College');
		const ccSection = html.slice(html.indexOf('Community College'));
		expect(ccSection.slice(0, 50)).not.toContain('href=');
	});
});
