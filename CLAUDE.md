# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio and resume site at [irfnd.id](https://irfnd.id). Turborepo monorepo using Bun as the package manager and runtime.

> **Note:** The README.md describes a React/Vite/TanStack Router stack — that is outdated. The web app was migrated to **Astro** (static output). Trust the code, not the README.

## Monorepo Structure

```
apps/
  web/    # Astro 6 static site — portfolio + resume pages
  api/    # Hono API on Bun — PDF resume generation + contact form
packages/
  data/   # All resume/portfolio content as typed, validated collections
  schemas/  # Shared Zod schemas (used by both web and api)
```

## Commands

Run from the repo root (Turborepo orchestrates all apps):

```bash
bun dev              # Start all apps in dev mode
bun build            # Build all apps
bun lint             # Lint all apps
bun format           # Format all apps
bun test:run         # Run all tests once
bun test             # Run tests in watch mode
bun test:ui          # Run tests with Vitest UI + coverage
bun test:coverage    # Run tests with coverage report
```

Run a single app:

```bash
bun run --cwd apps/web dev
bun run --cwd apps/api dev
bun run --cwd apps/web test:run
bun run --cwd apps/api test:run
```

Pre-commit hooks (Husky + lint-staged) run ESLint fix, Prettier, and related tests automatically on staged files.

## Architecture

### `apps/web` — Astro Static Site

- **Output:** fully static (`output: 'static'` in `astro.config.ts`)
- **i18n:** URL path-based routing via Astro's built-in `i18n` config. All pages live under `/en/` and `/id/`. The root `/` rewrites to `/en/`. Language switching navigates to the equivalent path in the target locale.
- **Styling:** Tailwind CSS 4 via `@tailwindcss/vite` plugin. No separate `tailwind.config.*` — config lives in `src/index.css`.
- **Icons:** `astro-icon` with `@iconify-json/*` collections (lucide, simple-icons, tabler).
- **Animations:** GSAP 3 initialized in `src/scripts/gsap-init.ts`.
- **Client scripts:** Interactive behaviors (theme, language switcher, toast, project dialog, resume download) are vanilla TypeScript scripts in `src/scripts/`. They wire up via `data-*` attributes on HTML elements — no framework component hydration.
- **Env vars:** prefixed `PUBLIC_` (Astro convention). `PUBLIC_API_URL` and `PUBLIC_API_KEY` are passed as `data-*` attributes to client scripts rather than imported directly in scripts.
- **Theme:** persisted in `localStorage` as `irfnd-ui-theme`. Applied via `document.documentElement` class (`dark`/`light`). Default is `dark`.

### `apps/api` — Hono API

- **Runtime:** Bun (`bun run --hot` for dev, `bun build` for production)
- **Routes:**
  - `GET /health` — liveness probe
  - `POST /contact` — validates with Zod, sends email via Resend
  - `GET /resume?lang=en|id` — dynamically imports `@react-pdf/renderer`, renders `ResumePDF` template, streams PDF
- **Security layers:** CORS → origin/referer validation → API key check → per-IP rate limiting (5 req/hour default)
- **Deployment:** Dockerfile for Coolify; multi-stage build using `oven/bun:1.3-alpine`

### `packages/data`

Single source of truth for all resume/portfolio content. Each collection exports bilingual data (`en`/`id`) as typed arrays validated with Zod schemas. Use `getByLang(collection, lang)` helper to retrieve the correct locale slice.

### `packages/schemas`

Shared Zod 4 schemas. The contact form schema has two variants:
- `contactSchema` — default English messages (used by API)
- `createContactSchema(messages)` — accepts i18n messages object (used by web)

## Environment Variables

**`apps/api/.env`** (see `.env.example`):
```
RESEND_API_KEY, EMAIL_TO, EMAIL_FROM, CORS_ORIGIN, API_KEY, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS, PORT
```

**`apps/web/.env`** (see `.env.example`):
```
PUBLIC_API_URL, PUBLIC_API_KEY
```
