import { about } from '@/collections/about';
import { contact } from '@/collections/contact';
import { contactForm } from '@/collections/contact-form';
import { education } from '@/collections/education';
import { experience } from '@/collections/experience';
import { navigation } from '@/collections/navigation';
import { portfolio } from '@/collections/portfolio';
import { profile } from '@/collections/profile';
import { techStacks } from '@/collections/tech-stacks';
import { technology } from '@/collections/technology';
import { ui } from '@/collections/ui';
import { aboutSchema } from '@/schemas/about';
import { contactSchema } from '@/schemas/contact';
import { contactFormSchema } from '@/schemas/contact-form';
import { educationSchema } from '@/schemas/education';
import { experienceSchema } from '@/schemas/experience';
import { navigationSchema } from '@/schemas/navigation';
import { portfolioSchema } from '@/schemas/portfolio';
import { profileSchema } from '@/schemas/profile';
import { techStacksSchema } from '@/schemas/tech-stacks';
import { technologySchema } from '@/schemas/technology';
import { uiSchema } from '@/schemas/ui';
import { describe, expect, it } from 'vitest';

describe('profile collection', () => {
	it('English data passes schema validation', () => {
		expect(() => profileSchema.parse(profile.en)).not.toThrow();
	});

	it('Indonesian data passes schema validation', () => {
		expect(() => profileSchema.parse(profile.id)).not.toThrow();
	});

	it('contains expected name', () => {
		expect(profile.en.firstName).toBe('Irfandi');
		expect(profile.en.lastName).toBe('Iqbal Abimanyu');
	});
});

describe('experience collection', () => {
	it('English data passes schema validation', () => {
		expect(() => experienceSchema.parse(experience.en)).not.toThrow();
	});

	it('Indonesian data passes schema validation', () => {
		expect(() => experienceSchema.parse(experience.id)).not.toThrow();
	});

	it('contains 3 jobs', () => {
		expect(experience.en.jobs).toHaveLength(3);
		expect(experience.id.jobs).toHaveLength(3);
	});
});

describe('education collection', () => {
	it('English data passes schema validation', () => {
		expect(() => educationSchema.parse(education.en)).not.toThrow();
	});

	it('Indonesian data passes schema validation', () => {
		expect(() => educationSchema.parse(education.id)).not.toThrow();
	});

	it('contains 2 education entries', () => {
		expect(education.en.educations).toHaveLength(2);
		expect(education.id.educations).toHaveLength(2);
	});
});

describe('technology collection', () => {
	it('English data passes schema validation', () => {
		expect(() => technologySchema.parse(technology.en)).not.toThrow();
	});

	it('Indonesian data passes schema validation', () => {
		expect(() => technologySchema.parse(technology.id)).not.toThrow();
	});

	it('contains expected categories', () => {
		const categories = Object.keys(technology.en.stacks);
		expect(categories).toContain('Languages');
		expect(categories).toContain('Frameworks & UI');
		expect(categories).toContain('Databases & Infrastructure');
	});
});

describe('tech-stacks collection', () => {
	it('data passes schema validation', () => {
		expect(() => techStacksSchema.parse(techStacks)).not.toThrow();
	});

	it('contains tech stacks', () => {
		expect(techStacks.stacks.length).toBeGreaterThan(20);
	});

	it('each stack has required fields', () => {
		for (const stack of techStacks.stacks) {
			expect(stack).toHaveProperty('label');
			expect(stack).toHaveProperty('url');
			expect(stack).toHaveProperty('icon');
		}
	});
});

describe('contact collection', () => {
	it('English data passes schema validation', () => {
		expect(() => contactSchema.parse(contact.en)).not.toThrow();
	});

	it('Indonesian data passes schema validation', () => {
		expect(() => contactSchema.parse(contact.id)).not.toThrow();
	});

	it('contains 8 contact items', () => {
		expect(contact.en.items).toHaveLength(8);
		expect(contact.id.items).toHaveLength(8);
	});

	it('has email contact item', () => {
		const email = contact.en.items.find((i) => i.icon === 'tabler:mail');
		expect(email).toBeDefined();
		expect(email!.label).toBe('irfandiabimanyu@gmail.com');
	});
});

describe('portfolio collection', () => {
	it('English data passes schema validation', () => {
		expect(() => portfolioSchema.parse(portfolio.en)).not.toThrow();
	});

	it('Indonesian data passes schema validation', () => {
		expect(() => portfolioSchema.parse(portfolio.id)).not.toThrow();
	});

	it('contains same number of projects in both languages', () => {
		expect(portfolio.en.projects).toHaveLength(7);
		expect(portfolio.id.projects).toHaveLength(7);
	});

	it('has selected projects', () => {
		const selected = portfolio.en.projects.filter((p) => p.isSelected);
		expect(selected.length).toBeGreaterThan(0);
	});
});

describe('about collection', () => {
	it('English data passes schema validation', () => {
		expect(() => aboutSchema.parse(about.en)).not.toThrow();
	});

	it('Indonesian data passes schema validation', () => {
		expect(() => aboutSchema.parse(about.id)).not.toThrow();
	});

	it('contains focus items', () => {
		expect(about.en.focus).toHaveLength(3);
		expect(about.id.focus).toHaveLength(3);
	});
});

describe('navigation collection', () => {
	it('English data passes schema validation', () => {
		expect(() => navigationSchema.parse(navigation.en)).not.toThrow();
	});

	it('Indonesian data passes schema validation', () => {
		expect(() => navigationSchema.parse(navigation.id)).not.toThrow();
	});

	it('contains 4 navigation items', () => {
		expect(navigation.en.items).toHaveLength(4);
		expect(navigation.id.items).toHaveLength(4);
	});
});

describe('ui collection', () => {
	it('English data passes schema validation', () => {
		expect(() => uiSchema.parse(ui.en)).not.toThrow();
	});

	it('Indonesian data passes schema validation', () => {
		expect(() => uiSchema.parse(ui.id)).not.toThrow();
	});

	it('contains SEO data for all pages', () => {
		expect(ui.en.seo).toHaveProperty('home');
		expect(ui.en.seo).toHaveProperty('portfolio');
		expect(ui.en.seo).toHaveProperty('contact');
	});

	it('contains portfolio categories', () => {
		expect(ui.en.common.portfolioCategories).toHaveLength(4);
		expect(ui.id.common.portfolioCategories).toHaveLength(4);
	});
});

describe('contact-form collection', () => {
	it('English data passes schema validation', () => {
		expect(() => contactFormSchema.parse(contactForm.en)).not.toThrow();
	});

	it('Indonesian data passes schema validation', () => {
		expect(() => contactFormSchema.parse(contactForm.id)).not.toThrow();
	});

	it('contains 5 form fields', () => {
		expect(contactForm.en.form).toHaveLength(5);
		expect(contactForm.id.form).toHaveLength(5);
	});
});
