# Web JSON Collections Migration to @irfnd/data

**Date:** 2026-04-13
**Status:** Approved

## Problem

The web app (`apps/web`) still uses 4 JSON files loaded via Astro content collections (`getEntry`) for bilingual data: `about.json`, `ui.json`, `contact-form.json`, and `navigation.json`. All other shared data (profile, contact, experience, education, technology, portfolio) already lives in `@irfnd/data` as typed TypeScript objects with Zod schemas. This inconsistency means data isn't centralized and the web app has two different patterns for accessing bilingual content.

## Solution

Move all 4 JSON collections into `@irfnd/data` following the existing pattern:
- Zod schema in `packages/data/src/schemas/`
- Typed `I18nData<T>` collection in `packages/data/src/collections/`
- Exported from `packages/data/src/index.ts`
- Web components switch from `(await getEntry('ui', lang))!.data` to `getByLang(ui, lang)`
- Delete JSON files and remove Astro content collection definitions

## New Schemas

### About Schema (`schemas/about.ts`)

```ts
import { z } from 'zod';
import { paragraphSchema } from './common';

export const focusItemSchema = z.object({
  value: z.string(),
  label: z.string(),
  icon: z.string(),
});

export const aboutSchema = z.object({
  title: z.string(),
  description: z.array(paragraphSchema),
  focus: z.array(focusItemSchema),
});

export type FocusItemData = z.infer<typeof focusItemSchema>;
export type AboutData = z.infer<typeof aboutSchema>;
```

### Navigation Schema (`schemas/navigation.ts`)

```ts
import { z } from 'zod';

export const navItemSchema = z.object({
  label: z.string(),
  url: z.string(),
  icon: z.string(),
});

export const navigationSchema = z.object({
  items: z.array(navItemSchema),
});

export type NavItemData = z.infer<typeof navItemSchema>;
export type NavigationData = z.infer<typeof navigationSchema>;
```

### UI Schema (`schemas/ui.ts`)

```ts
import { z } from 'zod';

const seoPageSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const portfolioCategorySchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const uiSchema = z.object({
  seo: z.object({
    home: seoPageSchema,
    portfolio: seoPageSchema,
    contact: seoPageSchema,
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
    portfolioCategories: z.array(portfolioCategorySchema),
  }),
});

export type UiData = z.infer<typeof uiSchema>;
```

### Contact Form Schema (`schemas/contact-form.ts`)

```ts
import { z } from 'zod';

const formFieldSchema = z.object({
  label: z.string(),
  name: z.string(),
  type: z.enum(['text', 'email', 'tel', 'textarea']),
  placeholder: z.string(),
});

const fieldValidationSchema = z.object({
  min: z.string(),
  max: z.string(),
});

export const contactFormSchema = z.object({
  header: z.string(),
  description: z.string(),
  formTitle: z.string(),
  form: z.array(formFieldSchema),
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
    fullName: fieldValidationSchema,
    email: z.object({ invalid: z.string() }),
    telephone: fieldValidationSchema,
    subject: fieldValidationSchema,
    message: fieldValidationSchema,
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

## New Collections

Each collection file follows the existing pattern — a typed `I18nData<T>` constant containing the exact JSON data, converted to TypeScript.

- `collections/about.ts` — `export const about: I18nData<AboutData>`
- `collections/navigation.ts` — `export const navigation: I18nData<NavigationData>`
- `collections/ui.ts` — `export const ui: I18nData<UiData>`
- `collections/contact-form.ts` — `export const contactForm: I18nData<ContactFormData>`

## Web App Changes

### Import Pattern Change

Before:
```ts
import { getEntry } from 'astro:content';
const { seo } = (await getEntry('ui', lang))!.data;
```

After:
```ts
import { getByLang, ui } from '@irfnd/data';
const { seo } = getByLang(ui, lang);
```

### Affected Files

| File | Current `getEntry` | New Import |
|------|-------------------|------------|
| `pages/en/index.astro` | `getEntry('ui', lang)` | `getByLang(ui, lang)` |
| `pages/id/index.astro` | `getEntry('ui', lang)` | `getByLang(ui, lang)` |
| `pages/en/portfolio.astro` | `getEntry('ui', lang)` | `getByLang(ui, lang)` |
| `pages/id/portfolio.astro` | `getEntry('ui', lang)` | `getByLang(ui, lang)` |
| `pages/en/contact.astro` | `getEntry('contact-form', lang)`, `getEntry('ui', lang)` | `getByLang(contactForm, lang)`, `getByLang(ui, lang)` |
| `pages/id/contact.astro` | `getEntry('contact-form', lang)`, `getEntry('ui', lang)` | `getByLang(contactForm, lang)`, `getByLang(ui, lang)` |
| `components/layout/NavigationMenu.astro` | `getEntry('navigation', lang)` | `getByLang(navigation, lang)` |
| `components/layout/Footer.astro` | `getEntry('ui', lang)` | `getByLang(ui, lang)` |
| `components/layout/ThemeSwitcher.astro` | `getEntry('ui', lang)` | `getByLang(ui, lang)` |
| `components/layout/LanguageSwitcher.astro` | `getEntry('ui', lang)` | `getByLang(ui, lang)` |
| `components/page/home/ProfileFocus.astro` | `getEntry('about', lang)` | `getByLang(about, lang)` |
| `components/page/home/SelectedWork.astro` | `getEntry('ui', lang)` | `getByLang(ui, lang)` |

### Deletions

- `apps/web/src/content/data/about.json`
- `apps/web/src/content/data/ui.json`
- `apps/web/src/content/data/contact-form.json`
- `apps/web/src/content/data/navigation.json`
- `apps/web/src/content.config.ts` (delete entirely — no remaining collections)
- `apps/web/src/content/` directory (empty after JSON removal)

## Testing

### packages/data

- Extend existing `tests/collections.test.ts` with tests for the 4 new collections:
  - Each has `en` and `id` keys
  - Each validates against its Zod schema
  - Follow the same pattern as existing collection tests

### apps/web

- Existing tests should continue to pass — the web app tests use component-level testing, not content collection testing
- Build verification ensures all imports resolve correctly

## Out of Scope

- No changes to `apps/api` (it doesn't use these 4 collections)
- No changes to existing `@irfnd/data` collections (profile, contact, etc.)
- No changes to the `@irfnd/schemas` package
