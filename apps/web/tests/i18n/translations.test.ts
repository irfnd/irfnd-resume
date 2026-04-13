import { describe, expect, it } from 'vitest';
import { en } from '@/i18n/en';
import { id } from '@/i18n/id';
import type { Translations } from '@/types/i18n';

function getKeys(obj: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(obj).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (value && typeof value === 'object' && !Array.isArray(value)) {
			return getKeys(value as Record<string, unknown>, path);
		}
		return [path];
	});
}

describe('translation structure parity', () => {
	it('en and id have the same top-level keys', () => {
		expect(Object.keys(en).sort()).toEqual(Object.keys(id).sort());
	});

	it('en and id have the same nested key structure', () => {
		const enKeys = getKeys(en as unknown as Record<string, unknown>).sort();
		const idKeys = getKeys(id as unknown as Record<string, unknown>).sort();
		expect(enKeys).toEqual(idKeys);
	});

	it('navigation arrays have same length', () => {
		expect(en.navigation).toHaveLength(id.navigation.length);
	});

	it('contact arrays have same length', () => {
		expect(en.contact).toHaveLength(id.contact.length);
	});

	it('navigation items have consistent shape', () => {
		for (const nav of en.navigation) {
			expect(nav).toHaveProperty('label');
			expect(nav).toHaveProperty('url');
			expect(nav).toHaveProperty('icon');
		}
		for (const nav of id.navigation) {
			expect(nav).toHaveProperty('label');
			expect(nav).toHaveProperty('url');
			expect(nav).toHaveProperty('icon');
		}
	});

	it('navigation URLs match between en and id', () => {
		const enUrls = en.navigation.map((n) => n.url);
		const idUrls = id.navigation.map((n) => n.url);
		expect(enUrls).toEqual(idUrls);
	});

	it('contact items share same urls and icons', () => {
		const enMeta = en.contact.map((c) => ({ url: c.url, icon: c.icon, type: c.type }));
		const idMeta = id.contact.map((c) => ({ url: c.url, icon: c.icon, type: c.type }));
		expect(enMeta).toEqual(idMeta);
	});

	it('experience jobs array has same length', () => {
		expect(en.experience.jobs).toHaveLength(id.experience.jobs.length);
	});

	it('portfolio projects array has same length', () => {
		expect(en.portfolio.projects).toHaveLength(id.portfolio.projects.length);
	});

	it('education array has same length', () => {
		expect(en.education.educations).toHaveLength(id.education.educations.length);
	});

	it('contactMe form fields have same length', () => {
		expect(en.contactMe.form).toHaveLength(id.contactMe.form.length);
	});

	it('common portfolioCategories have same length', () => {
		expect(en.common.portfolioCategories).toHaveLength(id.common.portfolioCategories.length);
	});
});

describe('translation content sanity', () => {
	function checkTranslation(t: Translations, label: string) {
		it(`${label}: profile has required fields`, () => {
			expect(t.profile.firstName).toBeTruthy();
			expect(t.profile.lastName).toBeTruthy();
			expect(t.profile.role).toBeTruthy();
		});

		it(`${label}: about has description and focus`, () => {
			expect(t.about.description.length).toBeGreaterThan(0);
			expect(t.about.focus.length).toBeGreaterThan(0);
		});

		it(`${label}: contactMe has all error keys`, () => {
			expect(t.contactMe.errors).toHaveProperty('rateLimited');
			expect(t.contactMe.errors).toHaveProperty('networkError');
			expect(t.contactMe.errors).toHaveProperty('serverError');
			expect(t.contactMe.errors).toHaveProperty('validationError');
		});

		it(`${label}: technology stacks is non-empty`, () => {
			expect(Object.keys(t.technology.stacks).length).toBeGreaterThan(0);
		});
	}

	checkTranslation(en, 'en');
	checkTranslation(id, 'id');
});
