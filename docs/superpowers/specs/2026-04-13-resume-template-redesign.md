# Resume Template Redesign

## Problem

The current HTML resume template (`apps/api/src/templates/resume.ts`) produces a modern blue-accent design with tag-styled skills and a summary section. The user wants it to match the style of their reference PDF — a classic, professional CV using serif fonts, all-black text, section headers with horizontal rules, and categorized inline skills. The reference also includes a **Portfolios** section and splits multi-role positions into separate entries per company.

## Approach

Redesign the HTML template to replicate the reference PDF layout, expand the `ResumeData` interface to support portfolios and per-position entries, restructure the data mapping in the resume route, and move portfolio data into `@irfnd/data`.

---

## 1. Visual Design

### Typography & Colors
- **Font**: `"Times New Roman", Times, serif` — matches the reference PDF
- **Color**: All text is black (`#000`). No accent colors.
- **Font sizes**: Name ~20px bold, section headers ~13px bold uppercase, body ~11px, contact line ~10px

### Section Headers
- Bold uppercase text (e.g., `WORK EXPERIENCES`, `EDUCATIONS`, `SKILLS`, `PORTFOLIOS`)
- Thin black horizontal rule underneath (`border-bottom: 1px solid #000`)
- Consistent spacing: `margin-top: 14px`, `margin-bottom: 6px`

### Contact Header
- Name: centered, bold, large
- Single line below name: `Location | email | linkedin slug | github slug | irfnd.id`
- Pipe-separated, no icons, no role subtitle

### Experience Layout
Each position entry:
```
COMPANY NAME (bold, caps)                    Duration (right-aligned)
Position Title (italic)                      Location (right-aligned, italic)
• Bullet point 1
• Bullet point 2
```

When a company has multiple positions, the company name appears once. Subsequent positions show only the position/duration/location rows plus bullets.

### Education Layout
```
INSTITUTION (bold, caps)                     Duration (right-aligned)
Degree — Field of Study (italic)             Location (right-aligned, italic)
• GPA: 4.00/4.00 (from awards)
• Summary text (from summary paragraphs)
```

### Skills Layout
Categorized inline format:
```
Category: item1, item2, item3
```
Uses existing technology collection categories: **Languages**, **Frameworks & UI**, **Databases & Infrastructure**.

### Portfolios Layout
```
PROJECT NAME (bold, caps)
Description paragraph (from summary, with {0} placeholders resolved)
Technologies: Stack1, Stack2, Stack3
See Demo  Source Code  (as links, only if URLs exist)
```
Only projects where `isSelected === true` are included.

### Page Setup
- A4 size, zero margins on `@page` (padding handled by body)
- Body padding: `40px 50px`
- Content should flow naturally across page breaks (no forced breaks)

---

## 2. Data Changes

### 2a. Experience Schema — Add Per-Description Duration

The `jobDescriptionSchema` needs an optional `duration` field so each sub-position can have its own date range.

**File**: `packages/data/src/schemas/experience.ts`

```ts
export const jobDescriptionSchema = z.object({
  icon: z.string().optional(),
  position: z.string(),
  duration: z.array(z.string()).optional(), // NEW: per-position date range
  summary: z.array(paragraphSchema),
  points: z.array(paragraphSchema),
  stacks: z.array(z.string()),
});
```

**File**: `packages/data/src/collections/experience.ts`

Add `duration` to each description entry in both `en` and `id`:
- Nutech Backend: `['July 2024', 'October 2024']` (en) / `['Juli 2024', 'Oktober 2024']` (id)
- Nutech Frontend: `['April 2023', 'July 2024']` (en) / `['April 2023', 'Juli 2024']` (id)
- Prof.Dito Full-Stack: inherits from parent job duration (no explicit duration needed)
- PLN Engineering Staff: inherits from parent job duration

### 2b. Contact Collection — Add Website

**File**: `packages/data/src/collections/contact.ts`

Add a new contact item to both `en` and `id`:
```ts
{
  type: 'contact',
  label: 'irfnd.id',
  url: 'https://irfnd.id',
  icon: 'tabler:world',
  showInResume: true,
}
```

### 2c. Contact Schema — Add `showInResume` Flag

**File**: `packages/data/src/schemas/contact.ts`

Add optional `showInResume` boolean:
```ts
export const contactItemSchema = z.object({
  type: z.enum(['location', 'contact']),
  label: z.string(),
  url: z.string(),
  icon: z.string(),
  showInStickyProfile: z.boolean().optional(),
  showInContactPage: z.boolean().optional(),
  showInFooter: z.boolean().optional(),
  showInResume: z.boolean().optional(), // NEW
});
```

Mark `showInResume: true` on: location, email, LinkedIn, GitHub, and the new website entry.

### 2d. Portfolio Collection — New

**File**: `packages/data/src/schemas/portfolio.ts` (new)

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

**File**: `packages/data/src/collections/portfolio.ts` (new)

Move the JSON data from `apps/web/src/content/data/portfolio.json` into a TypeScript collection following the same `I18nData<PortfolioData>` pattern.

**File**: `packages/data/src/index.ts`

Add exports:
```ts
export * from './schemas/portfolio';
export { portfolio } from './collections/portfolio';
```

### 2e. Web App — Remove Duplicate Portfolio Data

After portfolio is in `@irfnd/data`:
- Delete `apps/web/src/content/data/portfolio.json`
- Update `apps/web/src/content.config.ts` to remove the `portfolio` collection definition
- Update all Astro components that read portfolio via `getEntry('portfolio', lang)` to use `@irfnd/data` imports instead

---

## 3. Template Changes

### 3a. New `ResumeData` Interface

**File**: `apps/api/src/templates/resume.ts`

```ts
interface ResumeData {
  name: string;
  contacts: string[];        // pre-formatted: ['Jakarta, Indonesia', 'email', 'linkedin slug', 'github slug', 'irfnd.id']
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
    points: string[];         // GPA, summary text, etc.
  }[];
  skills: Record<string, string[]>;  // { "Languages": ["JS", "TS"], ... }
  portfolios: {
    name: string;
    description: string;
    technologies: string[];
    demo: string | null;
    source: string | null;
  }[];
}
```

### 3b. HTML Template

Complete redesign of `generateResumeHTML()` to produce the reference PDF layout described in Section 1. Key points:
- No `role` or `summary` fields rendered
- Contact line: pipe-separated contacts array
- Experience: company header with positions beneath
- Skills: `<strong>Category:</strong> items` format
- Portfolios: project name, description, tech list, optional links
- All serif typography, black color scheme

### 3c. Route Data Mapping

**File**: `apps/api/src/routes/resume.ts`

Update `getResumeData()` to:
- Build `contacts` array from contact items where `showInResume === true`, using display-friendly slugs (e.g., `linkedin.com/in/irfnd-iqbl` not the full URL)
- Flatten experience descriptions into per-position entries, using `description.duration ?? job.duration` for each
- Resolve `{0}`, `{1}` placeholders in paragraph values by interpolating keywords
- Build `education.points` from awards + summaries
- Pass `technology.stacks` directly as `skills`
- Filter portfolio projects by `isSelected === true` and resolve summary paragraphs

### 3d. Paragraph Resolution Helper

Add a utility function to resolve `{0}`, `{1}` placeholders in paragraph values:

```ts
function resolveParagraph(p: { value: string; keywords: string[] }): string {
  return p.keywords.reduce((text, kw, i) => text.replace(`{${i}}`, kw), p.value);
}
```

This is needed for experience points, education summaries, and portfolio descriptions.

---

## 4. Tests

### 4a. Template Tests (`apps/api/tests/templates/resume.test.ts`)

Rewrite with new `ResumeData` shape:
- Test all sections render (contacts, experience, education, skills, portfolios)
- Test multi-position companies render correctly
- Test portfolio links render conditionally (demo only, source only, both, neither)
- Test skills categories render with correct format

### 4b. Route Tests (`apps/api/tests/routes/resume.test.ts`)

Existing tests should still pass (they test HTTP status codes and headers, not HTML content). Verify no breakage.

### 4c. Data Package Tests (`packages/data/tests/`)

Add tests for the new portfolio collection:
- Validate against schema
- Verify `isSelected` projects exist in both languages
- Test paragraph resolution helper if exported

### 4d. Web Tests

Any tests that reference portfolio via `getEntry` need updating to use `@irfnd/data` imports.

---

## 5. Out of Scope

- Changing the technology collection categories (stays as Languages, Frameworks & UI, Databases & Infrastructure)
- Adding soft-skills to the technology data
- Changing the PDF generation engine (stays Puppeteer HTML-to-PDF)
- i18n for section headers in the template (already supported via lang parameter)
- Changing the web app's visual design or components beyond the portfolio data source migration
