# React-PDF Migration Design Spec

**Date**: 2026-04-13
**Status**: Draft
**Scope**: Migrate `apps/api` PDF generation from Puppeteer (HTML→headless Chrome→PDF) to `@react-pdf/renderer` (React components→PDF buffer)

## Problem

The API currently uses Puppeteer to generate resume PDFs. This requires launching a headless Chrome instance per request, which is heavy (~300MB memory), slow (~2-3s cold start), and unreliable in constrained environments. The v2 branch already has proven `@react-pdf/renderer` components that generate the same resume layout using React primitives — much lighter, faster, and more portable.

## Approach

Port the v2 branch's `@react-pdf/renderer` section components into `apps/api/src/templates/pdf/`, adapt them to use `@irfnd/data` types (instead of old `IType` interfaces), and replace the Puppeteer pipeline in the resume route with `renderToBuffer()`.

## Architecture

### File Structure

```
apps/api/src/templates/
├── pdf/
│   ├── resume.tsx          # ResumePDF document component
│   ├── styles.ts           # StyleSheet + Font config
│   ├── sections/
│   │   ├── header.tsx      # Name, role, contact line
│   │   ├── experience.tsx  # Work experience with multi-position
│   │   ├── education.tsx   # Education with awards
│   │   ├── skills.tsx      # Categorized tech skills
│   │   └── projects.tsx    # Selected portfolio projects
│   └── index.ts            # Barrel export
```

### Deleted Files

- `apps/api/src/templates/resume.ts` — HTML template (replaced by PDF components)
- `apps/api/tests/templates/resume.test.ts` — HTML template tests (replaced by PDF tests)

### Dependencies

**Add:**
- `@react-pdf/renderer` — PDF generation engine
- `react` — Required peer dependency for JSX

**Remove:**
- `puppeteer` — No longer needed

### Test Structure

```
apps/api/tests/templates/
├── pdf/
│   ├── resume.test.tsx           # ResumePDF composition test
│   ├── styles.test.ts            # Style definitions test
│   ├── header-section.test.tsx   # Header section tests
│   ├── experience-section.test.tsx
│   ├── education-section.test.tsx
│   ├── skills-section.test.tsx
│   └── projects-section.test.tsx
```

## Component Details

### ResumePDF (`resume.tsx`)

Root document component. Composes all sections in a single A4 page.

```tsx
interface ResumePDFProps {
  profile: ProfileData;
  contact: ContactData;
  experience: ExperienceData;
  education: EducationData;
  technology: TechnologyData;
  portfolio: PortfolioData;
  language: LangCode;
}
```

Uses `@irfnd/data` types directly — no intermediate `ResumeData` mapping object needed. Data filtering (e.g., `showInResume`, `isSelected`) happens in each section component, keeping the route clean.

### Styles (`styles.ts`)

Ported from v2 exactly:
- Font: `Times-Roman`, `Times-Bold`, `Times-Italic` (built-in, no registration needed)
- Hyphenation callback disabled (prevents word breaking)
- Base font size: 10px, page padding: 50px horizontal, 36px vertical
- Black-only color scheme (`#000`)
- Shared styles: `page`, `text`, `bold`, `italic`, `link`, `dividerV`, `dividerH`

### HeaderSection (`sections/header.tsx`)

**Props**: `{ profile: ProfileData, contact: ContactData }`

- Renders `FIRSTNAME LASTNAME` in bold 16px
- Role in italic below
- Contact line: location + pipe-separated links (email, LinkedIn, GitHub)
- Contact items filtered by `showInResume === true`
- URLs formatted: strip `mailto:`, `https://www.`, `https://`, trailing `/`

### ExperienceSection (`sections/experience.tsx`)

**Props**: `{ experience: ExperienceData }`

- Section title from `experience.title`, uppercased, with horizontal divider
- Per job: company name (linked if `job.link` exists), uppercased
- First description row: position + `location · type`
- Subsequent description rows: position + `description.duration` (or `job.duration` fallback)
- Summary text (justified) + bullet points, all resolved via `resolveParagraph`

### EducationSection (`sections/education.tsx`)

**Props**: `{ education: EducationData }`

- Section title from `education.title`, uppercased, with horizontal divider
- Institution name (linked if `education.link` exists), uppercased
- `degree · fieldOfStudy` on second row, location right-aligned
- Duration: `start – end` format
- Summary + points resolved via `resolveParagraph`
- Awards rendered as italic `label — description`

### SkillsSection (`sections/skills.tsx`)

**Props**: `{ technology: TechnologyData }`

- Section title from `technology.title`, uppercased, with horizontal divider
- Page break before section (`break` prop on View)
- Each category: `CategoryName : skill1, skill2, ...` (alphabetically sorted)
- Category name width: 130px, colon width: 8px, skills flex: 1

### ProjectsSection (`sections/projects.tsx`)

**Props**: `{ portfolio: PortfolioData, language: LangCode }`

- Section title from `portfolio.title`, uppercased, with horizontal divider
- Only projects where `isSelected === true`
- Project name linked to demo URL if available, uppercased
- Summary resolved via `resolveParagraph` (first item only)
- Tech stacks sorted alphabetically, with localized "Technologies"/"Teknologi" label
- Demo/Source links with localized labels, separated by vertical divider
- `wrap={false}` to prevent project splitting across pages

## Route Changes

### `apps/api/src/routes/resume.ts`

**Before** (Puppeteer):
```ts
const puppeteer = await import('puppeteer');
const browser = await puppeteer.default.launch({ headless: true, ... });
const page = await browser.newPage();
const html = generateResumeHTML(getResumeData(lang));
await page.setContent(html, { waitUntil: 'networkidle0' });
const pdf = await page.pdf({ format: 'A4', ... });
await browser.close();
```

**After** (`@react-pdf/renderer`):
```ts
const { renderToBuffer } = await import('@react-pdf/renderer');
const buffer = await renderToBuffer(
  createElement(ResumePDF, { profile, contact, experience, education, technology, portfolio, language })
);
```

Key changes:
- Remove `getResumeData()` mapping function — pass `@irfnd/data` collections directly
- Dynamic import of `@react-pdf/renderer` for `renderToBuffer`
- `createElement` from React (since this is a `.ts` file, not `.tsx`)
- Same response format: `Content-Type: application/pdf`, `Content-Disposition: attachment`
- Same error handling: try/catch → 500 response

### TypeScript Configuration

`apps/api/tsconfig.json` needs:
- `"jsx": "react-jsx"` to support `.tsx` files
- Verify `moduleResolution` supports the new imports

### Vitest Configuration

`apps/api/vitest.config.ts` may need:
- `environment: 'node'` (should already be default)
- Ensure `.tsx` transform works for tests

## Testing Strategy

### Mocking Pattern

All tests mock `@react-pdf/renderer` primitives as simple HTML elements (same pattern as v2):

```tsx
vi.mock('@react-pdf/renderer', () => ({
  Document: ({ children }) => <div data-testid="pdf-document">{children}</div>,
  Page: ({ children }) => <div data-testid="pdf-page">{children}</div>,
  View: ({ children }) => <div data-testid="pdf-view">{children}</div>,
  Text: ({ children }) => <span data-testid="pdf-text">{children}</span>,
  Link: ({ children, src }) => <a href={src} data-testid="pdf-link">{children}</a>,
  Font: { registerHyphenationCallback: vi.fn() },
  StyleSheet: { create: (s) => s },
}));
```

Also mock `@/templates/pdf/styles` to return plain objects.

Tests use `@testing-library/react` with `render` + `screen` queries.

### Test Coverage Requirements

- Each section component: rendering, conditional branches, data resolution
- Styles: all style keys defined with expected values
- ResumePDF: renders all sections, passes correct props
- Route: valid requests, invalid language, error handling, response headers
- 100% code coverage maintained

### Route Test Changes

Replace Puppeteer mock with `@react-pdf/renderer` mock:

```tsx
vi.mock('@react-pdf/renderer', () => ({
  renderToBuffer: vi.fn().mockResolvedValue(Buffer.from('fake-pdf-content')),
}));
```

### New Dependencies for Testing

- `@testing-library/react` — add to `apps/api` devDependencies
- `jsdom` — add to `apps/api` devDependencies (for rendering React components in tests)

## Migration Checklist

1. Add `react`, `@react-pdf/renderer` to `apps/api` dependencies
2. Add `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` to devDependencies
3. Remove `puppeteer` from dependencies
4. Update `tsconfig.json` with JSX support
5. Update `vitest.config.ts` if needed for JSX transform
6. Create `apps/api/src/templates/pdf/` directory with all components
7. Delete `apps/api/src/templates/resume.ts`
8. Update `apps/api/src/routes/resume.ts` to use `renderToBuffer`
9. Create all PDF component test files
10. Delete `apps/api/tests/templates/resume.test.ts`
11. Update route test to mock `@react-pdf/renderer` instead of Puppeteer
12. Verify all tests pass with 100% coverage
13. Verify API serves correct PDF via manual test
