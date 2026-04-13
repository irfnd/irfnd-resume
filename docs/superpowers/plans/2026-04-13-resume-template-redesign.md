# Resume Template Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the resume HTML template to match a classic serif-styled reference PDF, migrate portfolio data to `@irfnd/data`, and support per-position experience entries.

**Architecture:** Extend `@irfnd/data` schemas/collections (experience duration, contact website, portfolio), redesign the HTML template with Times New Roman styling, update the resume route's data mapping, migrate web app portfolio data source, and update all tests for 100% coverage.

**Tech Stack:** TypeScript, Zod, Hono, Puppeteer, Vitest, Astro

---

### Task 1: Extend Experience Schema with Per-Description Duration

**Files:**
- Modify: `packages/data/src/schemas/experience.ts:4-10`
- Modify: `packages/data/src/collections/experience.ts`
- Test: `packages/data/tests/collections.test.ts`

- [ ] **Step 1: Add optional duration to jobDescriptionSchema**

In `packages/data/src/schemas/experience.ts`, add `duration` field:

```ts
export const jobDescriptionSchema = z.object({
	icon: z.string().optional(),
	position: z.string(),
	duration: z.array(z.string()).optional(),
	summary: z.array(paragraphSchema),
	points: z.array(paragraphSchema),
	stacks: z.array(z.string()),
});
```

- [ ] **Step 2: Add duration to Nutech descriptions in English data**

In `packages/data/src/collections/experience.ts`, add `duration` to Nutech's two description entries in the `en` object:

First description (Backend Development, around line 16):
```ts
{
	icon: 'tabler:server-2',
	position: 'Backend Development',
	duration: ['July 2024', 'October 2024'],
	summary: [],
	// ... rest unchanged
```

Second description (Frontend Development, around line 48):
```ts
{
	icon: 'tabler:layout',
	position: 'Frontend Development',
	duration: ['April 2023', 'July 2024'],
	summary: [],
	// ... rest unchanged
```

- [ ] **Step 3: Add duration to Nutech descriptions in Indonesian data**

Same pattern for `id` object:

First description (Backend Development):
```ts
duration: ['Juli 2024', 'Oktober 2024'],
```

Second description (Frontend Development):
```ts
duration: ['April 2023', 'Juli 2024'],
```

- [ ] **Step 4: Run data package tests**

Run: `cd packages/data && bun run test`
Expected: All tests pass (schema validation still works because `duration` is optional)

- [ ] **Step 5: Commit**

```bash
git add packages/data/src/schemas/experience.ts packages/data/src/collections/experience.ts
git commit -m "feat(data): add optional duration to job description schema"
```

---

### Task 2: Add Website and showInResume to Contact Collection

**Files:**
- Modify: `packages/data/src/schemas/contact.ts`
- Modify: `packages/data/src/collections/contact.ts`
- Modify: `packages/data/tests/collections.test.ts`

- [ ] **Step 1: Add showInResume to contact schema**

In `packages/data/src/schemas/contact.ts`:

```ts
export const contactItemSchema = z.object({
	type: z.enum(['location', 'contact']),
	label: z.string(),
	url: z.string(),
	icon: z.string(),
	showInStickyProfile: z.boolean().optional(),
	showInContactPage: z.boolean().optional(),
	showInFooter: z.boolean().optional(),
	showInResume: z.boolean().optional(),
});
```

- [ ] **Step 2: Add showInResume flags and website entry to English contact data**

In `packages/data/src/collections/contact.ts`, update the `en` items array. Add `showInResume: true` to location, email, LinkedIn, and GitHub entries. Then add the website entry at the end:

```ts
{
	type: 'location',
	label: 'Jakarta, Indonesia',
	url: 'https://maps.app.goo.gl/fyZkFpqiq9jYi1a28',
	icon: 'tabler:map-pin',
	showInContactPage: true,
	showInResume: true,
},
{
	type: 'contact',
	label: 'irfandiabimanyu@gmail.com',
	url: 'mailto:irfandiabimanyu@gmail.com',
	icon: 'tabler:mail',
	showInStickyProfile: true,
	showInContactPage: true,
	showInResume: true,
},
```

Add `showInResume: true` to the LinkedIn entry and GitHub entry similarly.

Add this new entry at the end of the `en` items array (before the closing `]`):

```ts
{
	type: 'contact',
	label: 'irfnd.id',
	url: 'https://irfnd.id',
	icon: 'tabler:world',
	showInResume: true,
},
```

- [ ] **Step 3: Mirror changes in Indonesian contact data**

Same changes for the `id` items array — add `showInResume: true` to location, email, LinkedIn, GitHub, and add the website entry.

- [ ] **Step 4: Update contact count test**

In `packages/data/tests/collections.test.ts`, update the contact count from 7 to 8:

```ts
it('contains 8 contact items', () => {
	expect(contact.en.items).toHaveLength(8);
	expect(contact.id.items).toHaveLength(8);
});
```

- [ ] **Step 5: Run data package tests**

Run: `cd packages/data && bun run test`
Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add packages/data/src/schemas/contact.ts packages/data/src/collections/contact.ts packages/data/tests/collections.test.ts
git commit -m "feat(data): add showInResume flag and website contact entry"
```

---

### Task 3: Create Portfolio Schema and Collection in @irfnd/data

**Files:**
- Create: `packages/data/src/schemas/portfolio.ts`
- Create: `packages/data/src/collections/portfolio.ts`
- Modify: `packages/data/src/index.ts`
- Modify: `packages/data/tests/collections.test.ts`

- [ ] **Step 1: Create portfolio schema**

Create `packages/data/src/schemas/portfolio.ts`:

```ts
import { z } from 'zod';
import { imageSchema, paragraphSchema } from './common';

export const portfolioProjectSchema = z.object({
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
});

export const portfolioSchema = z.object({
	header: z.string(),
	title: z.string(),
	subtitle: z.string(),
	projects: z.array(portfolioProjectSchema),
});

export type PortfolioProjectData = z.infer<typeof portfolioProjectSchema>;
export type PortfolioData = z.infer<typeof portfolioSchema>;
```

- [ ] **Step 2: Create portfolio collection**

Create `packages/data/src/collections/portfolio.ts`. This is a large file — convert the entire content of `apps/web/src/content/data/portfolio.json` into a TypeScript `I18nData<PortfolioData>` export. Structure:

```ts
import type { I18nData } from '../helpers';
import type { PortfolioData } from '../schemas/portfolio';

export const portfolio: I18nData<PortfolioData> = {
	en: {
		header: 'Portfolio',
		title: 'Selected Works',
		subtitle: 'A curated selection of production-grade applications, robust APIs, and innovative experiments engineered with modern web technologies.',
		projects: [
			// Copy all 8 projects from portfolio.json "en" section
			// Each project object maps directly (same shape)
		],
	},
	id: {
		header: 'Portofolio',
		title: 'Karya Terpilih',
		subtitle: 'Koleksi aplikasi skala produksi, API yang andal, dan eksperimen inovatif yang dibangun menggunakan teknologi web modern.',
		projects: [
			// Copy all 8 projects from portfolio.json "id" section
		],
	},
};
```

Each project has: `icon`, `name`, `summary[]`, `image[]`, `type`, `demo`, `source`, `stacks[]`, `category`, and optionally `isSelected`.

- [ ] **Step 3: Add portfolio exports to barrel**

In `packages/data/src/index.ts`, add:

```ts
// In Schemas section:
export * from './schemas/portfolio';

// In Data collections section:
export { portfolio } from './collections/portfolio';
```

- [ ] **Step 4: Add portfolio tests to collections test**

In `packages/data/tests/collections.test.ts`, add imports and tests:

```ts
import { portfolioSchema } from '@/schemas/portfolio';
import { portfolio } from '@/collections/portfolio';

describe('portfolio collection', () => {
	it('English data passes schema validation', () => {
		expect(() => portfolioSchema.parse(portfolio.en)).not.toThrow();
	});

	it('Indonesian data passes schema validation', () => {
		expect(() => portfolioSchema.parse(portfolio.id)).not.toThrow();
	});

	it('contains same number of projects in both languages', () => {
		expect(portfolio.en.projects).toHaveLength(portfolio.id.projects.length);
	});

	it('has selected projects', () => {
		const selected = portfolio.en.projects.filter((p) => p.isSelected);
		expect(selected.length).toBeGreaterThan(0);
	});
});
```

- [ ] **Step 5: Run data package tests**

Run: `cd packages/data && bun run test`
Expected: All tests pass including new portfolio tests

- [ ] **Step 6: Commit**

```bash
git add packages/data/src/schemas/portfolio.ts packages/data/src/collections/portfolio.ts packages/data/src/index.ts packages/data/tests/collections.test.ts
git commit -m "feat(data): add portfolio schema and collection"
```

---

### Task 4: Migrate Web App Portfolio to @irfnd/data

**Files:**
- Delete: `apps/web/src/content/data/portfolio.json`
- Modify: `apps/web/src/content.config.ts:45-66`
- Modify: `apps/web/src/components/page/home/SelectedWork.astro:3,12`
- Modify: `apps/web/src/pages/en/portfolio.astro:4,13`
- Modify: `apps/web/src/pages/id/portfolio.astro:4,13`
- Modify: `apps/web/tests/i18n/translations.test.ts:12,34-37`

- [ ] **Step 1: Update SelectedWork.astro to use @irfnd/data**

In `apps/web/src/components/page/home/SelectedWork.astro`, replace `getEntry` portfolio usage:

Remove `import { getEntry } from 'astro:content';` (line 3) and change line 6 and 12:

```astro
---
import { getLangFromUrl, getLocalizedPath } from '@/i18n';
import { cn } from '@/utils/cn';
import { Icon } from 'astro-icon/components';
import { getByLang, portfolio as portfolioCollection, resolveTechStacks, techStacks } from '@irfnd/data';
import type { LangCode } from '@irfnd/data';
import ProjectCard from '@/components/ui/ProjectCard.astro';
import ProjectDialog from '@/components/ui/ProjectDialog.astro';
import ProjectDialogShell from '@/components/ui/ProjectDialogShell.astro';

const lang = getLangFromUrl(Astro.url);
const portfolioData = getByLang(portfolioCollection, lang as LangCode);
const { common } = (await getEntry('ui', lang))!.data;
const allStacks = techStacks.stacks;
```

Note: `getEntry` is still needed for `ui` collection. Re-add the import:

```ts
import { getEntry } from 'astro:content';
```

- [ ] **Step 2: Update en/portfolio.astro to use @irfnd/data**

In `apps/web/src/pages/en/portfolio.astro`:

Replace line 4 (`import { getEntry } from 'astro:content';`) and line 13:

```astro
import { getEntry } from 'astro:content';
import { getByLang, portfolio as portfolioCollection, resolveTechStacks, techStacks } from '@irfnd/data';
import type { LangCode } from '@irfnd/data';
```

Replace line 13:
```ts
const portfolioData = getByLang(portfolioCollection, lang as LangCode);
```

Keep `getEntry` for `ui` collection on line 14.

- [ ] **Step 3: Update id/portfolio.astro identically**

Same changes as en/portfolio.astro (the files are identical).

- [ ] **Step 4: Delete portfolio.json and remove from content.config.ts**

Delete `apps/web/src/content/data/portfolio.json`.

In `apps/web/src/content.config.ts`, remove the entire `portfolio` collection definition (lines 45-66) and remove `portfolio` from the `collections` export (line 159).

- [ ] **Step 5: Update translation parity test**

In `apps/web/tests/i18n/translations.test.ts`:

Remove `'portfolio'` from `i18nFiles` array on line 12 (it's no longer a JSON file in content/data).

Remove the portfolio projects test (lines 34-37):
```ts
it('portfolio projects array has same length', () => {
	const data = loadJson('portfolio');
	expect(data.en.projects).toHaveLength(data.id.projects.length);
});
```

This parity check is now covered by the data package test in Task 3.

- [ ] **Step 6: Run web tests and build**

Run: `cd apps/web && bun run test`
Expected: All tests pass

Run: `cd apps/web && bun run build`
Expected: Build succeeds

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor(web): migrate portfolio data to @irfnd/data"
```

---

### Task 5: Add resolveParagraph Helper

**Files:**
- Modify: `packages/data/src/helpers.ts`
- Modify: `packages/data/src/index.ts` (already exports `*` from helpers)
- Modify: `packages/data/tests/helpers.test.ts`

- [ ] **Step 1: Write failing tests for resolveParagraph**

In `packages/data/tests/helpers.test.ts`, add a new describe block:

```ts
describe('resolveParagraph', () => {
	it('replaces {0} and {1} placeholders with keywords', () => {
		const result = resolveParagraph({
			value: 'Built {0} using {1} framework',
			keywords: ['REST API', 'Express.js'],
		});
		expect(result).toBe('Built REST API using Express.js framework');
	});

	it('returns value as-is when no keywords', () => {
		const result = resolveParagraph({ value: 'Simple text', keywords: [] });
		expect(result).toBe('Simple text');
	});

	it('handles single keyword', () => {
		const result = resolveParagraph({ value: 'Used {0} for auth', keywords: ['JWT'] });
		expect(result).toBe('Used JWT for auth');
	});
});
```

Add `resolveParagraph` to the import on line 2:
```ts
import { getByLang, resolveParagraph, resolveTechStacks } from '@/helpers';
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/data && bun run test`
Expected: FAIL — `resolveParagraph` is not exported

- [ ] **Step 3: Implement resolveParagraph**

In `packages/data/src/helpers.ts`, add:

```ts
export function resolveParagraph(p: { value: string; keywords: string[] }): string {
	return p.keywords.reduce((text, kw, i) => text.replace(`{${i}}`, kw), p.value);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd packages/data && bun run test`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add packages/data/src/helpers.ts packages/data/tests/helpers.test.ts
git commit -m "feat(data): add resolveParagraph helper for template interpolation"
```

---

### Task 6: Redesign Resume Template

**Files:**
- Modify: `apps/api/src/templates/resume.ts` (complete rewrite)
- Modify: `apps/api/tests/templates/resume.test.ts` (complete rewrite)

- [ ] **Step 1: Write failing tests with new ResumeData shape**

Replace `apps/api/tests/templates/resume.test.ts` entirely:

```ts
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
		expect(html).toContain("Bachelor&#39;s — Computer Science");
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
		const privateIdx = html.indexOf('Private Project');
		const nextProject = html.indexOf('</div>', privateIdx + 200);
		const section = html.slice(privateIdx, nextProject);
		expect(section).not.toContain('See Demo');
		expect(section).not.toContain('Source Code');
	});

	it('does not contain summary section', () => {
		const html = generateResumeHTML(mockData);
		expect(html).not.toContain('>Summary<');
	});

	it('renders section headers in uppercase', () => {
		const html = generateResumeHTML(mockData);
		expect(html).toContain('WORK EXPERIENCES');
		expect(html).toContain('EDUCATIONS');
		expect(html).toContain('SKILLS');
		expect(html).toContain('PORTFOLIOS');
	});
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd apps/api && bun run test -- tests/templates/resume.test.ts`
Expected: FAIL — old `ResumeData` shape doesn't match

- [ ] **Step 3: Implement the new template**

Replace `apps/api/src/templates/resume.ts` entirely:

```ts
interface ResumeData {
	name: string;
	contacts: string[];
	experience: {
		company: string;
		companyUrl: string | null;
		positions: {
			title: string;
			duration: string;
			location: string;
			points: string[];
		}[];
	}[];
	education: {
		institution: string;
		institutionUrl: string | null;
		degree: string;
		duration: string;
		location: string;
		points: string[];
	}[];
	skills: Record<string, string[]>;
	portfolios: {
		name: string;
		description: string;
		technologies: string[];
		demo: string | null;
		source: string | null;
	}[];
}

function escapeHtml(text: string): string {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
}

export function generateResumeHTML(data: ResumeData): string {
	const contactLine = data.contacts.map((c) => escapeHtml(c)).join('<span class="sep">|</span>');

	const experienceHtml = data.experience
		.map((job) => {
			const companyName = job.companyUrl
				? `<a href="${escapeHtml(job.companyUrl)}" class="company-link">${escapeHtml(job.company).toUpperCase()}</a>`
				: `<span>${escapeHtml(job.company).toUpperCase()}</span>`;

			return job.positions
				.map(
					(pos, i) => `
		<div class="position">
			<div class="row">${i === 0 ? `<strong>${companyName}</strong>` : '<strong></strong>'}<span class="right">${escapeHtml(pos.duration)}</span></div>
			<div class="row"><em>${escapeHtml(pos.title)}</em><span class="right"><em>${escapeHtml(pos.location)}</em></span></div>
			${pos.points.length > 0 ? `<ul>${pos.points.map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul>` : ''}
		</div>`,
				)
				.join('');
		})
		.join('');

	const educationHtml = data.education
		.map((edu) => {
			const instName = edu.institutionUrl
				? `<a href="${escapeHtml(edu.institutionUrl)}" class="company-link">${escapeHtml(edu.institution).toUpperCase()}</a>`
				: `<span>${escapeHtml(edu.institution).toUpperCase()}</span>`;

			return `
		<div class="position">
			<div class="row"><strong>${instName}</strong><span class="right">${escapeHtml(edu.duration)}</span></div>
			<div class="row"><em>${escapeHtml(edu.degree)}</em><span class="right"><em>${escapeHtml(edu.location)}</em></span></div>
			${edu.points.length > 0 ? `<ul>${edu.points.map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul>` : ''}
		</div>`;
		})
		.join('');

	const skillsHtml = Object.entries(data.skills)
		.map(([category, items]) => `<div class="skill-row"><strong>${escapeHtml(category)}:</strong>${items.map((s) => escapeHtml(s)).join(', ')}</div>`)
		.join('');

	const portfoliosHtml = data.portfolios
		.map((p) => {
			const links: string[] = [];
			if (p.demo) links.push(`<a href="${escapeHtml(p.demo)}" class="project-link">See Demo</a>`);
			if (p.source) links.push(`<a href="${escapeHtml(p.source)}" class="project-link">Source Code</a>`);

			return `
		<div class="project">
			<div class="project-name">${escapeHtml(p.name).toUpperCase()}</div>
			<div class="project-desc">${escapeHtml(p.description)}</div>
			<div class="project-tech"><em>Technologies: ${p.technologies.map((t) => escapeHtml(t)).join(', ')}</em></div>
			${links.length > 0 ? `<div class="project-links">${links.join('  ')}</div>` : ''}
		</div>`;
		})
		.join('');

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 11px;
      line-height: 1.5;
      color: #000;
      padding: 40px 50px;
    }
    a { color: #000; text-decoration: none; }
    .header { text-align: center; margin-bottom: 10px; }
    .header h1 { font-size: 20px; font-weight: 700; letter-spacing: 1px; margin-bottom: 4px; }
    .contact-line { font-size: 10px; }
    .contact-line .sep { margin: 0 6px; }
    h2 {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #000;
      padding-bottom: 2px;
      margin: 14px 0 6px;
    }
    .position { margin-bottom: 6px; }
    .row { display: flex; justify-content: space-between; align-items: baseline; }
    .right { text-align: right; white-space: nowrap; }
    .company-link { font-weight: 700; }
    ul { padding-left: 16px; margin-top: 2px; }
    li { margin-bottom: 1px; }
    .skill-row { margin-bottom: 2px; }
    .skill-row strong { margin-right: 4px; }
    .project { margin-bottom: 8px; }
    .project-name { font-weight: 700; }
    .project-desc { margin: 2px 0; }
    .project-tech { margin: 2px 0; }
    .project-link { text-decoration: underline; margin-right: 12px; }
    .project-links { margin-top: 2px; }
    @page { size: A4; margin: 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${escapeHtml(data.name).toUpperCase()}</h1>
    <div class="contact-line">${contactLine}</div>
  </div>

  <h2>WORK EXPERIENCES</h2>
  ${experienceHtml}

  <h2>EDUCATIONS</h2>
  ${educationHtml}

  <h2>SKILLS</h2>
  ${skillsHtml}

  <h2>PORTFOLIOS</h2>
  ${portfoliosHtml}
</body>
</html>`;
}

export type { ResumeData };
```

- [ ] **Step 4: Run template tests**

Run: `cd apps/api && bun run test -- tests/templates/resume.test.ts`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/templates/resume.ts apps/api/tests/templates/resume.test.ts
git commit -m "feat(api): redesign resume HTML template with serif styling"
```

---

### Task 7: Update Resume Route Data Mapping

**Files:**
- Modify: `apps/api/src/routes/resume.ts`
- Test: `apps/api/tests/routes/resume.test.ts` (verify existing tests still pass)

- [ ] **Step 1: Rewrite getResumeData with new mapping**

Replace `apps/api/src/routes/resume.ts`:

```ts
import type { ResumeData } from '@/templates/resume';
import { generateResumeHTML } from '@/templates/resume';
import type { LangCode } from '@irfnd/data';
import { contact, education, experience, getByLang, portfolio, profile, resolveParagraph, technology } from '@irfnd/data';
import { Hono } from 'hono';

function formatContactSlug(url: string): string {
	return url
		.replace(/^https?:\/\//, '')
		.replace(/^mailto:/, '')
		.replace(/\/$/, '');
}

function getResumeData(lang: string): ResumeData {
	const l = (lang === 'id' ? 'id' : 'en') as LangCode;
	const p = getByLang(profile, l);
	const exp = getByLang(experience, l);
	const edu = getByLang(education, l);
	const tech = getByLang(technology, l);
	const c = getByLang(contact, l);
	const port = getByLang(portfolio, l);

	const contacts = c.items
		.filter((i) => i.showInResume)
		.map((i) => (i.type === 'location' ? i.label : formatContactSlug(i.url)));

	return {
		name: `${p.firstName} ${p.lastName}`,
		contacts,
		experience: exp.jobs.map((job) => ({
			company: job.company,
			companyUrl: job.link,
			positions: job.descriptions.map((desc) => ({
				title: desc.position,
				duration: (desc.duration ?? job.duration).join(' - '),
				location: job.location,
				points: [...desc.summary, ...desc.points].map((pt) => resolveParagraph(pt)),
			})),
		})),
		education: edu.educations.map((e) => ({
			institution: e.institution,
			institutionUrl: e.link,
			degree: `${e.degree} — ${e.fieldOfStudy}`,
			duration: e.duration.join(' - '),
			location: e.location,
			points: [
				...e.award.map((a) => a.label),
				...e.summary.map((s) => resolveParagraph(s)),
			],
		})),
		skills: tech.stacks,
		portfolios: port.projects
			.filter((proj) => proj.isSelected)
			.map((proj) => ({
				name: proj.name,
				description: proj.summary.map((s) => resolveParagraph(s)).join(' '),
				technologies: proj.stacks,
				demo: proj.demo,
				source: proj.source,
			})),
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

- [ ] **Step 2: Run route tests**

Run: `cd apps/api && bun run test -- tests/routes/resume.test.ts`
Expected: All 5 tests pass (they test HTTP status/headers, not HTML content)

- [ ] **Step 3: Run all API tests**

Run: `cd apps/api && bun run test`
Expected: All tests pass with 100% coverage

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/routes/resume.ts
git commit -m "feat(api): update resume route with new data mapping and portfolio support"
```

---

### Task 8: Full Verification and Coverage

**Files:** (no new changes — verification only)

- [ ] **Step 1: Run all data package tests with coverage**

Run: `cd packages/data && bun run test:coverage`
Expected: All tests pass, 100% coverage

- [ ] **Step 2: Run all API tests with coverage**

Run: `cd apps/api && bun run test:coverage`
Expected: All tests pass, 100% coverage

- [ ] **Step 3: Run all web tests**

Run: `cd apps/web && bun run test`
Expected: All tests pass

- [ ] **Step 4: Build both apps**

Run: `cd apps/web && bun run build && cd ../api && bun run build`
Expected: Both build successfully

- [ ] **Step 5: Run full monorepo test suite**

Run: `bun run test:run` (from repo root)
Expected: All tests pass across all 3 packages

- [ ] **Step 6: Final commit if any fixes were needed**

If any fixes were made during verification:
```bash
git add -A
git commit -m "fix: address verification issues in resume template redesign"
```
