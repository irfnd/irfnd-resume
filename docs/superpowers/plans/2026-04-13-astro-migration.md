# Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate apps/web from React 19 (Vite + TanStack Router) to Astro with pure Astro
components, GSAP animations, vanilla JS interactivity, Astro built-in i18n, and server-side
PDF generation on apps/api.

**Tech Stack:** Astro (SSG), GSAP + ScrollTrigger, Tailwind CSS 4, astro-icon + @iconify-json,
Puppeteer (API), Vitest + happy-dom, Zod 4

**Design Spec:** docs/superpowers/specs/2026-04-13-astro-migration-design.md

---

## Phase 1: Foundation Setup

### 1.1 Install Astro and Configure Build
- [ ] Remove React/Vite deps from apps/web/package.json:
  react, react-dom, @types/react, @types/react-dom, @vitejs/plugin-react,
  vite, @tanstack/react-router, @tanstack/router-plugin, @tanstack/router-devtools,
  framer-motion, react-icons, @react-pdf/renderer
- [ ] Add Astro deps:
  astro, @astrojs/tailwind (or use Astro 5 built-in CSS),
  astro-icon, @iconify-json/lucide, @iconify-json/simple-icons,
  gsap (with ScrollTrigger)
- [ ] Create astro.config.mjs with:
  - output: 'static'
  - i18n config: defaultLocale 'en', locales ['en', 'id'], routing prefixDefaultLocale true
  - Tailwind integration
  - site URL for production
- [ ] Create src/env.d.ts with Astro client types reference
- [ ] Update tsconfig.json to extend astro/tsconfigs/strict
- [ ] Verify: bun run --cwd apps/web astro build produces empty site

## Phase 2: i18n System

### 2.1 i18n Utilities
- [ ] Create src/i18n/utils.ts with:
  - getLangFromUrl(url: URL): Lang — extract 'en' or 'id' from pathname
  - useTranslations(lang: Lang): TranslationObject — return en or id translations
  - getLocalizedPath(lang: Lang, path: string): string — build localized URL
- [ ] Write tests/i18n/utils.test.ts covering all helpers

### 2.2 Migrate Translation Files
- [ ] Rewrite src/types/i18n.ts: replace all React.ComponentType icon types with string
  (Iconify icon name). Remove all React imports.
- [ ] Rewrite src/types/utility.ts: remove React.ReactNode references if any
- [ ] Migrate src/i18n/en.ts: replace React icon imports (e.g. LuBriefcaseBusiness)
  with Iconify string names (e.g. 'lucide:briefcase-business')
- [ ] Migrate src/i18n/id.ts: same icon string replacement
- [ ] Migrate src/contents/tech-stack-list.ts: replace react-icons imports with Iconify names
- [ ] Verify: all imports resolve, no React references remain in i18n/types/contents

## Phase 3: Vanilla JS Scripts

### 3.1 Core Scripts
- [ ] Create src/scripts/gsap-init.ts:
  - Register ScrollTrigger plugin
  - Scan for data-gsap-fade, data-gsap-slide-up, data-gsap-stagger attributes
  - Apply GSAP animations (fromTo with autoAlpha, y transforms)
  - Export initGSAP() function
- [ ] Create src/scripts/theme.ts:
  - Read theme from localStorage or prefers-color-scheme
  - Toggle dark class on documentElement
  - Update data-theme attribute
  - Listen for theme-toggle button clicks
- [ ] Create src/scripts/language.ts:
  - Get current lang from URL path
  - On switcher click, navigate to equivalent path in other language
  - Handle dropdown open/close with click-outside detection
- [ ] Create src/scripts/toast.ts:
  - showToast(message, type) function
  - Auto-dismiss after 5 seconds
  - Queue management for multiple toasts
  - Expose on window for other scripts to call
- [ ] Write tests for all core scripts

### 3.2 Feature Scripts
- [ ] Create src/scripts/contact-form.ts:
  - Client-side Zod validation using shared schema
  - Fetch POST to API endpoint
  - Show toast on success/error
  - Loading state on submit button
- [ ] Create src/scripts/project-dialog.ts:
  - Open/close native <dialog> element
  - GSAP carousel for project images
  - Keyboard navigation (Escape to close, arrows for carousel)
  - Trap focus within dialog when open
- [ ] Create src/scripts/resume-download.ts:
  - Fetch PDF from API /resume endpoint
  - Show loading toast during generation
  - Trigger download via blob URL
  - Error handling with toast notification
- [ ] Write tests for all feature scripts

## Phase 4: Layout Components

### 4.1 Base Layout
- [ ] Create src/layouts/BaseLayout.astro:
  - Accept lang, title, description props
  - HTML head with meta, fonts (Inter, JetBrains Mono self-hosted)
  - Body with sidebar + main content area (slot)
  - Script imports at bottom: gsap-init, theme, language, toast
  - Tailwind dark mode support via class strategy

### 4.2 Layout Components
- [ ] Create src/components/layout/Sidebar.astro:
  - Profile image, name, title
  - Navigation links (Home, Portfolio, Contact)
  - Social links with icons
  - Theme switcher and language switcher
- [ ] Create src/components/layout/Navigation.astro:
  - Mobile-responsive top nav
  - Current route highlighting via Astro.url comparison
- [ ] Create src/components/layout/Footer.astro:
  - Copyright with dynamic year (Astro new Date().getFullYear())
  - Contact links
- [ ] Create src/components/layout/ThemeSwitcher.astro:
  - Sun/moon icon toggle
  - data-theme-toggle attribute for script binding
- [ ] Create src/components/layout/LanguageSwitcher.astro:
  - Dropdown with EN/ID options
  - Current language indicator
  - Links to equivalent pages in other language

## Phase 5: UI Components

### 5.1 Reusable UI Components
- [ ] Create src/components/ui/TechIcon.astro:
  - Accept icon (string), label, color props
  - Render astro-icon Icon component with dynamic name
  - Apply color as CSS variable for theming
- [ ] Create src/components/ui/HighlightText.astro:
  - Parse translation strings with {bold} markers
  - Render <strong> tags for highlighted segments
- [ ] Create src/components/ui/TimelineBeam.astro:
  - Vertical line with GSAP scroll-driven progress
  - data-gsap attributes for animation binding
- [ ] Create src/components/ui/TimelineItem.astro:
  - Date, title, description, icon
  - Dot indicator on timeline beam
- [ ] Create src/components/ui/ProjectCard.astro:
  - Thumbnail, title, tech tags
  - Click handler opens ProjectDialog
  - data-project-id attribute for script binding
- [ ] Create src/components/ui/ProjectDialog.astro:
  - Native <dialog> element
  - Image carousel, description, links
  - Close button, backdrop click to close
  - z-70 per z-index stack convention
- [ ] Create src/components/ui/Toast.astro:
  - Fixed container at bottom-right (z-80)
  - Template for toast items (success/error variants)
- [ ] Create src/components/ui/Tooltip.astro:
  - CSS-only tooltip using :hover and ::after
  - Accept text and position props
- [ ] Create src/components/ui/ContactForm.astro:
  - Name, email, message fields
  - Submit button with loading state
  - data-contact-form attribute for script binding
- [ ] Create src/components/ui/MapEmbed.astro:
  - Mapbox static image or iframe
  - Lazy loading with loading='lazy'

## Phase 6: Page Section Components

### 6.1 Home Page Sections
- [ ] Create src/components/page/home/ProfileFocus.astro:
  - Grid of focus/specialty cards
  - Each card has icon, title, description
  - GSAP stagger animation on scroll
- [ ] Create src/components/page/home/ProfessionalJourney.astro:
  - TimelineBeam + TimelineItem list
  - Work experience entries from translations
- [ ] Create src/components/page/home/SelectedWork.astro:
  - Featured project cards (max 3-4)
  - Link to full portfolio page
- [ ] Create src/components/page/home/TechnicalStack.astro:
  - Grouped tech stack grid (Frontend, Backend, Tools)
  - TechIcon components with tooltips
- [ ] Create src/components/page/home/EducationHistory.astro:
  - Timeline of education entries

## Phase 7: Pages

### 7.1 Page Routes
- [ ] Create src/pages/index.astro:
  - Redirect to /en/ (or browser preferred language)
- [ ] Create src/pages/[lang]/index.astro:
  - getStaticPaths returns [{params: {lang: 'en'}}, {params: {lang: 'id'}}]
  - Import and compose all home page sections
  - Pass translations to each section
- [ ] Create src/pages/[lang]/portfolio.astro:
  - getStaticPaths for both languages
  - Portfolio grid with filter/category tabs
  - ProjectDialog for detail view
- [ ] Create src/pages/[lang]/contact.astro:
  - getStaticPaths for both languages
  - Contact form + map embed
  - Resume download button
- [ ] Verify: all pages build and render correctly for both languages

## Phase 8: API Resume Endpoint

### 8.1 Server-side PDF Generation
- [ ] Add puppeteer to apps/api/package.json
- [ ] Create src/templates/resume.ts:
  - HTML template string with inline CSS
  - Accept resume data (name, experience, education, skills)
  - Print-optimized layout (A4)
- [ ] Create src/routes/resume.ts:
  - GET /resume?lang=en|id
  - Launch Puppeteer, render HTML template, generate PDF
  - Return PDF with Content-Type: application/pdf
  - Cache generated PDFs (optional, in-memory or file)
  - Apply existing security middleware (CORS, origin, API key)
- [ ] Register route in src/index.ts
- [ ] Write tests for template rendering and route handler

## Phase 9: Testing

### 9.1 Test Setup
- [ ] Create vitest.config.ts for apps/web:
  - happy-dom environment
  - Path aliases: @/ -> src/, @test/ -> tests/
  - Coverage thresholds: 100% (statements, branches, functions, lines)
- [ ] Migrate existing utility tests (cn, text, cloudinary, portfolio)
  These should need minimal changes since utilities are framework-agnostic

### 9.2 Script Tests
- [ ] Write tests for src/scripts/gsap-init.ts
  - Mock GSAP and ScrollTrigger
  - Test data-attribute scanning and animation setup
- [ ] Write tests for src/scripts/theme.ts
  - Mock localStorage, matchMedia
  - Test theme toggle, persistence, system preference detection
- [ ] Write tests for src/scripts/language.ts
  - Test URL parsing, language detection, navigation
- [ ] Write tests for src/scripts/toast.ts
  - Test show/dismiss/queue behavior, auto-removal timer
- [ ] Write tests for src/scripts/contact-form.ts
  - Mock fetch, test validation, submission, error handling
- [ ] Write tests for src/scripts/project-dialog.ts
  - Test dialog open/close, carousel navigation, keyboard handling
- [ ] Write tests for src/scripts/resume-download.ts
  - Mock fetch + blob, test download trigger, error handling

### 9.3 Component Tests
- [ ] Test Astro components using container API (@astrojs/test-utils)
  - Render components with various props
  - Assert HTML output contains expected elements and attributes
  - Test i18n: components render correct translations for each language
- [ ] Test API resume route and template
- [ ] Achieve 100% coverage across all test suites

## Phase 10: Cleanup and Finalization

### 10.1 Remove React Artifacts
- [ ] Delete all React source files (components, providers, hooks, routes)
- [ ] Delete vite.config.ts
- [ ] Delete old test files
- [ ] Remove React-specific entries from tsconfig.json (jsx: react-jsx, etc.)
- [ ] Clean up any unused dependencies in package.json
- [ ] Run bun install to update lockfile

### 10.2 Final Verification
- [ ] bun run --cwd apps/web astro build — clean build, no errors
- [ ] bun run --cwd apps/web astro preview — all pages render correctly
- [ ] bun test:run — all tests pass
- [ ] bun test:coverage — 100% coverage maintained
- [ ] bun lint — no lint errors
- [ ] bun format — formatting consistent
- [ ] Manual check: both /en/ and /id/ routes work
- [ ] Manual check: theme toggle, language switch, project dialog, contact form all functional
- [ ] Manual check: resume download triggers API call and returns PDF

---

## Key Decisions and Notes

1. **No React islands:** Zero React components. All interactivity via vanilla JS scripts.
2. **GSAP over CSS animations:** Provides ScrollTrigger, timeline control, and complex sequencing
   that CSS alone cannot match for the portfolio's animation requirements.
3. **Native <dialog>:** For project detail modals. Better accessibility defaults than custom modals.
4. **Puppeteer PDF:** Moves PDF generation server-side, removing ~200KB+ of client-side PDF deps.
   Allows richer HTML/CSS templates vs the limited react-pdf primitives.
5. **Iconify strings:** Replacing react-icons component imports with string identifiers
   (e.g., 'lucide:briefcase-business') used by astro-icon for SSG icon rendering.
6. **100% test coverage maintained:** Utility tests migrate with minimal changes. Script tests
   use happy-dom for DOM mocking. Component tests use Astro container API.
7. **Z-index stack preserved:** Same layering values (z-50 through z-80) applied to Astro components.
8. **Self-hosted fonts preserved:** Inter and JetBrains Mono loaded from /fonts/ in public dir.
