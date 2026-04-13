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
		'about',
		'portfolio',
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

	it('navigation URLs match between en and id', () => {
		const data = loadJson('navigation');
		const enUrls = data.en.items.map((n: { url: string }) => n.url);
		const idUrls = data.id.items.map((n: { url: string }) => n.url);
		expect(enUrls).toEqual(idUrls);
	});



	it('portfolio projects array has same length', () => {
		const data = loadJson('portfolio');
		expect(data.en.projects).toHaveLength(data.id.projects.length);
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


	}

	checkContent('en', 'en');
	checkContent('id', 'id');
});


