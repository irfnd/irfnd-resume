# Shared Data Package Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `packages/data` (`@irfnd/data`) as single source of truth for resume-relevant data shared between `apps/web` and `apps/api`.

**Architecture:** New workspace package with Zod schemas, typed TypeScript data objects (bilingual en/id), and helper utilities. Both apps import from this package. Web replaces 6 content collection `getEntry()` calls with direct imports. API replaces hardcoded `getResumeData()` with shared data mapping. 5 web-specific content collections remain in `apps/web`.

**Tech Stack:** TypeScript, Zod 4, Vitest, Bun workspaces, Turborepo

**Spec:** `docs/superpowers/specs/2026-04-13-shared-data-package-design.md`

---

### Task 1: Create packages/data package scaffold

**Files:**
- Create: `packages/data/package.json`
- Create: `packages/data/tsconfig.json`
- Create: `packages/data/vitest.config.ts`
- Create: `packages/data/src/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
	"name": "@irfnd/data",
	"version": "1.0.0",
	"private": true,
	"type": "module",
	"packageManager": "bun@1.3.10",
	"exports": {
		".": {
			"types": "./src/index.ts",
			"default": "./src/index.ts"
		}
	},
	"scripts": {
		"lint": "eslint .",
		"format": "prettier --write .",
		"test": "vitest",
		"test:run": "vitest run",
		"test:coverage": "vitest run --coverage"
	},
	"peerDependencies": {
		"zod": "^4.3.6"
	},
	"devDependencies": {
		"@eslint/js": "^10.0.1",
		"@irfnd/prettier-config": "^1.4.0",
		"@vitest/coverage-v8": "^3.2.1",
		"eslint": "^10.0.2",
		"prettier": "^3.8.1",
		"prettier-plugin-organize-imports": "^4.3.0",
		"typescript": "~5.9.3",
		"typescript-eslint": "^8.56.1",
		"vitest": "^3.2.1",
		"zod": "^4.3.6"
	}
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
	"compilerOptions": {
		"target": "ES2022",
		"module": "ESNext",
		"moduleResolution": "bundler",
		"strict": true,
		"skipLibCheck": true,
		"esModuleInterop": true,
		"declaration": true,
		"declarationMap": true,
		"composite": true,
		"outDir": "dist"
	},
	"include": ["src"]
}
```

- [ ] **Step 3: Create vitest.config.ts**

```ts
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: { alias: { '@': path.resolve(__dirname, './src') } },
	test: {
		globals: true,
		environment: 'node',
		include: ['tests/**/*.{test,spec}.ts'],
		exclude: ['node_modules', 'dist'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			reportsDirectory: './coverage',
			include: ['src/**/*.ts'],
			exclude: ['src/**/index.ts'],
			thresholds: {
				statements: 100,
				branches: 100,
				functions: 100,
				lines: 100,
			},
		},
	},
});
```

- [ ] **Step 4: Create placeholder src/index.ts**

```ts
export {};
```

- [ ] **Step 5: Install dependencies**

Run: `cd /Users/irfnd/Coding/portfolios/irfnd-resume && bun install`
Expected: Resolves workspace dependencies, no errors.

Also add `@irfnd/data` dependency to both apps:
Run: `cd apps/web && bun add @irfnd/data@workspace:*`
Run: `cd apps/api && bun add @irfnd/data@workspace:*`

- [ ] **Step 6: Commit**

```bash
git add packages/data/ apps/web/package.json apps/api/package.json bun.lock
git commit -m "chore: scaffold packages/data workspace package

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Create shared schemas

**Files:**
- Create: `packages/data/src/schemas/common.ts`
- Create: `packages/data/src/schemas/profile.ts`
- Create: `packages/data/src/schemas/experience.ts`
- Create: `packages/data/src/schemas/education.ts`
- Create: `packages/data/src/schemas/technology.ts`
- Create: `packages/data/src/schemas/tech-stacks.ts`
- Create: `packages/data/src/schemas/contact.ts`

- [ ] **Step 1: Create schemas/common.ts**

Shared sub-schemas reused across domains. Migrated exactly from `apps/web/src/content.config.ts` lines 6-29.

```ts
import { z } from 'zod';

export const imageSchema = z.object({
	url: z.string(),
	alt: z.string(),
});

export const paragraphSchema = z.object({
	value: z.string(),
	keywords: z.array(z.string()),
});

export const techStackItemSchema = z.object({
	label: z.string(),
	url: z.string(),
	icon: z.string(),
	color: z.string().optional(),
	border: z.string().optional(),
	customColor: z.boolean().optional(),
});

export const awardSchema = z.object({
	label: z.string(),
	description: z.string(),
	icon: z.string(),
});

export type ImageData = z.infer<typeof imageSchema>;
export type ParagraphData = z.infer<typeof paragraphSchema>;
export type TechStackItemData = z.infer<typeof techStackItemSchema>;
export type AwardData = z.infer<typeof awardSchema>;
```

- [ ] **Step 2: Create schemas/profile.ts**

```ts
import { z } from 'zod';
import { imageSchema } from './common';

export const profileSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	role: z.string(),
	photo: imageSchema,
	description: z.string(),
});

export type ProfileData = z.infer<typeof profileSchema>;
```

- [ ] **Step 3: Create schemas/experience.ts**

```ts
import { z } from 'zod';
import { paragraphSchema } from './common';

export const jobDescriptionSchema = z.object({
	icon: z.string().optional(),
	position: z.string(),
	summary: z.array(paragraphSchema),
	points: z.array(paragraphSchema),
	stacks: z.array(z.string()),
});

export const jobSchema = z.object({
	company: z.string(),
	mainPosition: z.string(),
	type: z.string(),
	location: z.string(),
	duration: z.array(z.string()),
	link: z.string().nullable(),
	descriptions: z.array(jobDescriptionSchema),
});

export const experienceSchema = z.object({
	title: z.string(),
	jobs: z.array(jobSchema),
});

export type JobDescriptionData = z.infer<typeof jobDescriptionSchema>;
export type JobData = z.infer<typeof jobSchema>;
export type ExperienceData = z.infer<typeof experienceSchema>;
```

- [ ] **Step 4: Create schemas/education.ts**

```ts
import { z } from 'zod';
import { awardSchema, paragraphSchema } from './common';

export const educationItemSchema = z.object({
	institution: z.string(),
	degree: z.string(),
	fieldOfStudy: z.string(),
	location: z.string(),
	duration: z.array(z.string()),
	link: z.string().nullable(),
	summary: z.array(paragraphSchema),
	points: z.array(paragraphSchema),
	award: z.array(awardSchema),
});

export const educationSchema = z.object({
	title: z.string(),
	educations: z.array(educationItemSchema),
});

export type EducationItemData = z.infer<typeof educationItemSchema>;
export type EducationData = z.infer<typeof educationSchema>;
```

- [ ] **Step 5: Create schemas/technology.ts**

```ts
import { z } from 'zod';

export const technologySchema = z.object({
	title: z.string(),
	stacks: z.record(z.string(), z.array(z.string())),
});

export type TechnologyData = z.infer<typeof technologySchema>;
```

- [ ] **Step 6: Create schemas/tech-stacks.ts**

```ts
import { z } from 'zod';
import { techStackItemSchema } from './common';

export const techStacksSchema = z.object({
	stacks: z.array(techStackItemSchema),
});

export type TechStacksData = z.infer<typeof techStacksSchema>;
```

- [ ] **Step 7: Create schemas/contact.ts**

```ts
import { z } from 'zod';

export const contactItemSchema = z.object({
	type: z.enum(['location', 'contact']),
	label: z.string(),
	url: z.string(),
	icon: z.string(),
	showInStickyProfile: z.boolean().optional(),
	showInContactPage: z.boolean().optional(),
	showInFooter: z.boolean().optional(),
});

export const contactSchema = z.object({
	items: z.array(contactItemSchema),
});

export type ContactItemData = z.infer<typeof contactItemSchema>;
export type ContactData = z.infer<typeof contactSchema>;
```

- [ ] **Step 8: Commit**

```bash
git add packages/data/src/schemas/
git commit -m "feat(data): add shared Zod schemas for resume data

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Create helpers

**Files:**
- Create: `packages/data/src/helpers.ts`
- Create: `packages/data/tests/helpers.test.ts`

- [ ] **Step 1: Write failing test for helpers**

```ts
import { describe, expect, it } from 'vitest';
import { getByLang, resolveTechStacks } from '@/helpers';
import type { I18nData, LangCode } from '@/helpers';
import type { TechStackItemData } from '@/schemas/common';

describe('getByLang', () => {
	const data: I18nData<string> = { en: 'Hello', id: 'Halo' };

	it('returns English data for "en"', () => {
		expect(getByLang(data, 'en')).toBe('Hello');
	});

	it('returns Indonesian data for "id"', () => {
		expect(getByLang(data, 'id')).toBe('Halo');
	});

	it('works with complex objects', () => {
		const complex: I18nData<{ name: string }> = {
			en: { name: 'English' },
			id: { name: 'Indonesia' },
		};
		expect(getByLang(complex, 'en')).toEqual({ name: 'English' });
	});
});

describe('resolveTechStacks', () => {
	const allStacks: TechStackItemData[] = [
		{ label: 'React', url: 'https://reactjs.org/', icon: 'simple-icons:react', color: '#61DAFB' },
		{ label: 'TypeScript', url: 'https://www.typescriptlang.org/', icon: 'simple-icons:typescript', color: '#3178C6' },
		{ label: 'Next.js', url: 'https://nextjs.org/', icon: 'simple-icons:nextdotjs', customColor: true, border: 'hover:border-black/50' },
	];

	it('returns matching tech stack entries', () => {
		const result = resolveTechStacks(allStacks, ['React', 'TypeScript']);
		expect(result).toHaveLength(2);
		expect(result.map((t) => t.label)).toEqual(['React', 'TypeScript']);
	});

	it('returns empty array for no matches', () => {
		expect(resolveTechStacks(allStacks, ['NonExistent'])).toEqual([]);
	});

	it('returns empty array for empty labels', () => {
		expect(resolveTechStacks(allStacks, [])).toEqual([]);
	});

	it('preserves order of labels', () => {
		const result = resolveTechStacks(allStacks, ['TypeScript', 'React']);
		expect(result.map((t) => t.label)).toEqual(['TypeScript', 'React']);
	});

	it('filters out unresolvable labels', () => {
		const result = resolveTechStacks(allStacks, ['React', 'Missing', 'TypeScript']);
		expect(result).toHaveLength(2);
		expect(result.map((t) => t.label)).toEqual(['React', 'TypeScript']);
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/data && bunx vitest run tests/helpers.test.ts`
Expected: FAIL — cannot find module `@/helpers`

- [ ] **Step 3: Create helpers.ts**

```ts
export type LangCode = 'en' | 'id';
export type I18nData<T> = Record<LangCode, T>;

export function getByLang<T>(data: I18nData<T>, lang: LangCode): T {
	return data[lang];
}

export function resolveTechStacks<T extends { label: string }>(allStacks: readonly T[], labels: string[]): T[] {
	return labels.map((label) => allStacks.find((s) => s.label === label)).filter((s): s is T => s !== undefined);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/data && bunx vitest run tests/helpers.test.ts`
Expected: All 7 tests PASS

- [ ] **Step 5: Commit**

```bash
git add packages/data/src/helpers.ts packages/data/tests/helpers.test.ts
git commit -m "feat(data): add getByLang and resolveTechStacks helpers

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Create data collections

**Files:**
- Create: `packages/data/src/collections/profile.ts`
- Create: `packages/data/src/collections/experience.ts`
- Create: `packages/data/src/collections/education.ts`
- Create: `packages/data/src/collections/technology.ts`
- Create: `packages/data/src/collections/tech-stacks.ts`
- Create: `packages/data/src/collections/contact.ts`
- Create: `packages/data/tests/collections.test.ts`

- [ ] **Step 1: Write failing test for schema validation of all collections**

This test validates that all data collections pass their Zod schemas.

```ts
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

	it('contains 30 tech stacks', () => {
		expect(techStacks.stacks.length).toBe(30);
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/data && bunx vitest run tests/collections.test.ts`
Expected: FAIL — cannot find module `@/collections/profile`

- [ ] **Step 3: Create collections/profile.ts**

Migrate data verbatim from `apps/web/src/content/data/profile.json`:

```ts
import type { I18nData } from '../helpers';
import type { ProfileData } from '../schemas/profile';

export const profile: I18nData<ProfileData> = {
	en: {
		firstName: 'Irfandi',
		lastName: 'Iqbal Abimanyu',
		photo: {
			url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1722509145/Portfolio/Profile/irfnd-inovative',
			alt: 'Irfandi Photo Profile',
		},
		role: 'Fullstack Web Developer',
		description:
			'Results-driven Fullstack Developer specializing in scalable web architectures. Proven expertise in building robust backend systems and crafting high-fidelity, user-centric frontend interfaces.',
	},
	id: {
		firstName: 'Irfandi',
		lastName: 'Iqbal Abimanyu',
		photo: {
			url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1722509145/Portfolio/Profile/irfnd-inovative',
			alt: 'Foto Profil Irfandi',
		},
		role: 'Fullstack Web Developer',
		description:
			'Fullstack Developer berorientasi hasil dengan spesialisasi pada arsitektur web skalabel. Berpengalaman membangun sistem backend yang robust serta merancang antarmuka frontend presisi tinggi yang mengutamakan pengalaman pengguna.',
	},
};
```

- [ ] **Step 4: Create collections/experience.ts**

Migrate data verbatim from `apps/web/src/content/data/experience.json`. This file is large — copy the full JSON data as TypeScript object. It contains 3 jobs (Nutech Integrasi, Prof.Dito, PLN UPDK) in both en and id.

- [ ] **Step 5: Create collections/education.ts**

Migrate data verbatim from `apps/web/src/content/data/education.json`. Contains 2 entries (Lampung State Polytechnic, Pijar Camp) in both en and id.

- [ ] **Step 6: Create collections/technology.ts**

Migrate data verbatim from `apps/web/src/content/data/technology.json`. Contains 3 categories (Languages, Frameworks & UI, Databases & Infrastructure) in both en and id.

- [ ] **Step 7: Create collections/tech-stacks.ts**

Migrate data from `apps/web/src/content/data/tech-stacks.json`. This is NOT i18n-keyed — export flat `TechStacksData`:

```ts
import type { TechStacksData } from '../schemas/tech-stacks';

export const techStacks: TechStacksData = {
	stacks: [
		{
			label: 'JavaScript',
			url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
			icon: 'simple-icons:javascript',
			color: '#F7DF1E',
		},
		// ... all 30 entries from tech-stacks.json "all.stacks" array
	],
};
```

- [ ] **Step 8: Create collections/contact.ts**

Migrate data verbatim from `apps/web/src/content/data/contact.json`. Contains 7 items per language with type, label, url, icon, and visibility flags.

- [ ] **Step 9: Run tests to verify they pass**

Run: `cd packages/data && bunx vitest run`
Expected: All tests PASS (helpers + collections)

- [ ] **Step 10: Commit**

```bash
git add packages/data/src/collections/ packages/data/tests/collections.test.ts
git commit -m "feat(data): add resume data collections with schema validation

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Create barrel exports and verify coverage

**Files:**
- Modify: `packages/data/src/index.ts`

- [ ] **Step 1: Create barrel exports**

```ts
// Schemas
export * from './schemas/common';
export * from './schemas/profile';
export * from './schemas/experience';
export * from './schemas/education';
export * from './schemas/technology';
export * from './schemas/tech-stacks';
export * from './schemas/contact';

// Data collections
export { profile } from './collections/profile';
export { experience } from './collections/experience';
export { education } from './collections/education';
export { technology } from './collections/technology';
export { techStacks } from './collections/tech-stacks';
export { contact } from './collections/contact';

// Helpers
export * from './helpers';
```

- [ ] **Step 2: Run full test suite with coverage**

Run: `cd packages/data && bunx vitest run --coverage`
Expected: All tests PASS, 100% coverage on statements, branches, functions, lines. `src/index.ts` is excluded from coverage (barrel file).

- [ ] **Step 3: Commit**

```bash
git add packages/data/src/index.ts
git commit -m "feat(data): add barrel exports for shared package

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 6: Migrate apps/api to use @irfnd/data

**Files:**
- Modify: `apps/api/src/routes/resume.ts`
- Modify: `apps/api/tests/routes/resume.test.ts`
- Modify: `apps/api/tests/templates/resume.test.ts`

- [ ] **Step 1: Replace getResumeData in apps/api/src/routes/resume.ts**

Replace the entire file with:

```ts
import { generateResumeHTML } from '@/templates/resume';
import type { ResumeData } from '@/templates/resume';
import { getByLang, profile, experience, education, technology, contact } from '@irfnd/data';
import type { LangCode } from '@irfnd/data';
import { Hono } from 'hono';

function getResumeData(lang: string): ResumeData {
	const l = (lang === 'id' ? 'id' : 'en') as LangCode;
	const p = getByLang(profile, l);
	const exp = getByLang(experience, l);
	const edu = getByLang(education, l);
	const tech = getByLang(technology, l);
	const c = getByLang(contact, l);

	return {
		name: `${p.firstName} ${p.lastName}`,
		role: p.role,
		email: c.items.find((i) => i.icon === 'tabler:mail')?.label ?? '',
		location: c.items.find((i) => i.type === 'location')?.label ?? '',
		linkedin: c.items.find((i) => i.icon === 'tabler:brand-linkedin')?.url ?? '',
		github: c.items.find((i) => i.icon === 'tabler:brand-github')?.url ?? '',
		summary: p.description,
		experience: exp.jobs.map((job) => ({
			company: job.company,
			position: job.mainPosition,
			duration: job.duration.join(' - '),
			location: job.location,
			points: job.descriptions.flatMap((d) =>
				[...d.summary, ...d.points].map((pt) => pt.value),
			),
		})),
		education: edu.educations.map((e) => ({
			institution: e.institution,
			degree: `${e.degree} — ${e.fieldOfStudy}`,
			duration: e.duration.join(' - '),
			location: e.location,
		})),
		skills: Object.values(tech.stacks).flat(),
	};
}

export const resumeRoute = new Hono();

resumeRoute.get('/', async (c) => {
	const lang = c.req.query('lang') || 'en';

	if (lang !== 'en' && lang !== 'id') {
		return c.json({ error: 'Invalid language. Use "en" or "id".' }, 400);
	}

	try {
		const puppeteer = await import('puppeteer');
		const browser = await puppeteer.default.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});

		const page = await browser.newPage();
		const html = generateResumeHTML(getResumeData(lang));
		await page.setContent(html, { waitUntil: 'networkidle0' });

		const pdf = await page.pdf({
			format: 'A4',
			printBackground: true,
			margin: { top: '0', bottom: '0', left: '0', right: '0' },
		});

		await browser.close();

		return new Response(pdf, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="Resume_Irfandi_${lang.toUpperCase()}.pdf"`,
			},
		});
	} catch (err) {
		console.error('Resume generation error:', err);
		return c.json({ error: 'Failed to generate resume' }, 500);
	}
});
```

- [ ] **Step 2: Run API tests**

Run: `cd apps/api && bunx vitest run`
Expected: All 95 tests PASS. The existing resume tests mock Puppeteer and test HTTP responses — they should still pass because the route behavior is identical.

- [ ] **Step 3: Run API tests with coverage**

Run: `cd apps/api && bunx vitest run --coverage`
Expected: 100% coverage. If `getResumeData` has uncovered branches (e.g., the contact `.find()` fallbacks), add targeted tests.

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/routes/resume.ts apps/api/tests/
git commit -m "feat(api): replace hardcoded resume data with @irfnd/data imports

Experience, education, and skills now pull from the shared data package
instead of empty/hardcoded values.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 7: Migrate apps/web components to use @irfnd/data

**Files to modify** (13 files replacing `getEntry()` for migrated collections):
- `apps/web/src/layouts/BaseLayout.astro`
- `apps/web/src/pages/en/index.astro`
- `apps/web/src/pages/id/index.astro`
- `apps/web/src/pages/en/portfolio.astro`
- `apps/web/src/pages/id/portfolio.astro`
- `apps/web/src/pages/en/contact.astro`
- `apps/web/src/pages/id/contact.astro`
- `apps/web/src/components/layout/StickyProfile.astro`
- `apps/web/src/components/layout/Footer.astro`
- `apps/web/src/components/page/home/ProfessionalJourney.astro`
- `apps/web/src/components/page/home/SelectedWork.astro`
- `apps/web/src/components/page/home/TechnicalStack.astro`
- `apps/web/src/components/page/home/EducationHistory.astro`

**Key migration pattern:**

Before: `(await getEntry('collection', lang))!.data`
After: `getByLang(collection, lang as LangCode)`

Before: `(await getEntry('tech-stacks', 'all'))!.data.stacks`
After: `techStacks.stacks`

When a file uses BOTH migrated and non-migrated collections, keep `getEntry` for the non-migrated ones.

- [ ] **Step 1: Migrate BaseLayout.astro**

Replace line 5 import and line 21 data access:

```astro
---
import '@/index.css';

import { getLangFromUrl } from '@/i18n';
import { getByLang, profile as profileCollection } from '@irfnd/data';
import type { LangCode } from '@irfnd/data';

import Footer from '@/components/layout/Footer.astro';
// ... rest of imports unchanged ...

const lang = getLangFromUrl(Astro.url);
const profileData = getByLang(profileCollection, lang as LangCode);
const { title, description = `${profileData.firstName} ${profileData.lastName} — ${profileData.role}` } = Astro.props;
// ... rest unchanged ...
```

Remove `import { getEntry } from 'astro:content';` since BaseLayout only uses `profile` (migrated).

- [ ] **Step 2: Migrate pages/en/index.astro and pages/id/index.astro**

Both files are identical except URL path. Each uses `profile` (migrated) and `ui` (stays).

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import JsonLd from '@/components/common/JsonLd.astro';
import { getLangFromUrl } from '@/i18n';
import { getEntry } from 'astro:content';
import { getByLang, profile as profileCollection } from '@irfnd/data';
import type { LangCode } from '@irfnd/data';
import ProfileFocus from '@/components/page/home/ProfileFocus.astro';
import ProfessionalJourney from '@/components/page/home/ProfessionalJourney.astro';
import SelectedWork from '@/components/page/home/SelectedWork.astro';
import TechnicalStack from '@/components/page/home/TechnicalStack.astro';
import EducationHistory from '@/components/page/home/EducationHistory.astro';

const lang = getLangFromUrl(Astro.url);
const profile = getByLang(profileCollection, lang as LangCode);
const { seo } = (await getEntry('ui', lang))!.data;
// ... personSchema and rest unchanged, using `profile.firstName` etc. (no .data wrapper)
```

- [ ] **Step 3: Migrate pages/en/portfolio.astro and pages/id/portfolio.astro**

Uses `portfolio` (stays), `ui` (stays), `tech-stacks` (migrated):

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import { getLangFromUrl } from '@/i18n';
import { getEntry } from 'astro:content';
import { cn } from '@/utils/cn';
import { resolveTechStacks, techStacks } from '@irfnd/data';
import { sortProjects } from '@/utils/portfolio';
import ProjectCard from '@/components/ui/ProjectCard.astro';
import ProjectDialog from '@/components/ui/ProjectDialog.astro';
import ProjectDialogShell from '@/components/ui/ProjectDialogShell.astro';

const lang = getLangFromUrl(Astro.url);
const portfolioData = (await getEntry('portfolio', lang))!.data;
const { seo, common } = (await getEntry('ui', lang))!.data;
const allStacks = techStacks.stacks;

// ... rest unchanged, uses allStacks the same way
```

Remove `import { resolveTechStacks } from '@/utils/tech-stacks';` — now from `@irfnd/data`.

- [ ] **Step 4: Migrate pages/en/contact.astro and pages/id/contact.astro**

Uses `contact-form` (stays), `contact` (migrated), `ui` (stays):

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import { getLangFromUrl } from '@/i18n';
import { getEntry } from 'astro:content';
import { getByLang, contact as contactCollection } from '@irfnd/data';
import type { LangCode } from '@irfnd/data';
import ContactForm from '@/components/ui/ContactForm.astro';
import MapEmbed from '@/components/ui/MapEmbed.astro';
import Toast from '@/components/ui/Toast.astro';

const lang = getLangFromUrl(Astro.url);
const contactMe = (await getEntry('contact-form', lang))!.data;
const contactItems = getByLang(contactCollection, lang as LangCode).items;
const { seo } = (await getEntry('ui', lang))!.data;

const directContact = contactItems
	.filter((c) => c.showInContactPage)
	.map((c) => ({ label: c.label, url: c.url, icon: c.icon }));
```

- [ ] **Step 5: Migrate StickyProfile.astro**

Uses `profile` (migrated) and `contact` (migrated) — remove `getEntry` entirely:

```astro
---
import { Icon } from 'astro-icon/components';
import { getLangFromUrl } from '@/i18n';
import { getByLang, profile as profileCollection, contact as contactCollection } from '@irfnd/data';
import type { LangCode } from '@irfnd/data';
import { cloudinaryResize } from '@/utils/cloudinary';

const lang = getLangFromUrl(Astro.url);
const profile = getByLang(profileCollection, lang as LangCode);
const contactItems = getByLang(contactCollection, lang as LangCode).items;

const stickyProfileContact = contactItems.filter((item) => item.showInStickyProfile);
---
```

- [ ] **Step 6: Migrate Footer.astro**

Uses `ui` (stays) and `contact` (migrated):

```astro
---
import { getLangFromUrl } from '@/i18n';
import { getEntry } from 'astro:content';
import { getByLang, contact as contactCollection } from '@irfnd/data';
import type { LangCode } from '@irfnd/data';

const lang = getLangFromUrl(Astro.url);
const { footer } = (await getEntry('ui', lang))!.data;
const contactItems = getByLang(contactCollection, lang as LangCode).items;

const currentYear = new Date().getFullYear();
const footerContact = contactItems.filter((item) => item.showInFooter);
---
```

- [ ] **Step 7: Migrate ProfessionalJourney.astro**

Uses `experience` (migrated) and `tech-stacks` (migrated) — remove `getEntry` entirely:

```astro
---
import { getLangFromUrl } from '@/i18n';
import { getByLang, experience as experienceCollection, techStacks, resolveTechStacks } from '@irfnd/data';
import type { LangCode } from '@irfnd/data';
import { cn } from '@/utils/cn';
import { Icon } from 'astro-icon/components';
import HighlightText from '@/components/ui/HighlightText.astro';
import TechIcon from '@/components/ui/TechIcon.astro';
import TimelineBeam from '@/components/ui/TimelineBeam.astro';
import TimelineItem from '@/components/ui/TimelineItem.astro';
import TimelineDot from '@/components/ui/TimelineDot.astro';
import TimelineBadge from '@/components/ui/TimelineBadge.astro';

const lang = getLangFromUrl(Astro.url);
const experienceData = getByLang(experienceCollection, lang as LangCode);
const allStacks = techStacks.stacks;

const experience = {
	...experienceData,
	jobs: experienceData.jobs.map((job) => ({
		...job,
		descriptions: job.descriptions.map((desc) => ({
			...desc,
			stacks: resolveTechStacks(allStacks, desc.stacks),
		})),
	})),
};
---
```

- [ ] **Step 8: Migrate SelectedWork.astro**

Uses `portfolio` (stays), `ui` (stays), `tech-stacks` (migrated):

```astro
---
import { getLangFromUrl, getLocalizedPath } from '@/i18n';
import { getEntry } from 'astro:content';
import { cn } from '@/utils/cn';
import { Icon } from 'astro-icon/components';
import { resolveTechStacks, techStacks } from '@irfnd/data';
import ProjectCard from '@/components/ui/ProjectCard.astro';
import ProjectDialog from '@/components/ui/ProjectDialog.astro';
import ProjectDialogShell from '@/components/ui/ProjectDialogShell.astro';

const lang = getLangFromUrl(Astro.url);
const portfolioData = (await getEntry('portfolio', lang))!.data;
const { common } = (await getEntry('ui', lang))!.data;
const allStacks = techStacks.stacks;

const commonLabels = { source: common.source, liveDemo: common.liveDemo, internal: common.internal };

const selectedProjects = portfolioData.projects
	.filter((project) => project.isSelected)
	.sort((a, b) => a.name.localeCompare(b.name))
	.map((project) => ({ ...project, stacks: resolveTechStacks(allStacks, project.stacks) }));
---
```

- [ ] **Step 9: Migrate TechnicalStack.astro**

Uses `technology` (migrated) and `tech-stacks` (migrated) — remove `getEntry` entirely:

```astro
---
import { getLangFromUrl } from '@/i18n';
import { getByLang, technology as technologyCollection, techStacks, resolveTechStacks } from '@irfnd/data';
import type { LangCode } from '@irfnd/data';
import TechIcon from '@/components/ui/TechIcon.astro';

const lang = getLangFromUrl(Astro.url);
const technology = getByLang(technologyCollection, lang as LangCode);
const allStacks = techStacks.stacks;

const stackEntries = Object.entries(technology.stacks)
	.filter(([, labels]) => labels.length > 0)
	.map(([category, labels]) => [category, resolveTechStacks(allStacks, labels)] as const);
---
```

- [ ] **Step 10: Migrate EducationHistory.astro**

Uses `education` (migrated) — remove `getEntry` entirely:

```astro
---
import { getLangFromUrl } from '@/i18n';
import { getByLang, education as educationCollection } from '@irfnd/data';
import type { LangCode } from '@irfnd/data';
import { Icon } from 'astro-icon/components';
import HighlightText from '@/components/ui/HighlightText.astro';
import TimelineBeam from '@/components/ui/TimelineBeam.astro';
import TimelineItem from '@/components/ui/TimelineItem.astro';
import TimelineDot from '@/components/ui/TimelineDot.astro';
import TimelineBadge from '@/components/ui/TimelineBadge.astro';

const lang = getLangFromUrl(Astro.url);
const education = getByLang(educationCollection, lang as LangCode);
---
```

- [ ] **Step 11: Commit**

```bash
git add apps/web/src/layouts/ apps/web/src/pages/ apps/web/src/components/
git commit -m "feat(web): replace content collection imports with @irfnd/data

Migrate 13 component files from getEntry() to direct imports from
the shared data package for profile, experience, education, technology,
tech-stacks, and contact collections.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 8: Clean up orphaned content collections

**Files:**
- Modify: `apps/web/src/content.config.ts` — remove 6 migrated collection defs
- Delete: `apps/web/src/content/data/profile.json`
- Delete: `apps/web/src/content/data/experience.json`
- Delete: `apps/web/src/content/data/education.json`
- Delete: `apps/web/src/content/data/technology.json`
- Delete: `apps/web/src/content/data/tech-stacks.json`
- Delete: `apps/web/src/content/data/contact.json`
- Delete: `apps/web/src/utils/tech-stacks.ts`
- Modify: `apps/web/tests/contents/tech-stack-list.test.ts` — update to import from `@irfnd/data`

- [ ] **Step 1: Update content.config.ts**

Remove the 6 migrated collections and their schemas. Keep `navigation`, `about`, `portfolio`, `contact-form`, `ui`. Also remove `imageSchema`, `paragraphSchema`, `techStackItemSchema`, `awardSchema` since they're now in `@irfnd/data` (but only if the remaining collections don't use them — check: `about` uses `paragraphSchema`, `portfolio` uses `paragraphSchema`, `imageSchema`). So we MUST keep `imageSchema` and `paragraphSchema` in content.config.ts for the remaining collections.

Updated `content.config.ts`:

```ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file } from 'astro/loaders';

// Reusable sub-schemas (for remaining web-specific collections)
const imageSchema = z.object({
	url: z.string(),
	alt: z.string(),
});

const paragraphSchema = z.object({
	value: z.string(),
	keywords: z.array(z.string()),
});

// Collection definitions
const navigation = defineCollection({
	loader: file('src/content/data/navigation.json'),
	schema: z.object({
		items: z.array(
			z.object({
				label: z.string(),
				url: z.string(),
				icon: z.string(),
			})
		),
	}),
});

const about = defineCollection({
	loader: file('src/content/data/about.json'),
	schema: z.object({
		title: z.string(),
		description: z.array(paragraphSchema),
		focus: z.array(
			z.object({
				value: z.string(),
				label: z.string(),
				icon: z.string(),
			})
		),
	}),
});

const portfolio = defineCollection({
	loader: file('src/content/data/portfolio.json'),
	schema: z.object({
		header: z.string(),
		title: z.string(),
		subtitle: z.string(),
		projects: z.array(
			z.object({
				icon: z.string(),
				name: z.string(),
				summary: z.array(paragraphSchema),
				image: z.array(imageSchema),
				type: z.enum(['private', 'public']),
				demo: z.string().nullable(),
				source: z.string().nullable(),
				stacks: z.array(z.string()),
				category: z.enum(['frontend', 'backend', 'fullstack']),
				isSelected: z.boolean().optional(),
			})
		),
	}),
});

const contactForm = defineCollection({
	loader: file('src/content/data/contact-form.json'),
	schema: z.object({
		header: z.string(),
		description: z.string(),
		formTitle: z.string(),
		form: z.array(
			z.object({
				label: z.string(),
				name: z.string(),
				type: z.enum(['text', 'email', 'tel', 'textarea']),
				placeholder: z.string(),
			})
		),
		submitButton: z.string(),
		submittingButton: z.string(),
		successMessage: z.string(),
		sendAnotherMessage: z.string(),
		reachMeDirectly: z.string(),
		errors: z.object({
			rateLimited: z.string(),
			networkError: z.string(),
			serverError: z.string(),
			validationError: z.string(),
		}),
		validation: z.object({
			fullName: z.object({
				min: z.string(),
				max: z.string(),
			}),
			email: z.object({
				invalid: z.string(),
			}),
			telephone: z.object({
				min: z.string(),
				max: z.string(),
			}),
			subject: z.object({
				min: z.string(),
				max: z.string(),
			}),
			message: z.object({
				min: z.string(),
				max: z.string(),
			}),
		}),
	}),
});

const ui = defineCollection({
	loader: file('src/content/data/ui.json'),
	schema: z.object({
		seo: z.object({
			home: z.object({
				title: z.string(),
				description: z.string(),
			}),
			portfolio: z.object({
				title: z.string(),
				description: z.string(),
			}),
			contact: z.object({
				title: z.string(),
				description: z.string(),
			}),
		}),
		footer: z.object({
			copyright: z.string(),
			builtWith: z.string(),
		}),
		common: z.object({
			viewMore: z.string(),
			liveDemo: z.string(),
			source: z.string(),
			internal: z.string(),
			technologies: z.string(),
			changeLanguage: z.string(),
			changeTheme: z.string(),
			portfolioCategories: z.array(
				z.object({
					label: z.string(),
					value: z.string(),
				})
			),
		}),
	}),
});

export const collections = {
	navigation,
	about,
	portfolio,
	'contact-form': contactForm,
	ui,
};
```

- [ ] **Step 2: Delete 6 migrated JSON data files**

```bash
rm apps/web/src/content/data/profile.json
rm apps/web/src/content/data/experience.json
rm apps/web/src/content/data/education.json
rm apps/web/src/content/data/technology.json
rm apps/web/src/content/data/tech-stacks.json
rm apps/web/src/content/data/contact.json
```

- [ ] **Step 3: Delete apps/web/src/utils/tech-stacks.ts**

```bash
rm apps/web/src/utils/tech-stacks.ts
```

Also check if `apps/web/src/utils/index.ts` exports `tech-stacks` and remove that export if present.

- [ ] **Step 4: Update tech-stack-list.test.ts**

The test currently reads `tech-stacks.json` directly via `readFileSync`. Update to import from `@irfnd/data`:

```ts
import { describe, expect, it } from 'vitest';
import { resolveTechStacks, techStacks } from '@irfnd/data';

const allStacks = techStacks.stacks;

describe('resolveTechStacks with real data', () => {
	it('returns matching tech stack entries', () => {
		const result = resolveTechStacks(allStacks, ['React', 'TypeScript']);
		expect(result).toHaveLength(2);
		expect(result.map((t) => t.label)).toEqual(expect.arrayContaining(['React', 'TypeScript']));
	});

	it('returns empty array for no matches', () => {
		const result = resolveTechStacks(allStacks, ['NonExistent']);
		expect(result).toEqual([]);
	});

	it('returns entries with required properties', () => {
		const [item] = resolveTechStacks(allStacks, ['React']);
		expect(item).toHaveProperty('label', 'React');
		expect(item).toHaveProperty('url');
		expect(item).toHaveProperty('icon');
	});

	it('handles entries with customColor property', () => {
		const result = resolveTechStacks(allStacks, ['Next.js']);
		expect(result).toHaveLength(1);
		expect(result[0].customColor).toBe(true);
		expect(result[0]).toHaveProperty('border');
	});

	it('returns empty array for empty labels', () => {
		expect(resolveTechStacks(allStacks, [])).toEqual([]);
	});
});
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(web): remove migrated content collections and cleanup

Remove 6 JSON data files, 6 collection definitions, and tech-stacks
utility now provided by @irfnd/data. Update tests to use shared imports.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 9: Final verification

- [ ] **Step 1: Run all packages/data tests with coverage**

Run: `cd packages/data && bunx vitest run --coverage`
Expected: All tests PASS, 100% coverage.

- [ ] **Step 2: Run all apps/api tests with coverage**

Run: `cd apps/api && bunx vitest run --coverage`
Expected: All tests PASS (95 tests), 100% coverage.

- [ ] **Step 3: Run all apps/web tests with coverage**

Run: `cd apps/web && bunx vitest run --coverage`
Expected: All tests PASS (140 tests), 100% coverage. If `tech-stacks.ts` removal causes coverage changes, verify the `src/utils/index.ts` barrel file is updated.

- [ ] **Step 4: Build both apps**

Run: `bun run build` (from monorepo root, runs Turbo)
Expected: Both apps build cleanly — 0 errors, 0 warnings.

- [ ] **Step 5: Verify dev server works**

Run: `cd apps/web && bunx astro dev --port 4321`
Manually check: homepage loads, experience/education/skills sections render, resume download works.

- [ ] **Step 6: Final commit and push**

```bash
git add -A
git commit -m "chore: verify all tests and builds pass after data migration

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
git push origin master
```
