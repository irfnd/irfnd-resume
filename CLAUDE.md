# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

- `__root.tsx` — Root layout: two-column grid (sticky sidebar + main content), decorative gradients, theme/language switchers
- `index.tsx` — Home page (`/`)
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

### Content & i18n

All page content lives in `src/i18n/en.ts` and `src/i18n/id.ts` as typed translation objects. Types are defined in `src/types/i18n.ts`. Components access content via `useTranslation()` hook.

### Path Alias

`@/` maps to `src/` (configured in both `tsconfig.app.json` and `vite.config.ts`).

### Code Splitting

Vite manual chunks: `tanstack`, `framer-motion`, `react-vendor` (React + Base UI + icons).
