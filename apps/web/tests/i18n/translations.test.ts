import { describe, expect, it } from 'vitest';
import { about, contactForm, navigation, ui } from '@irfnd/data';

describe('content collection JSON structure parity', () => {
	const collections = { navigation, about, contactForm, ui };
	const collectionNames = ['navigation', 'about', 'contactForm', 'ui'];

	for (const name of collectionNames) {
		it(`${name} has both en and id keys`, () => {
			const data = collections[name as keyof typeof collections];
			expect(data).toHaveProperty('en');
			expect(data).toHaveProperty('id');
		});
	}

	it('navigation arrays have same length', () => {
		expect(navigation.en.items).toHaveLength(navigation.id.items.length);
	});

	it('navigation URLs match between en and id', () => {
		const enUrls = navigation.en.items.map((n) => n.url);
		const idUrls = navigation.id.items.map((n) => n.url);
		expect(enUrls).toEqual(idUrls);
	});

	it('contactMe form fields have same length', () => {
		expect(contactForm.en.form).toHaveLength(contactForm.id.form.length);
	});

	it('common portfolioCategories have same length', () => {
		expect(ui.en.common.portfolioCategories).toHaveLength(ui.id.common.portfolioCategories.length);
	});
});

describe('content collection content sanity', () => {
	function checkContent(langKey: 'en' | 'id', label: string) {
		it(`${label}: about has description and focus`, () => {
			const aboutData = about[langKey];
			expect(aboutData.description.length).toBeGreaterThan(0);
			expect(aboutData.focus.length).toBeGreaterThan(0);
		});

		it(`${label}: contactMe has all error keys`, () => {
			const contactMe = contactForm[langKey];
			expect(contactMe.errors).toHaveProperty('rateLimited');
			expect(contactMe.errors).toHaveProperty('networkError');
			expect(contactMe.errors).toHaveProperty('serverError');
			expect(contactMe.errors).toHaveProperty('validationError');
		});
	}

	checkContent('en', 'en');
	checkContent('id', 'id');
});
