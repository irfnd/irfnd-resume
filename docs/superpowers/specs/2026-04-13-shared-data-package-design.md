# Shared Data Package Design

## Problem

Resume and profile data is duplicated and out of sync between `apps/web` and `apps/api`. The web app has comprehensive, bilingual content collections (3 work experiences, 2 education entries, 31 technologies). The API has a separate `getResumeData()` function with hardcoded, incomplete data — empty experience/education arrays and only 6 skills. The PDF resume generates a nearly empty document.

## Approach

Create a new shared workspace package (`packages/data`, published as `@irfnd/data`) containing resume-relevant data as TypeScript objects with Zod validation. Both apps import from this single source of truth. The web app replaces content collection queries for migrated data with direct imports. The API replaces its hardcoded `getResumeData()` with a mapping from shared data.

## Package Structure

```
packages/data/
  src/
    schemas/              # Zod schemas (one per domain)
      profile.ts
      experience.ts
      education.ts
      technology.ts
      tech-stacks.ts
      contact.ts
      common.ts           # Shared sub-schemas (image, paragraph, etc.)
    collections/          # Typed data objects with i18n (en/id)
      profile.ts
      experience.ts
      education.ts
      technology.ts
      tech-stacks.ts
      contact.ts
    helpers.ts            # getByLang(), resolveTechStacks(), type exports
    index.ts              # Barrel exports
  tests/
    schemas.test.ts       # Validate all data against schemas
    helpers.test.ts       # Test utility functions
  vitest.config.ts
  package.json
  tsconfig.json
```

## Data Scope

### Moving to `packages/data` (6 collections — resume-relevant)

| Collection | Content | Current Source |
|---|---|---|
| `profile` | Name, role, photo, professional tagline | `apps/web/src/content/data/profile.json` |
| `experience` | 3 work experiences with responsibilities and tech stacks | `apps/web/src/content/data/experience.json` |
| `education` | 2 education entries with awards | `apps/web/src/content/data/education.json` |
| `technology` | Tech skills organized by category | `apps/web/src/content/data/technology.json` |
| `tech-stacks` | 31 tech badges with icons, colors, URLs (master lookup) | `apps/web/src/content/data/tech-stacks.json` |
| `contact` | 7 social/contact links with visibility flags | `apps/web/src/content/data/contact.json` |

### Staying in `apps/web` as content collections (5 — web-specific)

| Collection | Reason |
|---|---|
| `navigation` | Menu items — pure web UI |
| `about` | Profile focus section — web presentation only |
| `portfolio` | Project showcase with images — web presentation only |
| `contact-form` | Form config and validation messages |
| `ui` | SEO titles, footer text, common UI strings |

## Schema Design

### Shared Sub-Schemas (`schemas/common.ts`)

Reused across multiple domain schemas, migrated from `content.config.ts`:

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
  border: z.boolean().optional(),
  customColor: z.string().optional(),
});

export const awardSchema = z.object({
  label: z.string(),
  description: z.string(),
  icon: z.string(),
});
```

### Domain Schemas

Each domain schema file exports a Zod schema and inferred TypeScript type. Schema definitions match the existing `content.config.ts` exactly — no changes to data shape.

Example — `schemas/profile.ts`:
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

### I18n Helper (`helpers.ts`)

```ts
export type LangCode = 'en' | 'id';
export type I18nData<T> = Record<LangCode, T>;

export function getByLang<T>(data: I18nData<T>, lang: LangCode): T {
  return data[lang];
}
```

### Tech Stack Resolution (`helpers.ts`)

The `resolveTechStacks()` utility moves from `apps/web/src/utils/tech-stacks.ts` to the shared package since it operates on shared `tech-stacks` data:

```ts
import type { TechStackItem } from './schemas/tech-stacks';

export function resolveTechStacks(
  allStacks: TechStackItem[],
  labels: string[]
): TechStackItem[] {
  return labels
    .map(label => allStacks.find(s => s.label === label))
    .filter((s): s is TechStackItem => s !== undefined);
}
```

## Data Files

Each collection data file exports a typed, validated object. Data is migrated verbatim from the existing JSON files.

Example — `collections/profile.ts`:
```ts
import type { I18nData } from '../helpers';
import type { ProfileData } from '../schemas/profile';

export const profile: I18nData<ProfileData> = {
  en: {
    firstName: 'Irfandi',
    lastName: 'Iqbal Abimanyu',
    role: 'Fullstack Web Developer',
    photo: {
      url: 'https://res.cloudinary.com/...',
      alt: 'Irfandi Iqbal Abimanyu',
    },
    description: 'Results-driven Fullstack Developer...',
  },
  id: {
    firstName: 'Irfandi',
    lastName: 'Iqbal Abimanyu',
    role: 'Fullstack Web Developer',
    photo: {
      url: 'https://res.cloudinary.com/...',
      alt: 'Irfandi Iqbal Abimanyu',
    },
    description: 'Fullstack Developer yang berorientasi pada hasil...',
  },
};
```

Special case — `collections/tech-stacks.ts` is NOT i18n-keyed. It exports a flat array of `TechStackItem[]` since tech labels/icons are language-independent.

## Package Configuration

### `packages/data/package.json`
```json
{
  "name": "@irfnd/data",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "peerDependencies": {
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "vitest": "^3.2.1"
  }
}
```

Follows same pattern as `packages/schemas` — source-level exports, Zod as peer dependency.

### Barrel Exports (`src/index.ts`)

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

## Web App Migration

### Files Affected

12 component/page files that query the 6 migrated collections via `getEntry()`:

| File | Collections Used | Change |
|---|---|---|
| `layouts/BaseLayout.astro` | profile | Replace `getEntry('profile', lang)` |
| `pages/en/index.astro` + `id/index.astro` | profile | Replace `getEntry('profile', lang)` |
| `pages/en/portfolio.astro` + `id/portfolio.astro` | tech-stacks | Replace `getEntry('tech-stacks', 'all')` |
| `pages/en/contact.astro` + `id/contact.astro` | contact | Replace `getEntry('contact', lang)` |
| `components/layout/StickyProfile.astro` | profile, contact | Replace both `getEntry()` calls |
| `components/layout/Footer.astro` | contact | Replace `getEntry('contact', lang)` |
| `components/page/home/ProfessionalJourney.astro` | experience, tech-stacks | Replace both `getEntry()` calls |
| `components/page/home/SelectedWork.astro` | tech-stacks | Replace `getEntry('tech-stacks', 'all')` |
| `components/page/home/TechnicalStack.astro` | technology, tech-stacks | Replace both `getEntry()` calls |
| `components/page/home/EducationHistory.astro` | education | Replace `getEntry('education', lang)` |

### Migration Pattern

```astro
---
// BEFORE
import { getEntry } from 'astro:content';
const profile = await getEntry('profile', lang);

// AFTER
import { getByLang, profile as profileData } from '@irfnd/data';
const profile = getByLang(profileData, lang as LangCode);
---
```

Note: `getEntry()` returns `{ id, data }` where data is the validated content. The shared package exports data directly, so access patterns change from `profile.data.firstName` to `profile.firstName`.

### Content Collection Cleanup

1. Remove 6 JSON files from `src/content/data/`: `profile.json`, `experience.json`, `education.json`, `technology.json`, `tech-stacks.json`, `contact.json`
2. Remove 6 collection definitions from `content.config.ts` (keep the 5 web-specific ones)
3. Remove `src/utils/tech-stacks.ts` (moved to shared package)
4. Update imports in components that used `resolveTechStacks` from `@/utils/tech-stacks`
5. Add `"@irfnd/data": "workspace:*"` to `apps/web/package.json`

## API Migration

### Current State (broken)

```ts
// apps/api/src/routes/resume.ts — getResumeData()
{
  experience: [],  // EMPTY
  education: [],   // EMPTY
  skills: ['TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'Docker'] // only 6
}
```

### Target State

Replace `getResumeData()` with a mapping function that imports from `@irfnd/data`:

```ts
import {
  getByLang, profile, experience, education,
  technology, contact,
} from '@irfnd/data';
import type { LangCode } from '@irfnd/data';

function getResumeData(lang: string): ResumeData {
  const l = (lang === 'id' ? 'id' : 'en') as LangCode;
  const p = getByLang(profile, l);
  const exp = getByLang(experience, l);
  const edu = getByLang(education, l);
  const tech = getByLang(technology, l);
  const c = getByLang(contact, l);

  // Contact items use type: "location" | "contact" and are distinguished by label/icon
  return {
    name: `${p.firstName} ${p.lastName}`,
    role: p.role,
    email: c.items.find(i => i.icon === 'tabler:mail')?.label ?? '',
    location: c.items.find(i => i.type === 'location')?.label ?? '',
    linkedin: c.items.find(i => i.icon === 'tabler:brand-linkedin')?.url ?? '',
    github: c.items.find(i => i.icon === 'tabler:brand-github')?.url ?? '',
    summary: p.description,
    experience: exp.jobs.map(job => ({
      company: job.company,
      position: job.mainPosition,
      duration: job.duration.join(' - '),
      location: job.location,
      points: job.descriptions.flatMap(d => d.points?.map(pt => pt.value) ?? []),
    })),
    education: edu.educations.map(e => ({
      institution: e.institution,
      degree: `${e.degree} - ${e.fieldOfStudy}`,
      duration: e.duration.join(' - '),
      location: e.location ?? '',
    })),
    skills: Object.values(tech.stacks).flat(),
  };
}
```

### Changes

1. Delete hardcoded `getResumeData()` data, replace with shared imports
2. Keep `ResumeData` interface — it's the PDF template's view model
3. Keep `generateResumeHTML()` template unchanged
4. Add `"@irfnd/data": "workspace:*"` to `apps/api/package.json`

## Testing Strategy

### `packages/data` Tests (new)

- **Schema validation tests:** Parse all data objects against their Zod schemas — catches data/schema drift
- **Helper tests:** `getByLang()` returns correct language, `resolveTechStacks()` resolves labels
- **Coverage:** 100% enforced (statements, branches, functions, lines)
- **Runner:** Vitest, matching existing project patterns

### `apps/web` Test Updates

- Mock `@irfnd/data` imports instead of content collection `getEntry()` calls
- Existing component render tests stay largely unchanged — they test UI output, not data source
- Update any tests that directly reference content collection APIs

### `apps/api` Test Updates

- Mock `@irfnd/data` imports in resume route tests
- Test the new mapping function (shared data → `ResumeData`) for correctness
- Existing PDF generation and template tests adapt to new data shapes
- 100% coverage maintained

## Migration Order

1. Create `packages/data` with schemas, data, helpers, and tests
2. Migrate `apps/api` to import from `@irfnd/data` (simpler — fewer touchpoints)
3. Migrate `apps/web` to import from `@irfnd/data` (more files, but mechanical replacement)
4. Remove orphaned content collection files and schemas
5. Verify all tests pass with 100% coverage across all 3 packages
6. Build verification — both apps build cleanly
