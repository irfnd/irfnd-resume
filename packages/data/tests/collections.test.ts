import { describe, expect, it } from 'vitest';
import { profileSchema } from '@/schemas/profile';
import { experienceSchema } from '@/schemas/experience';
import { educationSchema } from '@/schemas/education';
import { technologySchema } from '@/schemas/technology';
import { techStacksSchema } from '@/schemas/tech-stacks';
import { contactSchema } from '@/schemas/contact';
import { profile } from '@/collections/profile';
import { experience } from '@/collections/experience';
import { education } from '@/collections/education';
import { technology } from '@/collections/technology';
import { techStacks } from '@/collections/tech-stacks';
import { contact } from '@/collections/contact';

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

	it('contains 7 contact items', () => {
		expect(contact.en.items).toHaveLength(7);
		expect(contact.id.items).toHaveLength(7);
	});

	it('has email contact item', () => {
		const email = contact.en.items.find((i) => i.icon === 'tabler:mail');
		expect(email).toBeDefined();
		expect(email!.label).toBe('irfandiabimanyu@gmail.com');
	});
});
