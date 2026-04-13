# React to Astro Migration — Design Spec

**Date:** 2026-04-13
**Scope:** Migrate `apps/web` from React 19 (Vite + TanStack Router) to Astro (latest) with SSG, GSAP animations, vanilla JS interactivity, and server-side PDF generation. `apps/api` and `packages/schemas` remain unchanged except for the addition of a PDF endpoint on the API.

---

## 1. Problem Statement

The `apps/web` portfolio site is a React 19 SPA with client-side rendering. The site content is static (portfolio, resume, about) with minimal interactivity (theme toggle, language switch, contact form, project dialogs). A full React runtime is unnecessary for this workload.

Migrating to Astro with SSG will:

- Eliminate the client-side JS framework overhead (~150KB+ of React/Router/Framer Motion)
- Serve pre-rendered HTML for instant page loads
- Leverage Astro's built-in i18n with locale-prefixed URLs for better SEO
- Keep interactivity via targeted vanilla JS scripts and GSAP animations

---

## 2. Technology Decisions

| Concern | Current (React) | Target (Astro) |
|---|---|---|
| Framework | React 19 + Vite 7 | Astro (latest, SSG mode) |
| Routing | TanStack Router (file-based) | Astro file-based routing (`src/pages/`) |
| Animations | Framer Motion | GSAP + ScrollTrigger |
| PDF generation | @react-pdf/renderer (client-side) | Puppeteer on `apps/api` (server-side) |
| i18n | React context + localStorage | Astro built-in i18n (`/en/*`, `/id/*`) |
| Interactivity | React state/hooks | Vanilla JS in `<script>` tags |
| Icons | @tabler/icons-react, react-simple-icons | astro-icon + @iconify-json/* |
| Styling | Tailwind CSS 4 + CSS variables | Tailwind CSS 4 + CSS variables (unchanged) |
| Testing | Vitest + React Testing Library | Vitest + happy-dom/jsdom + @astrojs/test-utils |
| Coverage | 100% enforced | 100% enforced |
| Headless UI | @base-ui/react (Dialog, Menu, Tabs, Tooltip) | Native HTML (`<dialog>`, `<details>`) + vanilla JS |

---

## 3. Project Structure

```
apps/web/
├── astro.config.mjs              # Astro config: SSG, i18n, Tailwind
├── tsconfig.json                  # TypeScript config with @/ alias
├── package.json
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro       # HTML shell: <head>, fonts, theme init, GSAP loader
│   ├── pages/
│   │   ├── index.astro            # Root redirect → /en/ (or /id/ via browser detection)
│   │   ├── en/
│   │   │   ├── index.astro        # Home page
│   │   │   ├── portfolio.astro    # Portfolio page
│   │   │   └── contact.astro      # Contact page
│   │   └── id/
│   │       ├── index.astro
│   │       ├── portfolio.astro
│   │       └── contact.astro
│   ├── components/
│   │   ├── layout/
│   │   │   ├── NavigationMenu.astro
│   │   │   ├── StickyProfile.astro
│   │   │   ├── ThemeSwitcher.astro
│   │   │   ├── LanguageSwitcher.astro
│   │   │   └── Footer.astro
│   │   ├── page/
│   │   │   ├── ProfileFocus.astro
│   │   │   ├── ProfessionalJourney.astro
│   │   │   ├── SelectedWork.astro
│   │   │   ├── TechnicalStack.astro
│   │   │   └── EducationHistory.astro
│   │   └── ui/
│   │       ├── ProjectCard.astro
│   │       ├── ProjectDialog.astro
│   │       ├── TimelineBeam.astro
│   │       ├── TimelineItem.astro
│   │       ├── TechIcon.astro
│   │       ├── TooltipBubble.astro
│   │       └── HighlightText.astro
│   ├── scripts/
│   │   ├── gsap-animations.ts     # GSAP init: ScrollTrigger, viewport animations
│   │   ├── theme-switcher.ts      # Dark/light toggle with localStorage
│   │   ├── language-switcher.ts   # Dropdown + locale navigation
│   │   ├── contact-form.ts        # Form validation (Zod) + fetch submission
│   │   ├── project-dialog.ts      # Native <dialog> + image carousel (GSAP)
│   │   └── toast.ts               # Toast notification system (CSS animations)
│   ├── i18n/
│   │   ├── en.ts                  # English translations (same structure)
│   │   ├── id.ts                  # Indonesian translations (same structure)
│   │   ├── index.ts               # Exports, language config, getTranslations()
│   │   └── utils.ts               # Locale detection, URL helpers
│   ├── content/
│   │   └── tech-stack-list.ts     # Tech stack registry (unchanged)
│   ├── styles/
│   │   └── index.css              # Tailwind 4 + CSS variable theming (unchanged)
│   ├── utils/
│   │   ├── cn.ts                  # clsx + tailwind-merge (unchanged)
│   │   ├── cloudinary.ts          # Image URL helper (unchanged)
│   │   └── text.ts                # Text utilities (unchanged)
│   └── types/
│       └── index.ts               # TypeScript interfaces
├── public/
│   ├── fonts/                     # Self-hosted Inter, JetBrains Mono
│   └── favicon.svg
└── tests/
    ├── setup.ts                   # Test setup (DOM mocks, GSAP mocks)
    ├── components/                # Component tests
    ├── scripts/                   # Client script tests
    ├── utils/                     # Utility tests
    ├── i18n/                      # i18n utility tests
    └── test-utils.ts              # Test helpers
```

---

## 4. Routing & i18n

### URL Structure

| Current URL | New URL (English) | New URL (Indonesian) |
|---|---|---|
| `/` | `/en/` | `/id/` |
| `/portfolio` | `/en/portfolio` | `/id/portfolio` |
| `/contact` | `/en/contact` | `/id/contact` |

### Astro i18n Configuration

```js
// astro.config.mjs
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'id'],
    routing: { prefixDefaultLocale: true },
  },
});
```

### Root Redirect

`src/pages/index.astro` contains a small inline `<script>` that detects browser language (`navigator.language`) and redirects to `/id/` if Indonesian, otherwise `/en/`. For non-JS clients, a `<meta http-equiv="refresh">` fallback redirects to `/en/`.

### Translation Resolution

Translations are resolved at build time in page frontmatter:

```astro
---
// src/pages/en/index.astro
import { getTranslations } from '@/i18n';
const t = getTranslations('en');
---
<ProfileFocus profile={t.profile} about={t.about} />
```

Components receive translated strings as props — no runtime context, no hooks.

### Language Switching

The language switcher navigates between locale URLs:
- On `/en/portfolio`, clicking Indonesian navigates to `/id/portfolio`
- Implemented in `language-switcher.ts` by replacing the locale prefix in `window.location.pathname`

---

## 5. Animations (GSAP)

### Dependencies

- `gsap` (includes ScrollTrigger plugin — free for portfolio/non-commercial use)

### Data-Attribute Driven Initialization

Astro components declare animations via data attributes:

```astro
<!-- Fade in when entering viewport -->
<div data-animate="fade-in">...</div>

<!-- Slide up when entering viewport -->
<div data-animate="slide-up">...</div>

<!-- Stagger children -->
<div data-stagger="0.1">
  <div data-animate="fade-in">Item 1</div>
  <div data-animate="fade-in">Item 2</div>
</div>
```

### Animation Registry (`gsap-animations.ts`)

On `DOMContentLoaded`, the script:

1. Registers the `ScrollTrigger` plugin
2. Queries all `[data-animate]` elements and creates ScrollTrigger-based animations
3. Queries all `[data-stagger]` containers and creates staggered animations for children
4. Sets up scroll-based animations (timeline beam) for `[data-scroll-progress]` elements

### Framer Motion → GSAP Mapping

| Animation | GSAP Implementation |
|---|---|
| `FadeIn` | `gsap.from(el, { opacity: 0, y: 20, scrollTrigger: { start: "top 85%" } })` |
| `SlideUp` | `gsap.from(el, { opacity: 0, y: 40, scrollTrigger: { start: "top 85%" } })` |
| `StaggerContainer` | `gsap.from(children, { opacity: 0, y: 20, stagger: 0.1, scrollTrigger })` |
| `whileHover: { scale }` | CSS `transition: transform 0.2s` + `hover:scale-110` (Tailwind) |
| `whileTap: { scale }` | CSS `active:scale-95` (Tailwind) |
| `whileHover: { scale, rotate }` | `mouseenter`/`mouseleave` GSAP for combined spring effects |
| `AnimatePresence` (dialog) | GSAP `gsap.fromTo()` on dialog show, `gsap.to({ onComplete: close })` on dismiss |
| `useScroll` + `useSpring` (timeline beam) | ScrollTrigger with `scrub: true` on a GSAP timeline |
| Spring transitions | `ease: "elastic.out(1, 0.3)"` or `ease: "back.out(1.7)"` |
| Carousel slide | `gsap.fromTo(slide, { x: direction * 100% }, { x: 0, ease: "power2.out" })` |

### Toast Animations

Toasts use CSS `@keyframes` (no GSAP needed):

```css
@keyframes toast-enter { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes toast-exit { from { opacity: 1; } to { opacity: 0; transform: translateY(-10px); } }
```

---

## 6. Interactive Components (Vanilla JS)

### Theme Switcher (`theme-switcher.ts`)

- **Init:** Inline `<script>` in `<head>` reads `localStorage('irfnd-ui-theme')` and sets `<html>` class before first paint (prevents flash)
- **Toggle:** Click handler toggles `dark`/`light` class on `<html>`, updates localStorage
- **Icon swap:** Toggles visibility of sun/moon SVG icons in the button

### Language Switcher (`language-switcher.ts`)

- **Dropdown:** Click on trigger toggles `hidden` class on dropdown menu
- **Outside click:** `document.addEventListener('click', ...)` closes dropdown when clicking outside
- **Navigation:** Click on language option replaces locale prefix in current URL path and navigates via `window.location.href`
- **Active indicator:** Current locale is marked with `aria-current` attribute

### Contact Form (`contact-form.ts`)

- **Validation:** Import `createContactSchema` from `@irfnd/schemas`, validate on submit
- **Error display:** Set `textContent` on error `<span>` elements adjacent to each input
- **Submission:** `fetch(API_URL + '/contact', { method: 'POST', body: JSON.stringify(data) })`
- **States:** Loading (disable button, show spinner), success (show success message with GSAP fade), error 429 (rate limit toast), error 400 (field errors), other errors (generic toast)
- **Reset:** Clear form and errors on successful submission

### Project Dialog (`project-dialog.ts`)

- **Element:** Native `<dialog>` element with `showModal()` / `close()`
- **Open:** Click on ProjectCard sets dialog content (title, description, tech, images, links) from `data-*` attributes or a JSON script block, then calls `showModal()`
- **Image carousel:** Track current index, GSAP slide transitions between images, keyboard arrow support
- **Close:** Backdrop click (native `<dialog>` behavior), Escape key (native), close button

### Toast Notifications (`toast.ts`)

- **Container:** Fixed-position `<div>` in bottom-right corner (created once, reused)
- **Add toast:** Create element, append to container, apply enter animation (CSS), set auto-dismiss timeout
- **Remove toast:** Apply exit animation, then remove from DOM
- **API:** `showToast({ message, type, duration })` — callable from any script

### Portfolio Tab Filtering

- **Tabs:** Click handlers on tab buttons set `aria-selected`, update active styling
- **Filter:** Toggle `hidden` class on project cards based on `data-category` attribute matching active tab
- **Animation:** GSAP fade-in for newly visible cards

---

## 7. PDF Generation (Server-side)

### New Endpoint on `apps/api`

```
GET /resume?lang=en   → PDF download (English)
GET /resume?lang=id   → PDF download (Indonesian)
```

### Implementation

1. **HTML template:** A self-contained HTML string with inline CSS, structured to match the current PDF layout (header, experience, education, projects, skills sections). Uses the same i18n translation data.

2. **Rendering:** Puppeteer launches a headless browser, loads the HTML string, and calls `page.pdf()` with A4 format and appropriate margins.

3. **Response:** Returns the PDF buffer with headers:
   - `Content-Type: application/pdf`
   - `Content-Disposition: attachment; filename="irfnd-resume-en.pdf"`

4. **Font:** Uses Times-Roman or a self-hosted web font loaded in the HTML template. Puppeteer renders fonts properly since it's a real browser.

5. **Security:** Same middleware stack as the contact endpoint (CORS, origin validation, API key, rate limiting).

6. **Performance:** Puppeteer browser instance is cached/reused across requests (not launched per-request). The template is pre-compiled at startup.

### Web App Integration

- Resume download button in the navigation menu becomes an `<a>` tag or button with a click handler
- On click: `window.open(API_URL + '/resume?lang=' + currentLocale)` or direct `<a href="..." download>`
- A small loading indicator can be shown via a click handler that adds a CSS class

### Translation Data for PDF

The API maintains its own copy of the resume-specific content data (profile, experience, education, projects, skills) in both English and Indonesian. This avoids coupling the API build to the web app's i18n files. The data structure mirrors the relevant subset of the web app's translation objects.

---

## 8. Icons (Astro Icon + Iconify)

### Dependencies

- `astro-icon` — Astro integration for SVG icons
- `@iconify-json/tabler` — Tabler icon set (replaces @tabler/icons-react)
- `@iconify-json/simple-icons` — Simple Icons set (replaces react-simple-icons)

### Usage

```astro
---
import { Icon } from 'astro-icon/components';
---
<Icon name="tabler:home" class="w-5 h-5" />
<Icon name="simple-icons:react" class="w-6 h-6" />
```

### Icon Name Mapping

Current React icon imports map to Iconify names:

| React Import | Iconify Name |
|---|---|
| `IconHome` | `tabler:home` |
| `IconFolderStar` | `tabler:folder-star` |
| `IconSend` | `tabler:send` |
| `IconFileDownload` | `tabler:file-download` |
| `IconBrandGithub` | `tabler:brand-github` |
| `IconBrandLinkedin` | `tabler:brand-linkedin` |
| (etc.) | (kebab-case of icon name) |

The general rule: `Icon{Name}` → `tabler:{kebab-case-name}`. Simple Icons follow the same pattern with the `simple-icons:` prefix.

---

## 9. Testing Strategy

### Framework

- **Vitest** with `happy-dom` or `jsdom` environment
- **@astrojs/test-utils** (experimental container API) for rendering Astro components in tests
- **100% coverage** threshold maintained

### Test Categories

| Category | What's Tested | How |
|---|---|---|
| Utilities | `cn.ts`, `cloudinary.ts`, `text.ts` | Pure function tests (unchanged) |
| i18n | `getTranslations()`, locale helpers | Function tests |
| Client scripts | `theme-switcher.ts`, `toast.ts`, etc. | jsdom: mock DOM, dispatch events, assert mutations |
| GSAP animations | `gsap-animations.ts` | Mock `gsap` module, verify `.from()` / `.to()` calls and parameters |
| Astro components | `.astro` files | Container API: render to string, assert HTML structure |
| Content | `tech-stack-list.ts` | Data integrity tests (unchanged) |

### GSAP Mocking

```ts
vi.mock('gsap', () => ({
  gsap: { from: vi.fn(), to: vi.fn(), fromTo: vi.fn(), registerPlugin: vi.fn() },
  ScrollTrigger: {},
}));
```

### Test File Structure

```
tests/
├── setup.ts              # DOM mocks, GSAP mocks, global setup
├── components/
│   ├── layout/           # Navigation, profile, switchers, footer
│   ├── page/             # Page section components
│   └── ui/               # ProjectCard, dialog, timeline, etc.
├── scripts/
│   ├── gsap-animations.test.ts
│   ├── theme-switcher.test.ts
│   ├── language-switcher.test.ts
│   ├── contact-form.test.ts
│   ├── project-dialog.test.ts
│   └── toast.test.ts
├── utils/
│   ├── cn.test.ts
│   ├── cloudinary.test.ts
│   └── text.test.ts
├── i18n/
│   └── utils.test.ts
├── content/
│   └── tech-stack-list.test.ts
└── test-utils.ts          # Astro component render helpers
```

---

## 10. Migration Order

Incremental page-by-page approach. Each step produces a working (partial) site.

### Step 1: Foundation

- Initialize Astro project in `apps/web` (replace Vite/React config)
- Configure: Tailwind CSS 4, i18n routing, TypeScript, path aliases
- Set up `BaseLayout.astro` with head, fonts, theme initialization
- Port utility files (`cn.ts`, `cloudinary.ts`, `text.ts`) — unchanged
- Port i18n files and create `getTranslations()` utility
- Install and configure GSAP + ScrollTrigger
- Set up `gsap-animations.ts` initialization script
- Set up Vitest configuration for Astro

### Step 2: Home Page

- Migrate `StickyProfile.astro` (profile sidebar)
- Migrate `ProfileFocus.astro` (about section with animations)
- Migrate `ProfessionalJourney.astro` + `TimelineBeam.astro` (scroll-based animation)
- Migrate `SelectedWork.astro` + `ProjectCard.astro`
- Migrate `TechnicalStack.astro` + `TechIcon.astro`
- Migrate `EducationHistory.astro`
- Write tests for all home page components

### Step 3: Portfolio Page

- Migrate portfolio page with tab filtering
- Migrate `ProjectDialog.astro` + `project-dialog.ts` (native `<dialog>`)
- Port project data and filtering logic
- Write tests for portfolio components and dialog script

### Step 4: Contact Page

- Migrate contact form with vanilla JS validation
- Implement `contact-form.ts` with Zod validation + fetch submission
- Implement `toast.ts` notification system
- Write tests for contact form and toast scripts

### Step 5: PDF Generation

- Add `/resume` endpoint to `apps/api`
- Create HTML template replicating current PDF layout
- Integrate Puppeteer for HTML→PDF conversion
- Add resume download button to navigation
- Write tests for PDF endpoint and template

### Step 6: Layout & Navigation

- Migrate `NavigationMenu.astro` with active states and resume download
- Implement `ThemeSwitcher.astro` + `theme-switcher.ts`
- Implement `LanguageSwitcher.astro` + `language-switcher.ts`
- Migrate `Footer.astro`
- Write tests for layout components and scripts

### Step 7: Testing & Polish

- Ensure 100% test coverage
- Verify all animations work correctly
- Cross-browser testing (Chrome, Firefox, Safari)
- Performance audit (Lighthouse)
- Clean up: remove all React dependencies, old config files

---

## 11. Dependencies Changes

### Removed from `apps/web`

- `react`, `react-dom`
- `@vitejs/plugin-react-swc`
- `@tanstack/react-router`, `@tanstack/router-plugin`, `@tanstack/react-form`
- `framer-motion`
- `@react-pdf/renderer`
- `@base-ui/react`
- `@tabler/icons-react`, `@icons-pack/react-simple-icons`
- `@testing-library/react`, `@testing-library/jest-dom`
- `react-string-format`

### Added to `apps/web`

- `astro`
- `@astrojs/tailwind` (or Tailwind Vite integration if Astro supports it directly)
- `gsap`
- `astro-icon`
- `@iconify-json/tabler`, `@iconify-json/simple-icons`
- `@astrojs/test-utils` (dev)

### Added to `apps/api`

- `puppeteer` (or `puppeteer-core` + system Chrome)

### Unchanged

- `tailwindcss`, `@tailwindcss/vite`
- `clsx`, `tailwind-merge`
- `zod`
- `typescript`
- `vitest`
- `@irfnd/schemas` (workspace package)

---

## 12. Z-Index Stack (Unchanged)

| Layer | Value |
|---|---|
| Navigation | `z-50` |
| Switchers | `z-60` |
| Language dropdown | `z-65` |
| Project dialog | `z-70` |
| Tooltips | `z-75` |
| Toasts | `z-80` |

---

## 13. Risk Mitigation

| Risk | Mitigation |
|---|---|
| GSAP ScrollTrigger doesn't match Framer Motion feel | Tune easing/duration params; GSAP has extensive easing options |
| Puppeteer PDF quality differs from @react-pdf | CSS print styles give fine-grained control; test early |
| Astro component testing is immature | Fall back to string-based HTML assertions if container API is limited |
| 100% coverage hard without React Testing Library | Client scripts are pure DOM manipulation — fully testable with jsdom |
| Large migration scope | Incremental approach ensures each page works before moving to next |
| Puppeteer adds heavy dependency to API | Use `puppeteer-core` with system Chrome to reduce size; consider caching generated PDFs |
