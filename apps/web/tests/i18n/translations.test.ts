import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const dataDir = join(import.meta.dirname, '../../src/content/data');

function loadJson(name: string) {
	return JSON.parse(readFileSync(join(dataDir, `${name}.json`), 'utf-8'));
}

describe('content collection JSON structure parity', () => {
	const i18nFiles = [
		'navigation',
		'contact',
		'profile',
		'about',
		'experience',
		'technology',
		'portfolio',
		'education',
		'contact-form',
		'ui',
	];

	for (const name of i18nFiles) {
		it(`${name}.json has both en and id keys`, () => {
			const data = loadJson(name);
			expect(data).toHaveProperty('en');
			expect(data).toHaveProperty('id');
		});
	}

	it('navigation arrays have same length', () => {
		const data = loadJson('navigation');
		expect(data.en.items).toHaveLength(data.id.items.length);
	});

	it('contact arrays have same length', () => {
		const data = loadJson('contact');
		expect(data.en.items).toHaveLength(data.id.items.length);
	});

	it('navigation URLs match between en and id', () => {
		const data = loadJson('navigation');
		const enUrls = data.en.items.map((n: { url: string }) => n.url);
		const idUrls = data.id.items.map((n: { url: string }) => n.url);
		expect(enUrls).toEqual(idUrls);
	});

	it('contact items share same urls and icons', () => {
		const data = loadJson('contact');
		const enMeta = data.en.items.map((c: { url: string; icon: string; type: string }) => ({
			url: c.url,
			icon: c.icon,
			type: c.type,
		}));
		const idMeta = data.id.items.map((c: { url: string; icon: string; type: string }) => ({
			url: c.url,
			icon: c.icon,
			type: c.type,
		}));
		expect(enMeta).toEqual(idMeta);
	});

	it('experience jobs array has same length', () => {
		const data = loadJson('experience');
		expect(data.en.jobs).toHaveLength(data.id.jobs.length);
	});

	it('portfolio projects array has same length', () => {
		const data = loadJson('portfolio');
		expect(data.en.projects).toHaveLength(data.id.projects.length);
	});

	it('education array has same length', () => {
		const data = loadJson('education');
		expect(data.en.educations).toHaveLength(data.id.educations.length);
	});

	it('contactMe form fields have same length', () => {
		const data = loadJson('contact-form');
		expect(data.en.form).toHaveLength(data.id.form.length);
	});

	it('common portfolioCategories have same length', () => {
		const data = loadJson('ui');
		expect(data.en.common.portfolioCategories).toHaveLength(data.id.common.portfolioCategories.length);
	});
});

describe('content collection content sanity', () => {
	function checkContent(langKey: 'en' | 'id', label: string) {
		it(`${label}: profile has required fields`, () => {
			const profile = loadJson('profile')[langKey];
			expect(profile.firstName).toBeTruthy();
			expect(profile.lastName).toBeTruthy();
			expect(profile.role).toBeTruthy();
		});

		it(`${label}: about has description and focus`, () => {
			const about = loadJson('about')[langKey];
			expect(about.description.length).toBeGreaterThan(0);
			expect(about.focus.length).toBeGreaterThan(0);
		});

		it(`${label}: contactMe has all error keys`, () => {
			const contactMe = loadJson('contact-form')[langKey];
			expect(contactMe.errors).toHaveProperty('rateLimited');
			expect(contactMe.errors).toHaveProperty('networkError');
			expect(contactMe.errors).toHaveProperty('serverError');
			expect(contactMe.errors).toHaveProperty('validationError');
		});

		it(`${label}: technology stacks is non-empty`, () => {
			const technology = loadJson('technology')[langKey];
			expect(Object.keys(technology.stacks).length).toBeGreaterThan(0);
		});
	}

	checkContent('en', 'en');
	checkContent('id', 'id');
});

describe('tech-stacks.json', () => {
	it('has an "all" entry with stacks array', () => {
		const data = loadJson('tech-stacks');
		expect(data).toHaveProperty('all');
		expect(data.all.stacks).toBeInstanceOf(Array);
		expect(data.all.stacks.length).toBeGreaterThanOrEqual(29);
	});

	it('each stack has required properties', () => {
		const { stacks } = loadJson('tech-stacks').all;
		for (const stack of stacks) {
			expect(stack).toHaveProperty('label');
			expect(stack).toHaveProperty('url');
			expect(stack).toHaveProperty('icon');
		}
	});

	it('stack labels are unique', () => {
		const { stacks } = loadJson('tech-stacks').all;
		const labels = stacks.map((s: { label: string }) => s.label);
		expect(new Set(labels).size).toBe(labels.length);
	});
});
