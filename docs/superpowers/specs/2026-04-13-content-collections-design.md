# Content Collections Migration Design Spec

**Date:** 2026-04-13
**Scope:** Migrate all content from TypeScript i18n files to Astro Content Collections
**Status:** Approved

## Problem

Content data (profile, experience, portfolio projects, education, tech stacks, UI strings) is currently stored in large TypeScript files (`en.ts`, `id.ts` ~720 lines each) alongside a `tech-stack-list.ts` data file. This approach:

- Mixes concerns (UI strings, structured content, function calls all in one file)
- Bypasses Astro's built-in content validation and type generation
- Doesn't leverage content collections for querying, schema validation, or content layer caching

## Solution

Migrate all content to Astro Content Collections using JSON files organized by domain, with Zod schemas as the single source of truth for types.

## Collection Structure

```
src/content/
  tech-stacks/
    data.json              # 29 tech items (language-independent)
  navigation/
    en.json                # 4 nav items
    id.json
  contact/
    en.json                # 7 contact items (email, social, location)
    id.json
  profile/
    en.json                # name, role, photo, description
    id.json
  about/
    en.json                # title, description paragraphs, focus areas
    id.json
  experience/
    en.json                # title + 3 jobs with positions, stacks (as labels)
    id.json
  technology/
    en.json                # title + categorized tech stack labels
    id.json
  portfolio/
    en.json                # header, title, subtitle + 6 projects
    id.json
  education/
    en.json                # title + 2 education entries with awards
    id.json
  contact-form/
    en.json                # form config, validation messages, error strings
    id.json
  ui/
    en.json                # SEO meta, footer, common UI strings
    id.json
```

**11 collections total.** `tech-stacks` has a single `data.json` (language-independent). All others have `en.json`/`id.json`.

## Zod Schemas (`content.config.ts`)

### Reusable Sub-Schemas

```typescript
const paragraph = z.object({
  value: z.string(),
  keywords: z.array(z.string()),
});

const image = z.object({
  url: z.string(),
  alt: z.string(),
});

const techStack = z.object({
  label: z.string(),
  url: z.string(),
  icon: z.string(),
  color: z.string().optional(),
  border: z.string().optional(),
  customColor: z.boolean().optional(),
});

const award = z.object({
  label: z.string(),
  description: z.string(),
  icon: z.string(),
});

const formField = z.object({
  label: z.string(),
  name: z.string(),
  type: z.enum(['text', 'email', 'tel', 'textarea']),
  placeholder: z.string(),
});
```

### Collection Definitions

```typescript
const techStacks = defineCollection({
  type: 'data',
  schema: z.object({
    stacks: z.array(techStack),
  }),
});

const navigation = defineCollection({
  type: 'data',
  schema: z.object({
    items: z.array(z.object({
      label: z.string(),
      url: z.string(),
      icon: z.string(),
    })),
  }),
});

const contact = defineCollection({
  type: 'data',
  schema: z.object({
    items: z.array(z.object({
      type: z.enum(['location', 'contact']),
      label: z.string(),
      url: z.string(),
      icon: z.string(),
      showInStickyProfile: z.boolean().optional(),
      showInContactPage: z.boolean().optional(),
      showInFooter: z.boolean().optional(),
    })),
  }),
});

const profile = defineCollection({
  type: 'data',
  schema: z.object({
    firstName: z.string(),
    lastName: z.string(),
    role: z.string(),
    photo: image,
    description: z.string(),
  }),
});

const about = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.array(paragraph),
    focus: z.array(z.object({
      value: z.string(),
      label: z.string(),
      icon: z.string(),
    })),
  }),
});

const experience = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    jobs: z.array(z.object({
      company: z.string(),
      mainPosition: z.string(),
      type: z.string(),
      location: z.string(),
      duration: z.array(z.string()),
      link: z.string().nullable(),
      descriptions: z.array(z.object({
        icon: z.string().optional(),
        position: z.string(),
        summary: z.array(paragraph),
        points: z.array(paragraph),
        stacks: z.array(z.string()),  // tech stack LABELS, resolved at query time
      })),
    })),
  }),
});

const technology = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    stacks: z.record(z.string(), z.array(z.string())),  // category -> labels
  }),
});

const portfolio = defineCollection({
  type: 'data',
  schema: z.object({
    header: z.string(),
    title: z.string(),
    subtitle: z.string(),
    projects: z.array(z.object({
      icon: z.string(),
      name: z.string(),
      summary: z.array(paragraph),
      image: z.array(image),
      type: z.enum(['private', 'public']),
      demo: z.string().nullable(),
      source: z.string().nullable(),
      stacks: z.array(z.string()),  // tech stack LABELS
      category: z.enum(['frontend', 'backend', 'fullstack']),
      isSelected: z.boolean().optional(),
    })),
  }),
});

const education = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    educations: z.array(z.object({
      institution: z.string(),
      degree: z.string(),
      fieldOfStudy: z.string(),
      location: z.string(),
      duration: z.array(z.string()),
      link: z.string().nullable(),
      summary: z.array(paragraph),
      points: z.array(paragraph),
      award: z.array(award),
    })),
  }),
});

const contactForm = defineCollection({
  type: 'data',
  schema: z.object({
    header: z.string(),
    description: z.string(),
    formTitle: z.string(),
    form: z.array(formField),
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
  type: 'data',
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
      portfolioCategories: z.array(z.object({
        label: z.string(),
        value: z.string(),
      })),
    }),
  }),
});
```

## Tech Stack Resolution

JSON files cannot call functions. Collections that reference tech stacks store **label strings** instead of full objects.

### In JSON Files

```json
// experience/en.json (excerpt)
{
  "stacks": ["TypeScript", "Express.js", "NestJS", "PostgreSQL", "Swagger"]
}
```

### Resolution Utility

```typescript
// src/utils/tech-stacks.ts
import { getEntry } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

type TechStackItem = CollectionEntry<'tech-stacks'>['data']['stacks'][number];

export async function resolveTechStacks(labels: string[]): Promise<TechStackItem[]> {
  const entry = await getEntry('tech-stacks', 'data');
  return entry.data.stacks.filter(s => labels.includes(s.label));
}
```

Components that display tech stacks call `resolveTechStacks()` in their frontmatter to get full objects (with icon, color, URL).

## Component Migration

### Before (current)

```astro
---
import { getLangFromUrl, useTranslations } from '@/i18n';
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const { profile, about } = t;
---
<h1>{profile.firstName}</h1>
```

### After (with content collections)

```astro
---
import { getEntry } from 'astro:content';
import { getLangFromUrl } from '@/i18n';

const lang = getLangFromUrl(Astro.url);
const profile = (await getEntry('profile', lang)).data;
const about = (await getEntry('about', lang)).data;
---
<h1>{profile.firstName}</h1>
```

### Type Usage

Replace old interfaces with inferred types from collection entries:

```typescript
// Before
import type { IProfile } from '@/types';

// After
import type { CollectionEntry } from 'astro:content';
type ProfileData = CollectionEntry<'profile'>['data'];
```

## Files Removed

| File | Replaced By |
|------|-------------|
| `src/i18n/en.ts` | 11 JSON files in `src/content/*/en.json` |
| `src/i18n/id.ts` | 11 JSON files in `src/content/*/id.json` |
| `src/types/i18n.ts` | Zod schemas in `src/content.config.ts` |
| `src/contents/tech-stack-list.ts` | `src/content/tech-stacks/data.json` + `src/utils/tech-stacks.ts` |
| `src/contents/index.ts` | (barrel file, no longer needed) |

## Files Modified

| File | Change |
|------|--------|
| `src/i18n/index.ts` | Remove `useTranslations()`, keep `getLangFromUrl()`, `getLocalizedPath()`, `languages[]`, `defaultLanguage`. Move `Language` type here. |
| `src/content.config.ts` | Define all 11 collection schemas |
| All `.astro` components (19+) | Replace `useTranslations()` with `getEntry()` calls |
| `src/layouts/BaseLayout.astro` | Load `ui` and `profile` collections instead of translations |
| `src/pages/**/index.astro` | Load collections needed per page |
| `src/components/common/SEO.astro` | No change (receives props) |

## Files Created

| File | Purpose |
|------|---------|
| `src/content/*/en.json` (11 files) | English content data |
| `src/content/*/id.json` (10 files) | Indonesian content data |
| `src/content/tech-stacks/data.json` | Language-independent tech stack data |
| `src/utils/tech-stacks.ts` | `resolveTechStacks()` utility |

## Shared Schema Integration

`packages/schemas` has `createContactSchema(messages)` that accepts i18n validation messages. Currently called with `t.contactMe.validation`. After migration:

```typescript
const contactForm = (await getEntry('contact-form', lang)).data;
const schema = createContactSchema(contactForm.validation);
```

The interface is the same — only the data source changes.

## Testing Strategy

### Tests to Rewrite

1. **`tests/i18n/translations.test.ts`** (20 tests) → Validate JSON content files exist for both languages, have matching keys, and pass Zod schema validation.

2. **`tests/contents/tech-stack-list.test.ts`** (6 tests) → Validate `tech-stacks/data.json` content and test `resolveTechStacks()` utility.

### Tests to Update

3. **`tests/i18n/utils.test.ts`** (8 tests) → Remove `useTranslations` tests. Keep `getLangFromUrl` and `getLocalizedPath` tests.

4. **`tests/scripts/contact-form.test.ts`** (10 tests) → Update to load validation messages from JSON instead of `useTranslations()`.

5. **`tests/scripts/resume-download.test.ts`** (8 tests) → Update data mocking approach.

### Tests Unaffected

6. **`tests/utils/cn.test.ts`**, **`tests/utils/text.test.ts`**, **`tests/utils/portfolio.test.ts`**, **`tests/utils/cloudinary.test.ts`**, **`tests/scripts/theme.test.ts`**, **`tests/scripts/toast.test.ts`**, **`tests/scripts/project-dialog.test.ts`**, **`tests/scripts/gsap-init.test.ts`**, **`tests/scripts/language.test.ts`** — No content dependencies, no changes needed.

### Coverage Target

Maintain 100% coverage across statements, branches, functions, and lines.

## Migration Order

1. Create `content.config.ts` with all Zod schemas
2. Create all JSON content files from current TS data
3. Create `resolveTechStacks()` utility
4. Update `src/i18n/index.ts` (remove `useTranslations`, keep utils)
5. Migrate components to use `getEntry()` (work section by section)
6. Remove old files (`en.ts`, `id.ts`, `types/i18n.ts`, `contents/`)
7. Update tests
8. Verify build and coverage
