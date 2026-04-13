# Content Collections Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all content from TypeScript i18n files (`en.ts`, `id.ts`, `tech-stack-list.ts`) to Astro Content Collections with JSON data files, Zod schemas, and `getEntry()` queries.

**Architecture:** 11 content collections using Astro's `file()` loader with one JSON file per collection. Object keys (`en`/`id`) serve as entry IDs for i18n collections; tech-stacks uses `all` as its single entry ID. Zod schemas in `content.config.ts` replace TypeScript interfaces in `types/i18n.ts`. Components switch from `useTranslations(lang).section` to `(await getEntry('collection', lang))!.data`. Tech stack labels in JSON are resolved to full objects at render time via `resolveTechStacks()`.

**Tech Stack:** Astro 6 Content Collections, Zod (via `astro/zod`), `file()` loader from `astro/loaders`, Bun

**Spec:** `docs/superpowers/specs/2026-04-13-content-collections-design.md`

---

## Implementation Note: File Structure Refinement

The design spec defines separate `en.json`/`id.json` files per subdirectory. This plan uses a **single JSON file per collection** with the `file()` loader instead, because:

1. Astro's `file()` loader natively supports object-keyed JSON (`{ "en": {...}, "id": {...} }`) where keys become entry IDs
2. Fewer files to manage (11 vs 22 for i18n data)
3. Easier to keep both languages in sync
4. No need for `glob()` loader (which is primarily for markdown/frontmatter files)

The schemas, types, and query patterns remain exactly as specified.

---

## File Map

### Files to Create

| File | Purpose |
|------|---------|
| `src/content/data/tech-stacks.json` | 30 tech stack items (language-independent) |
| `src/content/data/navigation.json` | Nav items (en/id) |
| `src/content/data/contact.json` | Contact info (en/id) |
| `src/content/data/profile.json` | Profile data (en/id) |
| `src/content/data/about.json` | About section (en/id) |
| `src/content/data/experience.json` | Work experience (en/id) |
| `src/content/data/technology.json` | Tech categories (en/id) |
| `src/content/data/portfolio.json` | Projects (en/id) |
| `src/content/data/education.json` | Education entries (en/id) |
| `src/content/data/contact-form.json` | Contact form config (en/id) |
| `src/content/data/ui.json` | SEO, footer, common strings (en/id) |
| `src/utils/tech-stacks.ts` | `resolveTechStacks()` utility |
| `tests/utils/tech-stacks.test.ts` | Tests for resolveTechStacks |
| `scripts/convert-content.ts` | One-time conversion script (deleted after use) |

### Files to Modify

| File | Change |
|------|--------|
| `src/content.config.ts` | Add 11 collection definitions with Zod schemas |
| `src/i18n/index.ts` | Remove `en`/`id` imports, `useTranslations` re-export, `translations` map |
| `src/i18n/utils.ts` | Remove `useTranslations`, `en`/`id` imports, `translations` map |
| `src/utils/text.ts` | Replace `IParagraph` import with local `Paragraph` interface |
| `src/utils/portfolio.ts` | Make `sortProjects` generic, remove `IPortfolio` import |
| `src/layouts/BaseLayout.astro` | Use `getEntry('profile', lang)` |
| `src/components/layout/Footer.astro` | Use `getEntry('ui', lang)` + `getEntry('contact', lang)` |
| `src/components/layout/StickyProfile.astro` | Use `getEntry('profile', lang)` + `getEntry('contact', lang)` |
| `src/components/layout/NavigationMenu.astro` | Use `getEntry('navigation', lang)` |
| `src/components/layout/LanguageSwitcher.astro` | Use `getEntry('ui', lang)` |
| `src/components/layout/ThemeSwitcher.astro` | Use `getEntry('ui', lang)` |
| `src/components/page/home/ProfileFocus.astro` | Use `getEntry('about', lang)` |
| `src/components/page/home/ProfessionalJourney.astro` | Use `getEntry('experience', lang)` + resolve stacks |
| `src/components/page/home/TechnicalStack.astro` | Use `getEntry('technology', lang)` + resolve stacks |
| `src/components/page/home/SelectedWork.astro` | Use `getEntry('portfolio', lang)` + resolve stacks |
| `src/components/page/home/EducationHistory.astro` | Use `getEntry('education', lang)` |
| `src/components/ui/ContactForm.astro` | Replace `IContactValidation`/`IFormField` imports with local interfaces |
| `src/pages/en/index.astro` | Use `getEntry()` for profile, SEO, UI |
| `src/pages/id/index.astro` | Same changes as en/index.astro |
| `src/pages/en/portfolio.astro` | Use `getEntry()` for portfolio, UI + resolve stacks |
| `src/pages/id/portfolio.astro` | Same changes as en/portfolio.astro |
| `src/pages/en/contact.astro` | Use `getEntry()` for contact-form, contact, UI |
| `src/pages/id/contact.astro` | Same changes as en/contact.astro |
| `tests/i18n/translations.test.ts` | Rewrite to validate JSON content files |
| `tests/i18n/utils.test.ts` | Remove `useTranslations` tests |
| `tests/contents/tech-stack-list.test.ts` | Rewrite for `resolveTechStacks` |
| `tests/utils/text.test.ts` | Update — no import changes needed (tests use inline objects) |
| `tests/utils/portfolio.test.ts` | Update — remove `IPortfolio` import, use inline types |

### Files to Delete

| File | Reason |
|------|--------|
| `src/i18n/en.ts` | Content moved to JSON files |
| `src/i18n/id.ts` | Content moved to JSON files |
| `src/types/i18n.ts` | Types replaced by Zod schema inference |
| `src/contents/tech-stack-list.ts` | Data moved to `tech-stacks.json` |
| `src/contents/index.ts` | Barrel file for deleted module |
| `scripts/convert-content.ts` | One-time script, deleted after use |

---

## Dependency Graph

```
Task 1 (schemas) → Task 2 (JSON data) → Task 3 (tech-stacks utility)
                                              ↓
                            ┌─────────────────┼─────────────────┐
                            ↓                 ↓                 ↓
                     Task 4 (layouts)  Task 5 (home)     Task 6 (pages)
                            └─────────────────┼─────────────────┘
                                              ↓
                                    Task 7 (utilities + ContactForm)
                                              ↓
                                    Task 8 (cleanup old files)
                                              ↓
                                    Task 9 (rewrite tests)
                                              ↓
                                    Task 10 (build + coverage)
```

Tasks 4, 5, and 6 can run in parallel after Task 3 completes.

---

## Task 1: Content Schemas

**Files:**
- Modify: `apps/web/src/content.config.ts`

- [ ] **Step 1: Write the content config with all 11 collection schemas**

Replace the empty content config with full schema definitions:

```typescript
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file } from 'astro/loaders';

// --- Reusable sub-schemas ---

const imageSchema = z.object({
	url: z.string(),
	alt: z.string(),
});

const paragraphSchema = z.object({
	value: z.string(),
	keywords: z.array(z.string()),
});

const techStackItemSchema = z.object({
	label: z.string(),
	url: z.string(),
	icon: z.string(),
	color: z.string().optional(),
	border: z.string().optional(),
	customColor: z.boolean().optional(),
});

const awardSchema = z.object({
	label: z.string(),
	description: z.string(),
	icon: z.string(),
});

// --- Collections ---

const techStacks = defineCollection({
	loader: file('src/content/data/tech-stacks.json'),
	schema: z.object({
		stacks: z.array(techStackItemSchema),
	}),
});

const navigation = defineCollection({
	loader: file('src/content/data/navigation.json'),
	schema: z.object({
		items: z.array(
			z.object({
				label: z.string(),
				url: z.string(),
				icon: z.string(),
			}),
		),
	}),
});

const contact = defineCollection({
	loader: file('src/content/data/contact.json'),
	schema: z.object({
		items: z.array(
			z.object({
				type: z.enum(['location', 'contact']),
				label: z.string(),
				url: z.string(),
				icon: z.string(),
				showInStickyProfile: z.boolean().optional(),
				showInContactPage: z.boolean().optional(),
				showInFooter: z.boolean().optional(),
			}),
		),
	}),
});

const profile = defineCollection({
	loader: file('src/content/data/profile.json'),
	schema: z.object({
		firstName: z.string(),
		lastName: z.string(),
		role: z.string(),
		photo: imageSchema,
		description: z.string(),
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
			}),
		),
	}),
});

const experience = defineCollection({
	loader: file('src/content/data/experience.json'),
	schema: z.object({
		title: z.string(),
		jobs: z.array(
			z.object({
				company: z.string(),
				mainPosition: z.string(),
				type: z.string(),
				location: z.string(),
				duration: z.array(z.string()),
				link: z.string().nullable(),
				descriptions: z.array(
					z.object({
						icon: z.string().optional(),
						position: z.string(),
						summary: z.array(paragraphSchema),
						points: z.array(paragraphSchema),
						stacks: z.array(z.string()),
					}),
				),
			}),
		),
	}),
});

const technology = defineCollection({
	loader: file('src/content/data/technology.json'),
	schema: z.object({
		title: z.string(),
		stacks: z.record(z.string(), z.array(z.string())),
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
			}),
		),
	}),
});

const education = defineCollection({
	loader: file('src/content/data/education.json'),
	schema: z.object({
		title: z.string(),
		educations: z.array(
			z.object({
				institution: z.string(),
				degree: z.string(),
				fieldOfStudy: z.string(),
				location: z.string(),
				duration: z.array(z.string()),
				link: z.string().nullable(),
				summary: z.array(paragraphSchema),
				points: z.array(paragraphSchema),
				award: z.array(awardSchema),
			}),
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
			}),
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
			fullName: z.object({ min: z.string(), max: z.string() }),
			email: z.object({ invalid: z.string() }),
			telephone: z.object({ min: z.string(), max: z.string() }),
			subject: z.object({ min: z.string(), max: z.string() }),
			message: z.object({ min: z.string(), max: z.string() }),
		}),
	}),
});

const ui = defineCollection({
	loader: file('src/content/data/ui.json'),
	schema: z.object({
		seo: z.object({
			home: z.object({ title: z.string(), description: z.string() }),
			portfolio: z.object({ title: z.string(), description: z.string() }),
			contact: z.object({ title: z.string(), description: z.string() }),
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
				}),
			),
		}),
	}),
});

export const collections = {
	'tech-stacks': techStacks,
	navigation,
	contact,
	profile,
	about,
	experience,
	technology,
	portfolio,
	education,
	'contact-form': contactForm,
	ui,
};
```

- [ ] **Step 2: Create the data directory**

Run:
```bash
mkdir -p apps/web/src/content/data
```

- [ ] **Step 3: Commit**

```bash
cd apps/web && git add src/content.config.ts src/content/data && git commit -m "feat(web): add content collection schemas for 11 collections"
```

---

## Task 2: Generate JSON Data Files

**Files:**
- Create: `apps/web/scripts/convert-content.ts` (temporary)
- Create: `apps/web/src/content/data/*.json` (11 files)

This task uses a Bun script to extract content from the existing TypeScript i18n files and write properly-structured JSON files. This avoids manual transcription of ~1440 lines of content data.

- [ ] **Step 1: Write the conversion script**

Create `apps/web/scripts/convert-content.ts`:

```typescript
import { en } from '../src/i18n/en';
import { id } from '../src/i18n/id';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const dataDir = join(import.meta.dirname, '../src/content/data');
mkdirSync(dataDir, { recursive: true });

function write(name: string, data: unknown) {
	writeFileSync(join(dataDir, `${name}.json`), JSON.stringify(data, null, '\t') + '\n');
	console.log(`✓ ${name}.json`);
}

function stackLabels(stacks: Array<{ label: string }>): string[] {
	return stacks.map((s) => s.label);
}

// --- tech-stacks (language-independent) ---
// Collect ALL unique tech stack objects from every section that uses them
const allStacksMap = new Map<string, (typeof en.technology.stacks)[string][number]>();

for (const stacks of Object.values(en.technology.stacks)) {
	for (const stack of stacks) allStacksMap.set(stack.label, stack);
}
for (const job of en.experience.jobs) {
	for (const desc of job.descriptions) {
		for (const stack of desc.stacks) allStacksMap.set(stack.label, stack);
	}
}
for (const project of en.portfolio.projects) {
	for (const stack of project.stacks) allStacksMap.set(stack.label, stack);
}

write('tech-stacks', {
	all: { stacks: Array.from(allStacksMap.values()) },
});

// --- Simple collections (no tech stack conversion needed) ---
write('navigation', {
	en: { items: en.navigation },
	id: { items: id.navigation },
});

write('contact', {
	en: { items: en.contact },
	id: { items: id.contact },
});

write('profile', {
	en: en.profile,
	id: id.profile,
});

write('about', {
	en: en.about,
	id: id.about,
});

write('education', {
	en: en.education,
	id: id.education,
});

write('contact-form', {
	en: en.contactMe,
	id: id.contactMe,
});

write('ui', {
	en: { seo: en.seo, footer: en.footer, common: en.common },
	id: { seo: id.seo, footer: id.footer, common: id.common },
});

// --- Collections with tech stack object → label conversion ---

function convertExperience(exp: typeof en.experience) {
	return {
		title: exp.title,
		jobs: exp.jobs.map((job) => ({
			...job,
			descriptions: job.descriptions.map((desc) => ({
				...desc,
				stacks: stackLabels(desc.stacks),
			})),
		})),
	};
}

write('experience', {
	en: convertExperience(en.experience),
	id: convertExperience(id.experience),
});

function convertTechnology(tech: typeof en.technology) {
	const stacks: Record<string, string[]> = {};
	for (const [category, items] of Object.entries(tech.stacks)) {
		stacks[category] = stackLabels(items);
	}
	return { title: tech.title, stacks };
}

write('technology', {
	en: convertTechnology(en.technology),
	id: convertTechnology(id.technology),
});

function convertPortfolio(p: typeof en.portfolio) {
	return {
		header: p.header,
		title: p.title,
		subtitle: p.subtitle,
		projects: p.projects.map((project) => ({
			...project,
			stacks: stackLabels(project.stacks),
		})),
	};
}

write('portfolio', {
	en: convertPortfolio(en.portfolio),
	id: convertPortfolio(id.portfolio),
});

console.log('\nDone! All 11 JSON files generated.');
```

- [ ] **Step 2: Run the conversion script**

Run:
```bash
cd apps/web && bun run scripts/convert-content.ts
```

Expected: 11 `✓ <name>.json` lines followed by "Done! All 11 JSON files generated."

- [ ] **Step 3: Verify the generated data with Astro sync**

Run:
```bash
cd apps/web && bunx astro sync
```

Expected: No errors. If Astro reports schema validation errors, inspect the specific JSON file and fix.

- [ ] **Step 4: Spot-check a few JSON files**

Verify `src/content/data/tech-stacks.json` has an `"all"` key with `"stacks"` array containing 30 items.
Verify `src/content/data/profile.json` has `"en"` and `"id"` keys with `firstName`, `lastName`, `role`, `photo`, `description`.
Verify `src/content/data/experience.json` has stacks as string arrays (e.g., `["TypeScript", "Express.js", "NestJS", "PostgreSQL", "Swagger"]`), NOT full objects.

- [ ] **Step 5: Delete the conversion script**

```bash
rm apps/web/scripts/convert-content.ts
rmdir apps/web/scripts 2>/dev/null || true
```

- [ ] **Step 6: Commit**

```bash
cd apps/web && git add src/content/data/ && git commit -m "feat(web): generate JSON content files for 11 collections"
```

---

## Task 3: Tech Stacks Resolution Utility

**Files:**
- Create: `apps/web/src/utils/tech-stacks.ts`
- Create: `apps/web/tests/utils/tech-stacks.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/tests/utils/tech-stacks.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';
import { resolveTechStacks } from '@/utils/tech-stacks';

const allStacks = [
	{ label: 'React', url: 'https://reactjs.org/', icon: 'simple-icons:react', color: '#61DAFB' },
	{ label: 'TypeScript', url: 'https://www.typescriptlang.org/', icon: 'simple-icons:typescript', color: '#3178C6' },
	{ label: 'Docker', url: 'https://www.docker.com/', icon: 'simple-icons:docker', color: '#2496ED' },
];

describe('resolveTechStacks', () => {
	it('resolves labels to matching tech stack objects', () => {
		const result = resolveTechStacks(allStacks, ['React', 'Docker']);
		expect(result).toHaveLength(2);
		expect(result[0].label).toBe('React');
		expect(result[1].label).toBe('Docker');
	});

	it('preserves the order of the labels array', () => {
		const result = resolveTechStacks(allStacks, ['Docker', 'React']);
		expect(result.map((s) => s.label)).toEqual(['Docker', 'React']);
	});

	it('skips labels that do not match any stack', () => {
		const result = resolveTechStacks(allStacks, ['React', 'NonExistent', 'Docker']);
		expect(result).toHaveLength(2);
		expect(result.map((s) => s.label)).toEqual(['React', 'Docker']);
	});

	it('returns empty array for empty labels', () => {
		expect(resolveTechStacks(allStacks, [])).toEqual([]);
	});

	it('returns empty array when allStacks is empty', () => {
		expect(resolveTechStacks([], ['React'])).toEqual([]);
	});

	it('preserves all properties of matched stacks', () => {
		const [item] = resolveTechStacks(allStacks, ['TypeScript']);
		expect(item).toEqual({
			label: 'TypeScript',
			url: 'https://www.typescriptlang.org/',
			icon: 'simple-icons:typescript',
			color: '#3178C6',
		});
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
cd apps/web && bunx vitest run tests/utils/tech-stacks.test.ts
```

Expected: FAIL — `Cannot find module '@/utils/tech-stacks'`

- [ ] **Step 3: Write the implementation**

Create `apps/web/src/utils/tech-stacks.ts`:

```typescript
export function resolveTechStacks<T extends { label: string }>(allStacks: readonly T[], labels: string[]): T[] {
	return labels.map((label) => allStacks.find((s) => s.label === label)).filter((s): s is T => s !== undefined);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
cd apps/web && bunx vitest run tests/utils/tech-stacks.test.ts
```

Expected: All 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd apps/web && git add src/utils/tech-stacks.ts tests/utils/tech-stacks.test.ts && git commit -m "feat(web): add resolveTechStacks utility with tests"
```

---

## Task 4: Migrate Layout Components

**Files:**
- Modify: `apps/web/src/layouts/BaseLayout.astro`
- Modify: `apps/web/src/components/layout/Footer.astro`
- Modify: `apps/web/src/components/layout/StickyProfile.astro`
- Modify: `apps/web/src/components/layout/NavigationMenu.astro`
- Modify: `apps/web/src/components/layout/LanguageSwitcher.astro`
- Modify: `apps/web/src/components/layout/ThemeSwitcher.astro`

- [ ] **Step 1: Migrate BaseLayout.astro**

Replace the frontmatter (lines 1-31):

```astro
---
import '@/index.css';

import { getLangFromUrl } from '@/i18n';
import { getEntry } from 'astro:content';

import Footer from '@/components/layout/Footer.astro';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher.astro';
import NavigationMenu from '@/components/layout/NavigationMenu.astro';
import StickyProfile from '@/components/layout/StickyProfile.astro';
import ThemeSwitcher from '@/components/layout/ThemeSwitcher.astro';
import SEO from '@/components/common/SEO.astro';
import JsonLd from '@/components/common/JsonLd.astro';

interface Props {
	title: string;
	description?: string;
}

const lang = getLangFromUrl(Astro.url);
const profileData = (await getEntry('profile', lang))!.data;
const { title, description = `${profileData.firstName} ${profileData.lastName} — ${profileData.role}` } = Astro.props;

const site = Astro.site?.origin ?? 'https://irfnd.id';
const websiteSchema = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: 'Irfandi Iqbal Abimanyu',
	url: site,
	inLanguage: ['en', 'id'],
};
---
```

The template (lines 33-101) stays unchanged.

- [ ] **Step 2: Migrate Footer.astro**

Replace the entire frontmatter:

```astro
---
import { getLangFromUrl } from '@/i18n';
import { getEntry } from 'astro:content';

const lang = getLangFromUrl(Astro.url);
const { footer } = (await getEntry('ui', lang))!.data;
const contactItems = (await getEntry('contact', lang))!.data.items;

const currentYear = new Date().getFullYear();
const footerContact = contactItems.filter((item) => item.showInFooter);
---
```

The template stays unchanged.

- [ ] **Step 3: Migrate StickyProfile.astro**

Replace the entire frontmatter:

```astro
---
import { Icon } from 'astro-icon/components';
import { getLangFromUrl } from '@/i18n';
import { getEntry } from 'astro:content';
import { cloudinaryResize } from '@/utils/cloudinary';

const lang = getLangFromUrl(Astro.url);
const profile = (await getEntry('profile', lang))!.data;
const contactItems = (await getEntry('contact', lang))!.data.items;

const stickyProfileContact = contactItems.filter((item) => item.showInStickyProfile);
---
```

The template stays unchanged — it already references `profile.firstName`, `profile.lastName`, etc.

- [ ] **Step 4: Migrate NavigationMenu.astro**

Replace the frontmatter (lines 1-27):

```astro
---
import { Icon } from 'astro-icon/components';
import { getLangFromUrl, getLocalizedPath } from '@/i18n';
import { getEntry } from 'astro:content';
import { cn } from '@/utils/cn';

const lang = getLangFromUrl(Astro.url);
const { items: navigation } = (await getEntry('navigation', lang))!.data;
const currentPath = Astro.url.pathname;

const baseClassName =
	'group w-full flex flex-col lg:flex-row items-center gap-1 lg:gap-3 p-2 rounded-xl transition-colors duration-300 flex-1 lg:flex-none justify-center lg:justify-start outline-none focus-visible:ring focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500';
const activeClassName = 'bg-white/80 dark:bg-secondary text-foreground';
const inactiveClassName =
	'hover:bg-white/60 dark:hover:bg-secondary focus-visible:bg-white/60 dark:focus-visible:bg-secondary';

const baseIconClassName =
	'size-8 flex items-center justify-center rounded-lg border transition-colors shadow-sm';
const activeIconClassName =
	'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400';
const inactiveIconClassName =
	'bg-transparent lg:bg-white/80 lg:dark:bg-secondary border-transparent lg:border-border text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-200 dark:group-hover:border-blue-900 group-focus-visible:text-blue-600 dark:group-focus-visible:text-blue-400 group-focus-visible:border-blue-200 dark:group-focus-visible:border-blue-900';

const baseLabelClassName = 'text-[10px] lg:text-sm font-medium transition-colors';
const activeLabelClassName = 'text-foreground';
const inactiveLabelClassName =
	'text-muted-foreground/80 group-hover:text-foreground group-focus-visible:text-foreground';
---
```

The template stays unchanged — it already iterates `navigation`.

- [ ] **Step 5: Migrate LanguageSwitcher.astro**

Replace the entire frontmatter:

```astro
---
import { Icon } from 'astro-icon/components';
import { getLangFromUrl, languages } from '@/i18n';
import { getEntry } from 'astro:content';

const lang = getLangFromUrl(Astro.url);
const { common } = (await getEntry('ui', lang))!.data;
const currentLang = languages.find((l) => l.code === lang);
const label = common.changeLanguage;
---
```

The template stays unchanged.

- [ ] **Step 6: Migrate ThemeSwitcher.astro**

Replace the entire frontmatter:

```astro
---
import { Icon } from 'astro-icon/components';
import { getLangFromUrl } from '@/i18n';
import { getEntry } from 'astro:content';

const lang = getLangFromUrl(Astro.url);
const { common } = (await getEntry('ui', lang))!.data;
const label = common.changeTheme;
---
```

The template stays unchanged.

- [ ] **Step 7: Verify build**

Run:
```bash
cd apps/web && bunx astro build
```

Expected: Build succeeds with no errors. Warnings about unused imports in other files are expected at this stage.

- [ ] **Step 8: Commit**

```bash
cd apps/web && git add src/layouts/ src/components/layout/ && git commit -m "feat(web): migrate layout components to content collections"
```

---

## Task 5: Migrate Home Page Section Components

**Files:**
- Modify: `apps/web/src/components/page/home/ProfileFocus.astro`
- Modify: `apps/web/src/components/page/home/ProfessionalJourney.astro`
- Modify: `apps/web/src/components/page/home/TechnicalStack.astro`
- Modify: `apps/web/src/components/page/home/SelectedWork.astro`
- Modify: `apps/web/src/components/page/home/EducationHistory.astro`

- [ ] **Step 1: Migrate ProfileFocus.astro**

Replace the entire frontmatter:

```astro
---
import { getLangFromUrl } from '@/i18n';
import { getEntry } from 'astro:content';
import HighlightText from '@/components/ui/HighlightText.astro';
import { Icon } from 'astro-icon/components';

const lang = getLangFromUrl(Astro.url);
const about = (await getEntry('about', lang))!.data;
---
```

The template stays unchanged — it already references `about.title`, `about.description`, `about.focus`.

- [ ] **Step 2: Migrate ProfessionalJourney.astro**

Replace the entire frontmatter:

```astro
---
import { getLangFromUrl } from '@/i18n';
import { getEntry } from 'astro:content';
import { cn } from '@/utils/cn';
import { Icon } from 'astro-icon/components';
import { resolveTechStacks } from '@/utils/tech-stacks';
import HighlightText from '@/components/ui/HighlightText.astro';
import TechIcon from '@/components/ui/TechIcon.astro';
import TimelineBeam from '@/components/ui/TimelineBeam.astro';
import TimelineItem from '@/components/ui/TimelineItem.astro';
import TimelineDot from '@/components/ui/TimelineDot.astro';
import TimelineBadge from '@/components/ui/TimelineBadge.astro';

const lang = getLangFromUrl(Astro.url);
const experienceData = (await getEntry('experience', lang))!.data;
const allStacks = (await getEntry('tech-stacks', 'all'))!.data.stacks;

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

The template stays unchanged — it already references `experience.title`, `experience.jobs`, `desc.stacks` (now resolved to full objects).

- [ ] **Step 3: Migrate TechnicalStack.astro**

Replace the entire frontmatter:

```astro
---
import { getLangFromUrl } from '@/i18n';
import { getEntry } from 'astro:content';
import { resolveTechStacks } from '@/utils/tech-stacks';
import TechIcon from '@/components/ui/TechIcon.astro';

const lang = getLangFromUrl(Astro.url);
const technology = (await getEntry('technology', lang))!.data;
const allStacks = (await getEntry('tech-stacks', 'all'))!.data.stacks;

const stackEntries = Object.entries(technology.stacks)
	.filter(([, labels]) => labels.length > 0)
	.map(([category, labels]) => [category, resolveTechStacks(allStacks, labels)] as const);
---
```

The template stays unchanged — `stackEntries` is the same shape as before: `[category, techStackObjects[]][]`.

- [ ] **Step 4: Migrate SelectedWork.astro**

Replace the entire frontmatter:

```astro
---
import { getLangFromUrl, getLocalizedPath } from '@/i18n';
import { getEntry } from 'astro:content';
import { cn } from '@/utils/cn';
import { Icon } from 'astro-icon/components';
import { resolveTechStacks } from '@/utils/tech-stacks';
import ProjectCard from '@/components/ui/ProjectCard.astro';
import ProjectDialog from '@/components/ui/ProjectDialog.astro';
import ProjectDialogShell from '@/components/ui/ProjectDialogShell.astro';

const lang = getLangFromUrl(Astro.url);
const portfolioData = (await getEntry('portfolio', lang))!.data;
const { common } = (await getEntry('ui', lang))!.data;
const allStacks = (await getEntry('tech-stacks', 'all'))!.data.stacks;

const commonLabels = { source: common.source, liveDemo: common.liveDemo, internal: common.internal };

const selectedProjects = portfolioData.projects
	.filter((project) => project.isSelected)
	.sort((a, b) => a.name.localeCompare(b.name))
	.map((project) => ({ ...project, stacks: resolveTechStacks(allStacks, project.stacks) }));
---
```

In the template, replace `{portfolio.title}` with `{portfolioData.title}`:

Find: `{portfolio.title}` (line 22 of old template)
Replace: `{portfolioData.title}`

The rest of the template stays unchanged — it iterates `selectedProjects` which now has resolved stacks.

- [ ] **Step 5: Migrate EducationHistory.astro**

Replace the entire frontmatter:

```astro
---
import { getLangFromUrl } from '@/i18n';
import { getEntry } from 'astro:content';
import { Icon } from 'astro-icon/components';
import HighlightText from '@/components/ui/HighlightText.astro';
import TimelineBeam from '@/components/ui/TimelineBeam.astro';
import TimelineItem from '@/components/ui/TimelineItem.astro';
import TimelineDot from '@/components/ui/TimelineDot.astro';
import TimelineBadge from '@/components/ui/TimelineBadge.astro';

const lang = getLangFromUrl(Astro.url);
const education = (await getEntry('education', lang))!.data;
---
```

The template stays unchanged.

- [ ] **Step 6: Verify build**

Run:
```bash
cd apps/web && bunx astro build
```

Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
cd apps/web && git add src/components/page/home/ && git commit -m "feat(web): migrate home page components to content collections"
```

---

## Task 6: Migrate Pages

**Files:**
- Modify: `apps/web/src/pages/en/index.astro` (identical to `id/index.astro`)
- Modify: `apps/web/src/pages/id/index.astro`
- Modify: `apps/web/src/pages/en/portfolio.astro` (identical to `id/portfolio.astro`)
- Modify: `apps/web/src/pages/id/portfolio.astro`
- Modify: `apps/web/src/pages/en/contact.astro` (identical to `id/contact.astro`)
- Modify: `apps/web/src/pages/id/contact.astro`

Note: The en and id page variants are **identical** files. Apply the same changes to both.

- [ ] **Step 1: Migrate index.astro (both en and id)**

Replace the full frontmatter in both `src/pages/en/index.astro` and `src/pages/id/index.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import JsonLd from '@/components/common/JsonLd.astro';
import { getLangFromUrl } from '@/i18n';
import { getEntry } from 'astro:content';
import ProfileFocus from '@/components/page/home/ProfileFocus.astro';
import ProfessionalJourney from '@/components/page/home/ProfessionalJourney.astro';
import SelectedWork from '@/components/page/home/SelectedWork.astro';
import TechnicalStack from '@/components/page/home/TechnicalStack.astro';
import EducationHistory from '@/components/page/home/EducationHistory.astro';

const lang = getLangFromUrl(Astro.url);
const profile = (await getEntry('profile', lang))!.data;
const { seo } = (await getEntry('ui', lang))!.data;

const personSchema = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: `${profile.firstName} ${profile.lastName}`,
	jobTitle: profile.role,
	url: 'https://irfnd.id',
	address: {
		'@type': 'PostalAddress',
		addressLocality: 'Jakarta',
		addressCountry: 'ID',
	},
	sameAs: [
		'https://www.linkedin.com/in/irfnd-iqbl',
		'https://github.com/irfnd',
		'https://www.instagram.com/irfnd.iqbl',
	],
};
---
```

Update the template `<BaseLayout>` line:

Find: `<BaseLayout title={t.seo.home.title} description={t.seo.home.description}>`
Replace: `<BaseLayout title={seo.home.title} description={seo.home.description}>`

The rest of the template stays unchanged.

- [ ] **Step 2: Migrate portfolio.astro (both en and id)**

Replace the full frontmatter in both `src/pages/en/portfolio.astro` and `src/pages/id/portfolio.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import { getLangFromUrl } from '@/i18n';
import { getEntry } from 'astro:content';
import { cn } from '@/utils/cn';
import { sortProjects } from '@/utils/portfolio';
import { resolveTechStacks } from '@/utils/tech-stacks';
import ProjectCard from '@/components/ui/ProjectCard.astro';
import ProjectDialog from '@/components/ui/ProjectDialog.astro';
import ProjectDialogShell from '@/components/ui/ProjectDialogShell.astro';

const lang = getLangFromUrl(Astro.url);
const portfolioData = (await getEntry('portfolio', lang))!.data;
const { seo, common } = (await getEntry('ui', lang))!.data;
const allStacks = (await getEntry('tech-stacks', 'all'))!.data.stacks;

const commonLabels = { source: common.source, liveDemo: common.liveDemo, internal: common.internal };
const projects = sortProjects(portfolioData.projects).map((p) => ({
	...p,
	stacks: resolveTechStacks(allStacks, p.stacks),
}));
const categories = common.portfolioCategories;
---
```

Update the template `<BaseLayout>` line:

Find: `<BaseLayout title={seo.portfolio.title} description={seo.portfolio.description}>`

This line already uses `seo.portfolio.title` — just verify it matches the new `seo` variable name. Also update:

Find: `{portfolio.header}` and `{portfolio.subtitle}`
Replace: `{portfolioData.header}` and `{portfolioData.subtitle}`

The rest of the template stays unchanged.

- [ ] **Step 3: Migrate contact.astro (both en and id)**

Replace the full frontmatter in both `src/pages/en/contact.astro` and `src/pages/id/contact.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import { getLangFromUrl } from '@/i18n';
import { getEntry } from 'astro:content';
import ContactForm from '@/components/ui/ContactForm.astro';
import MapEmbed from '@/components/ui/MapEmbed.astro';
import Toast from '@/components/ui/Toast.astro';

const lang = getLangFromUrl(Astro.url);
const contactMe = (await getEntry('contact-form', lang))!.data;
const contactItems = (await getEntry('contact', lang))!.data.items;
const { seo } = (await getEntry('ui', lang))!.data;

const directContact = contactItems
	.filter((c) => c.showInContactPage)
	.map((c) => ({ label: c.label, url: c.url, icon: c.icon }));
---
```

Update the template `<BaseLayout>` line:

Find: `<BaseLayout title={seo.contact.title} description={seo.contact.description}>`

This already uses the correct variable. The rest of the template is unchanged — it already references `contactMe.*` and `directContact`.

- [ ] **Step 4: Verify build**

Run:
```bash
cd apps/web && bunx astro build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
cd apps/web && git add src/pages/ && git commit -m "feat(web): migrate all pages to content collections"
```

---

## Task 7: Update Utilities and ContactForm

**Files:**
- Modify: `apps/web/src/utils/text.ts`
- Modify: `apps/web/src/utils/portfolio.ts`
- Modify: `apps/web/src/components/ui/ContactForm.astro`

- [ ] **Step 1: Update utils/text.ts**

Replace the entire file:

```typescript
export interface Paragraph {
	value: string;
	keywords: string[];
}

export function setHighlightText(text: string, keywords: string[]): Paragraph {
	let result = text;

	keywords.forEach((keyword, index) => {
		const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regex = new RegExp(escapedKeyword, 'g');
		result = result.replace(regex, `{${index}}`);
	});

	return { value: result, keywords };
}

export function resolveText({ value, keywords }: Paragraph): string {
	return keywords.reduce((text, keyword, index) => text.replace(new RegExp(`\\{${index}\\}`, 'g'), keyword), value);
}
```

Note: `setHighlightText` is kept because its tests verify the roundtrip behavior with `resolveText`. It could be removed later if unused.

- [ ] **Step 2: Update utils/portfolio.ts**

Replace the entire file:

```typescript
export function sortProjects<T extends { isSelected?: boolean; name: string }>(projects: T[]): T[] {
	return [...projects].sort((a, b) => {
		if (a.isSelected !== b.isSelected) return a.isSelected ? -1 : 1;
		return a.name.localeCompare(b.name);
	});
}
```

- [ ] **Step 3: Update ContactForm.astro type imports**

In `src/components/ui/ContactForm.astro`, replace line 4:

Find:
```
import type { IContactValidation, IFormField } from '@/types';
```

Replace with:
```typescript
interface IFormField {
	label: string;
	name: string;
	type: 'text' | 'email' | 'tel' | 'textarea';
	placeholder: string;
}

interface IContactValidation {
	fullName: { min: string; max: string };
	email: { invalid: string };
	telephone: { min: string; max: string };
	subject: { min: string; max: string };
	message: { min: string; max: string };
}
```

Remove the import line entirely and place these interfaces before the existing `interface Props` declaration.

- [ ] **Step 4: Verify build**

Run:
```bash
cd apps/web && bunx astro build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
cd apps/web && git add src/utils/text.ts src/utils/portfolio.ts src/components/ui/ContactForm.astro && git commit -m "refactor(web): update utility types and ContactForm for content collections"
```

---

## Task 8: Clean Up Old Files

**Files:**
- Modify: `apps/web/src/i18n/utils.ts`
- Modify: `apps/web/src/i18n/index.ts`
- Delete: `apps/web/src/i18n/en.ts`
- Delete: `apps/web/src/i18n/id.ts`
- Delete: `apps/web/src/types/i18n.ts`
- Modify: `apps/web/src/types/index.ts`
- Delete: `apps/web/src/contents/tech-stack-list.ts`
- Delete: `apps/web/src/contents/index.ts`

- [ ] **Step 1: Update i18n/utils.ts**

Replace the entire file:

```typescript
export type Language = 'en' | 'id';

export function getLangFromUrl(url: URL): Language {
	const [, lang] = url.pathname.split('/');
	if (lang === 'id') return 'id';
	return 'en';
}

export function getLocalizedPath(lang: Language, path: string): string {
	const cleanPath = path.replace(/^\/(en|id)/, '').replace(/^\//, '');
	return `/${lang}/${cleanPath}`;
}
```

- [ ] **Step 2: Update i18n/index.ts**

Replace the entire file:

```typescript
export type { Language } from './utils';
export { getLangFromUrl, getLocalizedPath } from './utils';

export const defaultLanguage = 'en' as const;
export const languages: { code: 'en' | 'id'; label: string; flag: string }[] = [
	{ code: 'en', label: 'English', flag: '🇺🇸' },
	{ code: 'id', label: 'Indonesia', flag: '🇮🇩' },
];
```

- [ ] **Step 3: Delete old content files**

```bash
cd apps/web
rm src/i18n/en.ts src/i18n/id.ts
rm src/types/i18n.ts
rm src/contents/tech-stack-list.ts src/contents/index.ts
rmdir src/contents
```

- [ ] **Step 4: Update types/index.ts barrel**

Replace the entire file:

```typescript
export * from './utility.ts';
```

(Removes the `export * from './i18n'` line since that file is deleted.)

- [ ] **Step 5: Verify build**

Run:
```bash
cd apps/web && bunx astro build
```

Expected: Build succeeds. No remaining imports of deleted files.

- [ ] **Step 6: Commit**

```bash
cd apps/web && git add -A src/i18n/ src/types/ src/contents/ && git commit -m "refactor(web): remove legacy i18n TypeScript files and types"
```

---

## Task 9: Rewrite Tests

**Files:**
- Modify: `apps/web/tests/i18n/translations.test.ts`
- Modify: `apps/web/tests/i18n/utils.test.ts`
- Modify: `apps/web/tests/contents/tech-stack-list.test.ts`
- Modify: `apps/web/tests/utils/portfolio.test.ts`

- [ ] **Step 1: Rewrite translations.test.ts**

Replace the entire file `apps/web/tests/i18n/translations.test.ts`:

```typescript
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
```

- [ ] **Step 2: Rewrite utils.test.ts**

Replace the entire file `apps/web/tests/i18n/utils.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';
import { getLangFromUrl, getLocalizedPath } from '@/i18n/utils';

describe('getLangFromUrl', () => {
	it('returns "en" for English URLs', () => {
		expect(getLangFromUrl(new URL('https://example.com/en/'))).toBe('en');
		expect(getLangFromUrl(new URL('https://example.com/en/portfolio'))).toBe('en');
	});

	it('returns "id" for Indonesian URLs', () => {
		expect(getLangFromUrl(new URL('https://example.com/id/'))).toBe('id');
		expect(getLangFromUrl(new URL('https://example.com/id/contact'))).toBe('id');
	});

	it('defaults to "en" for unknown languages', () => {
		expect(getLangFromUrl(new URL('https://example.com/fr/'))).toBe('en');
		expect(getLangFromUrl(new URL('https://example.com/'))).toBe('en');
	});
});

describe('getLocalizedPath', () => {
	it('creates localized path from clean path', () => {
		expect(getLocalizedPath('en', 'portfolio')).toBe('/en/portfolio');
		expect(getLocalizedPath('id', 'contact')).toBe('/id/contact');
	});

	it('replaces existing language prefix', () => {
		expect(getLocalizedPath('id', '/en/portfolio')).toBe('/id/portfolio');
		expect(getLocalizedPath('en', '/id/contact')).toBe('/en/contact');
	});

	it('handles root path', () => {
		expect(getLocalizedPath('en', '/')).toBe('/en/');
		expect(getLocalizedPath('id', '')).toBe('/id/');
	});
});
```

- [ ] **Step 3: Rewrite tech-stack-list.test.ts**

Replace the entire file `apps/web/tests/contents/tech-stack-list.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';
import { resolveTechStacks } from '@/utils/tech-stacks';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const techStacksFile = join(import.meta.dirname, '../../src/content/data/tech-stacks.json');
const allStacks: Array<{
	label: string;
	url: string;
	icon: string;
	color?: string;
	border?: string;
	customColor?: boolean;
}> = JSON.parse(readFileSync(techStacksFile, 'utf-8')).all.stacks;

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

- [ ] **Step 4: Update portfolio.test.ts**

Replace the entire file `apps/web/tests/utils/portfolio.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';
import { sortProjects } from '@/utils/portfolio';

interface TestProject {
	name: string;
	isSelected?: boolean;
	icon: string;
}

function makeProject(overrides: Partial<TestProject> & Pick<TestProject, 'name'>): TestProject {
	return {
		icon: 'tabler:code',
		isSelected: false,
		...overrides,
	};
}

describe('sortProjects', () => {
	it('puts selected projects first', () => {
		const projects = [makeProject({ name: 'Bravo' }), makeProject({ name: 'Alpha', isSelected: true })];
		const sorted = sortProjects(projects);
		expect(sorted[0].name).toBe('Alpha');
		expect(sorted[1].name).toBe('Bravo');
	});

	it('sorts alphabetically within same selection status', () => {
		const projects = [
			makeProject({ name: 'Charlie', isSelected: true }),
			makeProject({ name: 'Alpha', isSelected: true }),
			makeProject({ name: 'Bravo', isSelected: true }),
		];
		const sorted = sortProjects(projects);
		expect(sorted.map((p) => p.name)).toEqual(['Alpha', 'Bravo', 'Charlie']);
	});

	it('handles empty array', () => {
		expect(sortProjects([])).toEqual([]);
	});

	it('does not mutate the original array', () => {
		const projects = [makeProject({ name: 'Bravo' }), makeProject({ name: 'Alpha' })];
		const original = [...projects];
		sortProjects(projects);
		expect(projects[0].name).toBe(original[0].name);
	});

	it('handles mixed selected/unselected with alphabetical sub-sort', () => {
		const projects = [
			makeProject({ name: 'Delta' }),
			makeProject({ name: 'Alpha', isSelected: true }),
			makeProject({ name: 'Charlie' }),
			makeProject({ name: 'Bravo', isSelected: true }),
		];
		const sorted = sortProjects(projects);
		expect(sorted.map((p) => p.name)).toEqual(['Alpha', 'Bravo', 'Charlie', 'Delta']);
	});
});
```

- [ ] **Step 5: Run all tests**

Run:
```bash
cd apps/web && bunx vitest run
```

Expected: All tests pass. If any fail, fix them before proceeding.

- [ ] **Step 6: Commit**

```bash
cd apps/web && git add tests/ && git commit -m "test(web): rewrite tests for content collections migration"
```

---

## Task 10: Build and Coverage Verification

**Files:** None (verification only)

- [ ] **Step 1: Run full build**

Run:
```bash
cd apps/web && bunx astro build
```

Expected: Clean build with no errors.

- [ ] **Step 2: Run test suite with coverage**

Run:
```bash
cd apps/web && bunx vitest run --coverage
```

Expected: All tests pass with 100% coverage (statements, branches, functions, lines). If coverage drops, identify and test uncovered lines.

- [ ] **Step 3: Fix any coverage gaps**

If any utility files (text.ts, portfolio.ts, tech-stacks.ts) or the i18n module have uncovered lines, add targeted tests. Common gaps:
- `resolveText` roundtrip in `text.test.ts` — already covered
- `sortProjects` edge cases — already covered
- `resolveTechStacks` — already covered in both unit and integration tests
- `getLangFromUrl` / `getLocalizedPath` — already covered

- [ ] **Step 4: Final commit (if any fixes)**

```bash
cd apps/web && git add -A && git commit -m "fix(web): achieve 100% test coverage after content collections migration"
```

---

## Summary

| Task | Description | Est. Steps |
|------|-------------|-----------|
| 1 | Content schemas in `content.config.ts` | 3 |
| 2 | Generate JSON data files via conversion script | 6 |
| 3 | `resolveTechStacks` utility + tests | 5 |
| 4 | Migrate 6 layout components | 8 |
| 5 | Migrate 5 home page section components | 7 |
| 6 | Migrate 6 pages (3 unique × 2 languages) | 5 |
| 7 | Update utilities + ContactForm types | 5 |
| 8 | Clean up old files | 6 |
| 9 | Rewrite tests | 6 |
| 10 | Build + coverage verification | 4 |
| **Total** | | **55 steps** |
