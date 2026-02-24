# irfnd.id — Personal Portfolio & Resume

Personal portfolio and resume site built with React 19, TypeScript, and Vite. Features bilingual content (English/Indonesian), on-demand PDF resume generation, and dark/light mode.

**Live:** [https://irfnd.id](https://irfnd.id)

---

## Tech Stack

| Category   | Tools                                          |
| ---------- | ---------------------------------------------- |
| Framework  | React 19, TypeScript (strict), Vite 7          |
| Routing    | TanStack Router (file-based)                   |
| Styling    | Tailwind CSS 4, Framer Motion 12               |
| Components | Base UI (headless), Tabler Icons, Simple Icons |
| PDF        | @react-pdf/renderer (lazy-loaded)              |
| Quality    | ESLint, Prettier, Husky + lint-staged          |

---

## Features

- **Bilingual** — English and Indonesian with a custom i18n context; language preference persisted in `localStorage`
- **Dark / light mode** — CSS variable theming toggled via `document.documentElement` class; preference persisted in `localStorage`
- **On-demand PDF resume** — `@react-pdf/renderer` is never included in the initial bundle; it loads in parallel chunks only when the user clicks the Resume button
- **Project dialog** — click any project card to open a modal with an image gallery, tech stack, and links
- **Viewport animations** — reusable `FadeIn`, `SlideUp`, `StaggerContainer` wrappers using Framer Motion's `whileInView`
- **Sticky sidebar** — profile and navigation stay fixed on desktop while the main content scrolls
- **SEO-ready** — OpenGraph, Twitter Card, JSON-LD structured data, and multiple favicon sizes in `index.html`

---

## Project Structure

```
src/
├── components/
│   ├── layout/       # Root layout, navigation, profile sidebar, switchers
│   ├── page/         # Page-specific sections (home, portfolio, contact)
│   ├── ui/           # Shared UI components (cards, dialog, timeline, motion wrappers)
│   ├── providers/    # Theme and i18n context providers
│   └── pdf/          # Lazy-loaded PDF resume components
├── routes/           # TanStack Router file-based routes
│   ├── __root.tsx    # Root layout
│   ├── index.tsx     # Home (/)
│   ├── portfolio.tsx # Portfolio (/portfolio)
│   └── contact.tsx   # Contact (/contact)
├── hooks/            # Custom hooks (useTheme, useI18n, useResumeDownload, …)
├── i18n/             # Translation objects — en.ts and id.ts
├── types/            # TypeScript type definitions
├── utils/            # cn(), text helpers, cloudinaryResize()
└── index.css         # Tailwind base + custom CSS variables and utilities
```

---

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Type-check and build
bun build

# Preview production build
bun preview

# Lint
bun lint

# Format
bun format
```

Pre-commit hooks (Husky + lint-staged) automatically run ESLint fix and Prettier on staged files.

---

## Architecture Notes

### Routing

TanStack Router with file-based routing. The route tree (`src/routeTree.gen.ts`) is auto-generated — do not edit it manually.

### i18n

All page content lives in `src/i18n/en.ts` and `src/i18n/id.ts` as typed objects. Components read translations via `useTranslation()`. The PDF renderer receives data as props (not via hooks) because it runs in its own React reconciler.

### PDF Generation

`useResumeDownload()` dynamically imports `@react-pdf/renderer` on demand. The library is split into four parallel chunks (`react-pdf`, `pdf-engine`, `pdf-font`, `pdf-layout`) so they all load simultaneously instead of sequentially.

### Animations

All viewport-triggered components use `whileInView` + `viewport` props instead of `useInView` — this avoids a Framer Motion dev warning that fires when the scroll container ancestor has `position: static`.

### Sticky Sidebar

The root div uses `overflow-x-clip` instead of `overflow-x-hidden`. The `hidden` value creates an implicit scroll container which breaks `position: sticky`; `clip` prevents horizontal overflow without that side effect.

### Z-Index Stack

| Layer                                 | Value    |
| ------------------------------------- | -------- |
| Navigation bar (mobile fixed)         | `z-50`   |
| Language / theme switchers container  | `z-60`   |
| Language switcher dropdown positioner | `z-[65]` |
| Project dialog backdrop + popup       | `z-[70]` |

---

## License

MIT
