# irfnd.id — Personal Portfolio & Resume

Personal portfolio and resume site built as a **Turborepo monorepo** with React 19, TypeScript, and Vite. Features bilingual content (English/Indonesian), on-demand PDF resume generation, dark/light mode, and a contact form API service.

**Live:** [https://irfnd.id](https://irfnd.id)

---

## Monorepo Structure

```
irfnd-resume/
├── apps/
│   ├── web/             # React portfolio site (Vite + TanStack Router)
│   └── api/             # Contact form email service (Hono + Resend)
├── packages/
│   └── schemas/         # Shared Zod validation schemas
├── turbo.json           # Turborepo task configuration
└── package.json         # Root workspace config
```

---

## Tech Stack

| Category   | Tools                                                    |
| ---------- | -------------------------------------------------------- |
| Monorepo   | Turborepo, Bun                                           |
| Frontend   | React 19, TypeScript (strict), Vite 7, TanStack Router   |
| Backend    | Hono, Bun, Resend                                        |
| Styling    | Tailwind CSS 4, Framer Motion 12                         |
| Components | Base UI (headless), TanStack Form, Tabler Icons          |
| Validation | Zod 4 (shared schemas)                                   |
| PDF        | @react-pdf/renderer (lazy-loaded)                        |
| Testing    | Vitest, React Testing Library, 100% coverage (398 tests) |
| Quality    | ESLint 10, Prettier, Husky + lint-staged                 |

---

## Features

- **Bilingual** — English and Indonesian with a custom i18n context; language preference persisted in `localStorage`
- **Dark / light mode** — CSS variable theming toggled via `document.documentElement` class
- **On-demand PDF resume** — `@react-pdf/renderer` is never included in the initial bundle; it loads only when the user clicks Resume
- **Contact form** — TanStack Form with real-time Zod validation; sends emails via API with rate limiting and security layers
- **Project dialog** — click any project card to open a modal with an animated image gallery, tech stack, and links
- **Tooltips** — reusable `TooltipBubble` component on tech icons, theme switcher, and language switcher
- **Viewport animations** — reusable `FadeIn`, `SlideUp`, `StaggerContainer` wrappers using Framer Motion
- **Sticky sidebar** — profile and navigation stay fixed on desktop while the main content scrolls
- **SEO-ready** — OpenGraph, Twitter Card, JSON-LD structured data in `index.html`

---

## Getting Started

```bash
# Install dependencies
bun install

# Start all apps in dev mode
bun dev

# Build all apps
bun build

# Lint all apps
bun lint

# Format all apps
bun format

# Run all tests
bun test:run

# Run tests with UI
bun test:ui
```

### App-specific commands

```bash
# Run only web app
bun run --cwd apps/web dev

# Run only API
bun run --cwd apps/api dev
```

Pre-commit hooks (Husky + lint-staged) automatically run ESLint fix, Prettier, and related tests on staged files.

---

## Testing

| App       | Tests   | Files  | Coverage |
| --------- | ------- | ------ | -------- |
| Web       | 311     | 37     | 100%     |
| API       | 87      | 8      | 100%     |
| **Total** | **398** | **45** | **100%** |

```bash
# Run tests in watch mode
bun test

# Run tests with UI
bun test:ui

# Run tests once
bun test:run

# Run tests with coverage
bun test:coverage
```

---

## API Service

The API (`apps/api`) handles contact form submissions with email delivery via Resend.

### Endpoints

| Endpoint   | Method | Description                 |
| ---------- | ------ | --------------------------- |
| `/health`  | GET    | Health check (returns 'OK') |
| `/contact` | POST   | Send contact form email     |

### Security Layers

1. **CORS** — Only allows requests from configured origin
2. **Origin Header Validation** — Rejects mismatched origins
3. **API Key** — Requires `X-API-Key` header
4. **Referer Check** — Validates Referer header
5. **Rate Limiting** — 5 requests per IP per hour

### Environment Variables

```env
# API (apps/api/.env)
RESEND_API_KEY=       # Resend API key
EMAIL_TO=             # Recipient email
EMAIL_FROM=           # Sender email (verified domain)
CORS_ORIGIN=          # Frontend URL (https://irfnd.id)
API_KEY=              # Secret API key
RATE_LIMIT_MAX=       # Max requests per window (default: 5)
RATE_LIMIT_WINDOW_MS= # Window in ms (default: 3600000)

# Web (apps/web/.env)
VITE_API_URL=         # API URL (https://api.irfnd.id)
VITE_API_KEY=         # API key for authentication
```

### Deployment

API has a Dockerfile for Coolify deployment:

```bash
docker build -t irfnd-api apps/api
docker run -p 3000:3000 --env-file apps/api/.env irfnd-api
```

---

## Shared Packages

### Schemas (`packages/schemas`)

Shared Zod 4 validation schemas used by both API and Web apps:

```typescript
import { contactSchema, type ContactFormData } from '@irfnd/schemas';
```

---

## Architecture Notes

### Routing

TanStack Router with file-based routing. The route tree (`src/routeTree.gen.ts`) is auto-generated — do not edit it manually.

### i18n

All page content lives in `src/i18n/en.ts` and `src/i18n/id.ts` as typed objects. Components read translations via `useTranslation()`.

### PDF Generation

`useResumeDownload()` dynamically imports `@react-pdf/renderer` on demand. The library is split into four parallel chunks so they load simultaneously.

### Z-Index Stack

| Layer                                 | Value  |
| ------------------------------------- | ------ |
| Navigation bar (mobile fixed)         | `z-50` |
| Language / theme switchers container  | `z-60` |
| Language switcher dropdown positioner | `z-65` |
| Project dialog backdrop + popup       | `z-70` |
| Tooltip bubble                        | `z-75` |
| Toast notifications                   | `z-80` |

---

## License

MIT
