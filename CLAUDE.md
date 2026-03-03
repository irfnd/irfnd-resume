# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Maintenance Rule

**After every feature addition or adjustment, update this file to reflect the change.** This includes — but is not limited to — new components, new hooks, new routes, new dependencies, architectural decisions, import conventions, and build configuration changes. Keep all sections accurate and in sync with the actual codebase at all times.

## Key Dependencies

| Package         | Version | Notes                                 |
| --------------- | ------- | ------------------------------------- |
| React           | ^19.2   | React 19 with concurrent features     |
| Vite            | ^7.3    | Build tool                            |
| TanStack Router | ^1.163  | File-based routing                    |
| TanStack Form   | ^1.28   | Form state management                 |
| Tailwind CSS    | ^4.2    | Utility-first CSS                     |
| Framer Motion   | ^12.34  | Animations                            |
| Zod             | ^4.3    | Schema validation (v4 uses `.issues`) |
| Hono            | ^4.12   | API framework                         |
| Resend          | ^6.9    | Email delivery                        |
| ESLint          | ^10.0   | Linting (flat config)                 |
| Vitest          | ^4.0    | Testing                               |
| TypeScript      | ~5.9    | Type checking                         |

## Monorepo Structure

This is a **Turborepo monorepo** with the following structure:

```
irfnd-resume/
├── apps/
│   ├── web/                    # React portfolio site (Vite + TanStack Router)
│   └── api/                    # Contact form email service (Hono + Resend)
├── packages/
│   └── schemas/                # Shared Zod validation schemas
├── package.json                # Root workspace config
├── turbo.json                  # Turborepo task configuration
└── bun.lock                    # Lockfile
```

## Commands

All commands run via Turborepo from the root:

- **Dev server**: `bun dev` — Runs all apps in dev mode
- **Build**: `bun build` — Builds all apps
- **Lint**: `bun lint` (ESLint)
- **Format**: `bun format` (Prettier)
- **Test (watch)**: `bun test`
- **Test (single run)**: `bun test:run`
- **Test (coverage)**: `bun test:coverage`

### App-specific commands

```bash
# Run only web app
bun run --cwd apps/web dev

# Run only API
bun run --cwd apps/api dev
```

Pre-commit hooks (husky + lint-staged) auto-run ESLint fix, Prettier, and related tests on staged files.

## Apps

### Web App (`apps/web`)

React portfolio site with TanStack Router, Tailwind CSS 4, and Framer Motion.

### API (`apps/api`)

Contact form email service built with:

- **Hono** — Lightweight web framework
- **Resend** — Email delivery
- **Zod** — Validation

#### API Structure

```
apps/api/src/
├── index.ts             # App entry point with createApp()
├── routes/
│   └── contact.ts       # POST /contact endpoint
├── middleware/
│   ├── security.ts      # CORS, Origin, API key, Referer validation
│   └── rate-limit.ts    # IP-based rate limiting
├── services/
│   └── email.ts         # Resend email sending
├── schemas/
│   └── contact.ts       # Re-exports from @irfnd/schemas
├── types/
│   ├── email.ts         # EmailClient, SendEmailResult interfaces
│   ├── rate-limit.ts    # RateLimitEntry, RateLimitConfig interfaces
│   └── index.ts         # Barrel export
└── utils/
    ├── html.ts          # escapeHtml() for XSS prevention
    ├── ip.ts            # getClientIP() for rate limiting
    └── index.ts         # Barrel export
```

#### API Endpoints

| Endpoint   | Method | Description             |
| ---------- | ------ | ----------------------- |
| `/health`  | GET    | Health check            |
| `/contact` | POST   | Send contact form email |

#### Security Layers

1. **CORS** — Only allows requests from configured origin
2. **Origin Header Validation** — Server rejects if Origin doesn't match
3. **API Key** — Requires `X-API-Key` header
4. **Referer Check** — Validates Referer header
5. **Rate Limiting** — 5 requests per IP per hour (configurable)

#### Environment Variables (API)

```
RESEND_API_KEY=       # Resend API key
EMAIL_TO=             # Recipient email
EMAIL_FROM=           # Sender email (verified domain)
CORS_ORIGIN=          # Frontend URL (https://irfnd.id)
API_KEY=              # Secret API key
RATE_LIMIT_MAX=       # Max requests per window (default: 5)
RATE_LIMIT_WINDOW_MS= # Window in ms (default: 3600000)
PORT=                 # Server port (default: 3000)
```

#### Deployment

API has a Dockerfile for Coolify deployment:

```bash
docker build -t irfnd-api apps/api
docker run -p 3000:3000 --env-file apps/api/.env irfnd-api
```

### Shared Packages

#### Schemas (`packages/schemas`)

Shared Zod 4 validation schemas used by both API and Web apps:

```
packages/schemas/src/
├── contact.ts           # Contact form schema with i18n support
└── index.ts             # Barrel export
```

**Usage:**

```typescript
// In API (default English messages)
import { contactSchema, type ContactFormData } from '@irfnd/schemas';

// In Web (i18n messages)
import { createContactSchema, type ContactFormData } from '@irfnd/schemas';
const schema = createContactSchema(contactMe.validation); // Pass translated messages
```

**Schema Factory:** `createContactSchema(messages)` accepts a `ContactValidationMessages` object to support i18n. The default `contactSchema` export uses English messages (for API).

**Zod v4 Note:** Uses `result.error.issues` (not `.errors`) for validation error access.

## Testing

### Web App Testing

Unit tests use **Vitest** with **React Testing Library** in a jsdom environment. Tests are located in `apps/web/tests/` directory.

#### Structure

```
apps/web/tests/
├── setup.ts                  # Test setup (localStorage, matchMedia, IntersectionObserver mocks)
├── test-utils.tsx            # Custom render with I18n and Theme providers
├── router-utils.tsx          # Router testing utilities
├── index.ts                  # Barrel export
├── utils/                    # Utility function tests
├── hooks/                    # Hook tests
├── providers/                # Provider tests
├── contents/                 # Content tests
├── components/
│   ├── ui/                   # UI component tests
│   ├── layout/               # Layout component tests
│   ├── page/                 # Page component tests
│   └── pdf/                  # PDF component tests (mocked @react-pdf/renderer)
└── routes/                   # Route export tests
```

#### Coverage

Configured at **100%** for statements, branches, functions, and lines. Current: **311 tests across 37 test files**.

Files excluded from coverage (truly untestable):

- `src/routeTree.gen.ts` — auto-generated by TanStack Router with `@ts-nocheck`
- `src/main.tsx` — app entry point with side-effect `createRoot().render()`
- `src/types/**` — TypeScript type definitions (no runtime code)
- `src/**/index.ts` — barrel files with only `export` statements
- `src/utils/router.ts` — creates router depending on generated `routeTree`
- `src/routes/**` — route components requiring full TanStack Router integration

#### Testing Patterns

- Use `renderHook` with wrapper for hooks needing context
- Wrap components with `I18nProvider` and `ThemeProvider` for rendering
- Mock TanStack Router's `Link` and `useRouterState` for components using router
- Mock `@react-pdf/renderer` for PDF component tests (Document, Page, View, Text, Link)
- IntersectionObserver mock triggers immediately for Framer Motion animations
- localStorage resets before each test
- Use `/* v8 ignore next -- @preserve */` for unreachable code paths

### API Testing

Unit tests use **Vitest** in Node environment. Tests are located in `apps/api/tests/` directory.

#### Structure

```
apps/api/tests/
├── app.test.ts              # Integration tests for full app
├── schemas/
│   └── contact.test.ts      # Zod schema validation tests
├── middleware/
│   ├── security.test.ts     # Origin/API key validation tests
│   └── rate-limit.test.ts   # Rate limiting tests
├── services/
│   └── email.test.ts        # Email service tests (mocked Resend)
├── routes/
│   └── contact.test.ts      # Contact endpoint tests
└── utils/
    ├── html.test.ts         # HTML escaping tests
    └── ip.test.ts           # IP extraction tests
```

#### Coverage

Configured at **100%** for statements, branches, functions, and lines. Current: **87 tests across 8 test files**.

Files excluded from coverage:

- `src/types/**` — TypeScript type definitions (no runtime code)
- `src/**/index.ts` — barrel files with only `export` statements

#### Testing Patterns

- Use factory functions (`createRateLimitMiddleware`, `createSecurityMiddleware`) for configurable middleware
- Inject mock email client via `setEmailClient()` for email service tests
- Create fresh Hono app instances per test to isolate rate limit state
- Use `vi.stubEnv()` for environment variable testing
- Test middleware with `app.request()` method
- Use `/* v8 ignore next -- @preserve */` for unreachable defensive branches

#### Import Convention (API)

Uses `@/` path alias mapping to `src/` directory (same as web app):

```ts
import { contactSchema } from '@/schemas/contact';
import { createSecurityMiddleware } from '@/middleware/security';
```

### ESLint Configuration

All apps/packages use ESLint v10 with flat config format. Each config includes `tsconfigRootDir: import.meta.dirname` to support monorepo structure:

```js
// eslint.config.js (example)
export default tseslint.config(
	{ ignores: ['dist/**', 'node_modules/**'] },
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
);
```

## Architecture

Personal portfolio/resume site built with React 19, TypeScript (strict mode), and Vite 7.

### Routing

TanStack Router with **file-based routing** in `src/routes/`. The route tree is auto-generated in `src/routeTree.gen.ts` (do not edit manually). Routes:

- `__root.tsx` — Root layout: two-column grid (sticky sidebar + main content), decorative gradients, language/theme switchers in fixed top-right corner. Uses `overflow-x-clip` (not `overflow-x-hidden`) on the root div to allow the aside to be `position: sticky` — `overflow: hidden` would create a scroll container and break stickiness. `TanStackRouterDevtools` is conditionally lazy-loaded via `React.lazy` only when `import.meta.env.DEV` is `true` — in production it resolves to `() => null` so no devtools code ships to users.
- `index.tsx` — Home page (`/`): profile focus, professional journey, education history, technical stack, selected work
- `portfolio.tsx` — Portfolio with animated category tabs (`/portfolio`)
- `contact.tsx` — Contact page (`/contact`): uses TanStack Form with Zod validation from `@irfnd/schemas`

### Providers (apps/web/src/main.tsx)

Provider nesting order: `I18nProvider → ThemeProvider → ToastProvider → RouterProvider`

- **ThemeProvider** (`src/components/providers/theme-provider.tsx`): Dark/light mode via context, toggles `document.documentElement` class. Storage key: `irfnd-ui-theme`. Hook: `useTheme()`
- **I18nProvider** (`src/components/providers/i18n-provider.tsx`): English/Indonesian language support via context. Storage key: `irfnd-lang`. Hooks: `useI18n()`, `useTranslation()`, `useLanguage()`
- **ToastProvider** (`src/components/ui/toast.tsx`): Toast notification system. Hook: `useToast()`

### Environment Variables (Web)

```
VITE_API_URL=         # API URL (https://api.irfnd.id)
VITE_API_KEY=         # API key for authentication
```

### Styling

Tailwind CSS 4 with custom CSS variables for theming defined in `src/index.css`. Custom utilities: `noise-bg`, `glass-card`, `light-shadow`, `nav-item-active`, `pattern-grid`. Class merging uses `cn()` from `src/utils/cn.ts` (clsx + tailwind-merge).

Fonts: Inter (sans), JetBrains Mono (mono) — **self-hosted** in `public/fonts/` with `@font-face` declarations in `src/index.css`. Preloaded via `<link rel="preload">` in `index.html` for optimal LCP.

### Animation

Framer Motion with reusable viewport-triggered wrappers in `src/components/ui/motion-wrapper.tsx`:

- `FadeIn` / `SlideUp` — Single element animations on scroll
- `StaggerContainer` / `StaggerItem` — Staggered children animations

These support semantic HTML elements via the `as` prop. Custom `MotionLink` and `MotionTab` components wrap TanStack Router links and Base UI tabs with motion.

**Implementation note:** All wrappers use Framer Motion's `whileInView` + `viewport` props (not `useInView` + manual `animate`). This avoids the Framer Motion dev warning about scroll offset calculation which fires when `useInView` cannot find a non-static scroll container ancestor.

**Performance note:** The `TimelineBeam` component uses `willChange: 'transform'` on scroll-animated elements to optimize compositor layer creation and reduce forced reflows.

**Mobile hover fix:** All `whileHover` animations are mirrored in `whileTap` so touch devices receive the same visual feedback on press.

### Content & i18n

All page content lives in `src/i18n/en.ts` and `src/i18n/id.ts` as typed translation objects. Types are defined in `src/types/i18n.ts`. Components access content via `useTranslation()` hook.

`setHighlightText(text, keywords)` in `src/utils/text.ts` replaces keywords with `{0}`, `{1}` placeholders for the `HighlightText` UI component. When rendering plain text (e.g. in the PDF), use `resolveText(paragraph)` from `src/components/pdf/utils.ts` to restore the original words.

**Validation Messages:** `contactMe.validation` contains field-specific error messages (min/max length, email format, etc.) used by `createContactSchema()`. The `IContactValidation` interface defines the structure.

**Submitting Button:** `contactMe.submittingButton` provides i18n text shown alongside the loading spinner during form submission ("Sending..." / "Mengirim...").

#### Tech Stack Registry

`src/contents/tech-stack-list.ts` — Central registry of all technology entries used across portfolio and experience sections. Each entry has `label`, `url`, `icon`, and `color`. Use `getTechStack(['Label1', 'Label2'])` to select entries by label. Available labels: JavaScript, TypeScript, Python, Go, Alpine.js, React, Vue.js, Next.js, Express.js, NestJS, Flask, Django, Tailwind CSS, Shadcn UI, Ant Design, Material UI, Chakra UI, PostgreSQL, MongoDB, Redis, Firebase, Supabase, GraphQL, Docker, Linux, Swagger, Redux, Turborepo, Mapbox, Framer Motion.

#### Portfolio Projects

Projects in `portfolio.projects[]` support an optional `isSelected` boolean — when `true`, the project appears on the home page "Selected Works" section in addition to the full portfolio page. Current projects (7 total):

| Project                      | Category  | Type                       | isSelected |
| ---------------------------- | --------- | -------------------------- | ---------- |
| CEISA 4.0 (Licensing Module) | frontend  | private                    | yes        |
| Profdito                     | fullstack | private (en) / public (id) | yes        |
| StaffLab                     | frontend  | public                     | no         |
| Yellow Taxi Dashboard        | fullstack | public                     | yes        |
| Warehouse                    | frontend  | public                     | no         |
| Silegal                      | frontend  | public                     | yes        |
| Go-buks (API)                | backend   | public                     | no         |

### Hooks (apps/web/src/hooks/)

- `useTheme()` — dark/light mode toggle
- `useI18n()` — full i18n context (`language`, `setLanguage`, `t`)
- `useTranslation()` — returns the current `Translations` object
- `useLanguage()` — returns the current `Language` string
- `useYear()` — returns the current year
- `useResumeDownload()` — triggers lazy PDF generation and download; returns `{ download, loading }`
- `useToast()` — returns `{ toasts, addToast, removeToast }` for showing toast notifications

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

### Language Switcher

`src/components/layout/language-switcher.tsx` — `LanguageSwitcher` component in the fixed top-right corner. Uses `@base-ui/react/menu` with controlled `open`/`onOpenChange` state.

- **Close on select**: `onValueChange` calls `setOpen(false)` after applying the new language, so the menu closes immediately on selection.
- **Tooltip**: `TooltipBubble` wraps the trigger, showing `common.changeLanguage` ("Change Language" / "Ganti Bahasa"). Uses `disabled={open}` to prevent tooltip when dropdown is open.
- **Z-index**: `z-65` is on `Menu.Positioner` (not `Menu.Popup`) — the positioner is the outermost element in the portal and controls stacking order relative to other fixed elements (nav `z-50`, switchers container `z-60`).

### Theme Switcher

`src/components/layout/theme-switcher.tsx` — `ThemeSwitcher` button in the fixed top-right corner. Wrapped with `TooltipBubble` showing `common.changeTheme` ("Change Theme" / "Ganti Tema").

### Navigation Menu

`src/components/layout/navigation-menu.tsx` iterates over `navigation` translations. Items with `url === '/resume'` are rendered as a `motion.button` that triggers PDF download; all other items are rendered as `MotionLink` (TanStack Router `Link` wrapped with Framer Motion).

### Project Dialog

`src/components/ui/project-dialog.tsx` — `ProjectDialog` component rendered inside each `ProjectCard`. Uses `@base-ui/react/dialog` for accessibility (focus trap, scroll lock, ARIA) with CSS transitions via `data-open:` Tailwind variants for enter/exit animations.

- **Trigger**: clicking anywhere on a `ProjectCard` opens the dialog (inner links use `e.stopPropagation()` to remain independent)
- **Image gallery**: cycles through `project.image[]` with prev/next buttons; images slide left/right using Framer Motion `AnimatePresence` with directional spring animation based on navigation direction. Clicking an image opens the original Cloudinary URL in a new tab (`cursor-zoom-in`). Only shown when images exist
- **Close button**: red background (`bg-red-500/80`) with white icon for high contrast visibility
- **Body**: project name, type badge (internal/public), full `summary` paragraphs via `HighlightText` (uses default highlight style — blue badge, same as professional journey), `TechIcon` grid with tooltips
- **Footer**: Source Code / Live Demo buttons for public projects
- **Border**: borderless dialog (`border-none`) for a cleaner look in both themes
- **Z-index**: backdrop and popup at `z-70` (above nav `z-50`, above switchers container `z-60`, above language switcher positioner `z-65`)

### Tooltip Bubble

`apps/web/src/components/ui/tooltip-bubble.tsx` — Reusable tooltip component wrapping Base UI `@base-ui/react/tooltip` with Framer Motion spring animation.

- **Props**: `label` (tooltip content), `side` (position: `top` | `bottom` | `left` | `right`, default `bottom`), `disabled` (prevents tooltip from opening, used when parent menu is open), `children` (trigger element)
- **Controlled internally**: Manages its own `open` state to avoid React controlled/uncontrolled warnings
- **Animation**: Framer Motion spring (`stiffness: 400, damping: 25`) with directional slide based on `side` prop
- **Arrow**: SVG triangle that auto-rotates via `data-[side=*]` attributes to always point toward the trigger element
- **Z-index**: `z-75` (above dialog `z-70`)
- **Used by**: `TechIcon` (when `withLabel` is false), `ThemeSwitcher`, `LanguageSwitcher`

### Toast Notifications

`apps/web/src/components/ui/toast.tsx` — Toast notification system with Framer Motion animations.

- **Components**: `ToastProvider` (context + container), `useToast` hook
- **Variants**: `success` (green), `error` (red), `warning` (yellow), `info` (blue)
- **Position**: Fixed top-right corner (`top-4 right-4`)
- **Usage**: `const { addToast } = useToast(); addToast('Message', 'error', 5000);`
- **Auto-dismiss**: Default 5 seconds, configurable via `duration` parameter
- **Z-index**: `z-80` (above all other UI elements)
- **Used by**: Contact form for API error feedback (rate limit, network, validation errors)

### Contact Form

The contact page (`/contact`) uses **TanStack Form** with **Zod validation** from the shared `@irfnd/schemas` package.

- **Form library**: `@tanstack/react-form` with `validators.onChange: contactSchema`
- **Validation**: Real-time field validation with i18n error messages
- **Schema**: `createContactSchema(contactMe.validation)` from `@irfnd/schemas` — creates schema with translated messages
- **i18n reactivity**: `ContactForm` component is keyed by `language` to remount when language changes, ensuring new validation messages take effect
- **API integration**: Submits to `${VITE_API_URL}/contact` with `X-API-Key` header
- **Error handling**: Toast notifications for rate limit, validation, network, and server errors
- **Loading state**: Button shows spinner + i18n text (`submittingButton`) while submitting
- **Success state**: Animated overlay with success message and "send another" button

### Utilities (apps/web/src/utils/)

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
- **Alternate languages** — `hreflang` links for `en`, `id`, and `x-default`
- **Open Graph** — `og:type`, `og:url`, `og:site_name`, `og:title`, `og:description`, `og:image` (with `width`, `height`, `alt`), `og:locale`
- **Twitter Card** — `summary_large_image` with `twitter:site`, `twitter:creator`, `twitter:title`, `twitter:description`, `twitter:image`
- **JSON-LD** — `schema.org/Person` structured data with name, jobTitle, url, email, image, address, sameAs links
- **Theme color** — `<meta name="theme-color">` for dark (#030303) and light (#f8fafc) with media queries
- **`position: relative` on `<html>`** — required so Framer Motion's `useScroll` (used in `TimelineBeam`) can verify the scroll container has a non-static position; without this a dev warning fires on every render
- **Theme initializer script** — runs before first paint to apply the saved theme class; uses storage key `irfnd-ui-theme`
- **Font preloading** — `<link rel="preload">` for self-hosted Inter and JetBrains Mono woff2 files in `public/fonts/`
- **Favicon** — `favicon-{16,32,96}.png` and `apple-icon-{57,60,72,76}.png` in `public/`
- **sitemap.xml** — `public/sitemap.xml` with all routes and hreflang annotations
- **robots.txt** — `public/robots.txt` allowing all crawlers and referencing sitemap

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
