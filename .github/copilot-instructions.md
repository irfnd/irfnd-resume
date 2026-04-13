# Copilot Instructions

## Commands

Turborepo monorepo using **Bun** as the package manager.

```bash
# All apps
bun dev              # Dev servers
bun build            # Build all
bun lint             # ESLint (flat config, v10)
bun format           # Prettier
bun test:run         # All tests once
bun test:coverage    # All tests with coverage

# Single app
bun run --cwd apps/web dev
bun run --cwd apps/api dev

# Single test file
bun run --cwd apps/web vitest run tests/hooks/useYear.test.ts
bun run --cwd apps/api vitest run tests/utils/html.test.ts
```

Pre-commit hooks (Husky + lint-staged) auto-run ESLint fix, Prettier, and related tests on staged files.

## Architecture

Turborepo monorepo with three workspaces:

- **`apps/web`** — React 19 portfolio site (Vite 7, TanStack Router with file-based routing, Tailwind CSS 4, Framer Motion)
- **`apps/api`** — Contact form email service (Hono on Bun, Resend for email delivery)
- **`packages/schemas`** — Shared Zod 4 validation schemas consumed by both apps

### Web App

- **Routing**: TanStack Router with file-based routing in `src/routes/`. Route tree is auto-generated in `src/routeTree.gen.ts` — never edit it manually.
- **i18n**: English (`src/i18n/en.ts`) and Indonesian (`src/i18n/id.ts`) as typed translation objects. Access via `useTranslation()` hook. No external i18n library.
- **Providers** (nesting order): `I18nProvider → ThemeProvider → ToastProvider → RouterProvider`
- **PDF generation**: `@react-pdf/renderer` is lazily loaded via dynamic `import()` inside `useResumeDownload` — never in the initial bundle. PDF components receive data as props (not hooks) because the PDF reconciler doesn't share DOM context.
- **Styling**: Tailwind CSS 4 with CSS variable theming in `src/index.css`. Class merging via `cn()` from `src/utils/cn.ts` (clsx + tailwind-merge). Self-hosted fonts (Inter, JetBrains Mono).
- **Animations**: Framer Motion with reusable viewport-triggered wrappers (`FadeIn`, `SlideUp`, `StaggerContainer`). Use `whileInView` + `viewport` props — not `useInView`. Mirror `whileHover` in `whileTap` for mobile.

### API

- Security layers: CORS → Origin validation → API key (`X-API-Key`) → Referer check → Rate limiting
- Factory functions (`createRateLimitMiddleware`, `createSecurityMiddleware`) for configurable middleware
- Email client injected via `setEmailClient()` for testability

### Shared Schemas

`createContactSchema(messages)` accepts i18n validation messages. The default `contactSchema` export uses English (for API). Zod v4: use `result.error.issues` (not `.errors`).

## Key Conventions

### Imports

Always use `@/` path alias (maps to `src/`) for cross-module imports. Relative imports only in `index.ts` barrel files.

```ts
// ✅
import { useTranslation } from '@/hooks';

// ❌
import { useTranslation } from '../../hooks';
```

Both apps use `@/` alias. Web app tests also have `@test/` mapping to `tests/`.

### Testing

- **100% coverage** enforced for both apps (statements, branches, functions, lines)
- Web: Vitest + React Testing Library in jsdom. Tests in `apps/web/tests/`.
- API: Vitest in Node. Tests in `apps/api/tests/`.
- Use `/* v8 ignore next -- @preserve */` for unreachable defensive branches
- Web test utilities: custom `render` with providers in `tests/test-utils.tsx`

### Z-Index Stack

Strict layering order — don't introduce arbitrary z-index values:

| Layer              | Value  |
| ------------------ | ------ |
| Navigation         | `z-50` |
| Switchers          | `z-60` |
| Language dropdown  | `z-65` |
| Project dialog     | `z-70` |
| Tooltips           | `z-75` |
| Toasts             | `z-80` |

### Code Splitting

Vite manual chunks split PDF dependencies into parallel-loading chunks (`react-pdf`, `pdf-font`, `pdf-layout`). All PDF code loads only on user action.

### Content

All user-facing text lives in the i18n translation files — never hardcode strings in components. Tech stack entries are in `src/contents/tech-stack-list.ts`; use `getTechStack(['Label1'])` to select entries.
