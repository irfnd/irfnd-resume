# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Maintenance Rule

**After every feature addition or adjustment, update this file to reflect the change.** This includes — but is not limited to — new components, new hooks, new routes, new dependencies, architectural decisions, import conventions, and build configuration changes. Keep all sections accurate and in sync with the actual codebase at all times.

## Commands

- **Dev server**: `bun dev`
- **Build**: `bun build` (runs `tsc -b && vite build`)
- **Lint**: `bun lint` (ESLint)
- **Format**: `bun format` (Prettier)
- **Preview production build**: `bun preview`

Pre-commit hooks (husky + lint-staged) auto-run ESLint fix and Prettier on staged files.

## Architecture

Personal portfolio/resume site built with React 19, TypeScript (strict mode), and Vite 7.

### Routing

TanStack Router with **file-based routing** in `src/routes/`. The route tree is auto-generated in `src/routeTree.gen.ts` (do not edit manually). Routes:

- `__root.tsx` — Root layout: two-column grid (sticky sidebar + main content), decorative gradients, language/theme switchers in fixed top-right corner
- `index.tsx` — Home page (`/`): profile focus, professional journey, education history, technical stack, selected work
- `portfolio.tsx` — Portfolio with animated category tabs (`/portfolio`)
- `contact.tsx` — Contact page (`/contact`)

### Providers (src/main.tsx)

Provider nesting order: `I18nProvider → ThemeProvider → RouterProvider`

- **ThemeProvider** (`src/components/providers/theme-provider.tsx`): Dark/light mode via context, toggles `document.documentElement` class. Storage key: `irfnd-ui-theme`. Hook: `useTheme()`
- **I18nProvider** (`src/components/providers/i18n-provider.tsx`): English/Indonesian language support via context. Storage key: `irfnd-lang`. Hooks: `useI18n()`, `useTranslation()`, `useLanguage()`

### Styling

Tailwind CSS 4 with custom CSS variables for theming defined in `src/index.css`. Custom utilities: `noise-bg`, `glass-card`, `light-shadow`, `nav-item-active`, `pattern-grid`. Class merging uses `cn()` from `src/utils/cn.ts` (clsx + tailwind-merge).

Fonts: Inter (sans), JetBrains Mono (mono).

### Animation

Framer Motion with reusable viewport-triggered wrappers in `src/components/ui/motion-wrapper.tsx`:

- `FadeIn` / `SlideUp` — Single element animations on scroll
- `StaggerContainer` / `StaggerItem` — Staggered children animations

These support semantic HTML elements via the `as` prop. Custom `MotionLink` and `MotionTab` components wrap TanStack Router links and Base UI tabs with motion.

**Mobile hover fix:** All `whileHover` animations are mirrored in `whileTap` so touch devices receive the same visual feedback on press.

### Content & i18n

All page content lives in `src/i18n/en.ts` and `src/i18n/id.ts` as typed translation objects. Types are defined in `src/types/i18n.ts`. Components access content via `useTranslation()` hook.

`setHighlightText(text, keywords)` in `src/utils/text.ts` replaces keywords with `{0}`, `{1}` placeholders for the `HighlightText` UI component. When rendering plain text (e.g. in the PDF), use `resolveText(paragraph)` from `src/components/pdf/utils.ts` to restore the original words.

### Hooks (src/hooks/)

- `useTheme()` — dark/light mode toggle
- `useI18n()` — full i18n context (`language`, `setLanguage`, `t`)
- `useTranslation()` — returns the current `Translations` object
- `useLanguage()` — returns the current `Language` string
- `useYear()` — returns the current year
- `useResumeDownload()` — triggers lazy PDF generation and download; returns `{ download, loading }`

### PDF Generation (src/components/pdf/)

Resume PDF is generated on demand using `@react-pdf/renderer`. The entire library is **lazily loaded** via dynamic `import()` inside `useResumeDownload` — it is never included in the initial bundle.

**PDF components receive data as props** (not via hooks) because `@react-pdf/renderer` uses its own React reconciler that does not share context with the DOM tree.

Structure:

- `resume.tsx` — Root `<Document>` / `<Page>` that composes all sections
- `styles.ts` — Shared `StyleSheet` (Times Roman, A4 page, dividers)
- `utils.ts` — `resolveText(paragraph)` restores `{0}…` placeholders back to keywords
- `sections/header.tsx` — Name, role, location, email/LinkedIn/GitHub links
- `sections/experience.tsx` — Work history with company, positions, bullet points
- `sections/education.tsx` — Education with degree, duration, awards
- `sections/skills.tsx` — Technology stacks by category (alphabetically sorted)
- `sections/projects.tsx` — All portfolio projects with stacks and links

The **Resume nav item** (`url: '/resume'`) in the navigation menu renders as a `motion.button` instead of a link. Clicking it calls `useResumeDownload().download()` and shows a spinner while the PDF is being generated. The downloaded filename follows the pattern `Resume_<FirstName>_<LastName>_<LANG>.pdf`.

### Navigation Menu

`src/components/layout/navigation-menu.tsx` iterates over `navigation` translations. Items with `url === '/resume'` are rendered as a `motion.button` that triggers PDF download; all other items are rendered as `MotionLink` (TanStack Router `Link` wrapped with Framer Motion).

### Project Dialog

`src/components/ui/project-dialog.tsx` — `ProjectDialog` component rendered inside each `ProjectCard`. Uses `@base-ui/react/dialog` for accessibility (focus trap, scroll lock, ARIA) with CSS transitions via `data-open:` Tailwind variants for enter/exit animations.

- **Trigger**: clicking anywhere on a `ProjectCard` opens the dialog (inner links use `e.stopPropagation()` to remain independent)
- **Image gallery**: cycles through `project.image[]` with prev/next buttons and dot indicators; only shown when images exist
- **Body**: project name, type badge (internal/public), full `summary` paragraphs via `HighlightText`, `TechIcon` grid with labels
- **Footer**: Source Code / Live Demo buttons for public projects
- **Z-index**: backdrop and popup at `z-[70]` (above nav `z-50`, above switchers `z-60`)

### Utilities (src/utils/)

- `cn()` — class merging with clsx + tailwind-merge (`src/utils/cn.ts`)
- `setHighlightText()` / resolve helpers — text processing (`src/utils/text.ts`)
- `cloudinaryResize(url, width)` — transforms a Cloudinary URL to serve a `c_scale,w_<width>` variant; use at render sites so images are served at appropriate display size (`src/utils/cloudinary.ts`)

### Path Alias

`@/` maps to `src/` (configured in both `tsconfig.app.json` and `vite.config.ts`).

### Import Convention

Always use **absolute imports** with the `@/` prefix for all cross-module imports in implementation files:

```ts
// ✅ correct
import { useTranslation } from '@/hooks';
import { styles } from '@/components/pdf/styles';

// ❌ wrong
import { styles } from '../styles';
import { resolveText } from './utils';
```

**Exceptions** (relative imports are acceptable):

- `index.ts` barrel files re-exporting siblings (`export * from './footer'`)
- `src/routeTree.gen.ts` — auto-generated by TanStack Router, do not edit

### SEO (index.html)

`index.html` contains all SEO markup — do not remove or duplicate these in React components:

- **Primary meta tags** — `title`, `description`, `author`, `keywords`, `robots`, `canonical`
- **Open Graph** — `og:type`, `og:url`, `og:site_name`, `og:title`, `og:description`, `og:image`, `og:locale`
- **Twitter Card** — `summary_large_image` with `twitter:site`, `twitter:creator`, `twitter:title`, `twitter:description`, `twitter:image`
- **JSON-LD** — `schema.org/Person` structured data with name, jobTitle, url, email, image, address, sameAs links
- **Theme initializer script** — runs before first paint to apply the saved theme class; uses storage key `irfnd-ui-theme`
- **Favicon** — multiple PNG sizes (`16`, `32`, `96`) and Apple touch icons (`57`, `60`, `72`, `76`)
- **Google Fonts** — loaded via `<link rel="preconnect">` + `<link rel="stylesheet">` (not CSS `@import`) to avoid render-blocking

Canonical URL: `https://irfnd.id`

### Code Splitting

Vite manual chunks in `vite.config.ts`:

| Chunk           | Contents                                                       |
| --------------- | -------------------------------------------------------------- |
| `tanstack`      | All `@tanstack/*` packages                                     |
| `framer-motion` | Framer Motion                                                  |
| `react-vendor`  | React, React DOM, Base UI, Tabler icons, Simple Icons          |
| `react-pdf`     | `@react-pdf/renderer` + reconciler, render, font, image layers |
| `pdf-engine`    | `@react-pdf/pdfkit` — core PDF document engine                 |
| `pdf-font`      | `fontkit` + brotli, restructure, unicode libs                  |
| `pdf-layout`    | `yoga-layout` + `@react-pdf/layout` + `@react-pdf/textkit`     |

All PDF chunks are loaded in parallel only when the user triggers a resume download.
