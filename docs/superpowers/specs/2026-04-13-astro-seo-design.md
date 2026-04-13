# Astro SEO Enhancement — Design Spec

## Problem

The migrated Astro portfolio site has minimal SEO: only basic `<title>` and `<meta name="description">`. It is missing Open Graph tags, Twitter Cards, canonical URLs, hreflang links in HTML `<head>`, and JSON-LD structured data. Lighthouse SEO score is 92 — we want to bring it to 100.

## Approach

Install `astro-seo` for declarative meta tag management, create a reusable `<SEO>` wrapper component with site defaults, add i18n-aware SEO strings, and include JSON-LD structured data (Person + WebSite schemas).

## Site Details

- **Production domain**: `https://irfnd.id`
- **Twitter handle**: `@irfnd_iqbl`
- **OG images**: Skipped for now (no image)
- **Locales**: `en` (English), `id` (Indonesian)
- **Owner**: Irfandi Iqbal Abimanyu, Fullstack Web Developer

---

## 1. Dependencies

### Install

- `astro-seo` — declarative SEO meta tag component

### Configure

- Fix `astro.config.mjs` site to `https://irfnd.id`
- Add i18n config to `@astrojs/sitemap`:
  ```js
  sitemap({
    i18n: {
      defaultLocale: 'en',
      locales: { en: 'en-US', id: 'id-ID' },
    },
  })
  ```

---

## 2. i18n SEO Keys

Add an `seo` section to the `Translations` type and both locale files.

### Type Addition (`ISeо`)

```ts
export interface ISeo {
  home: { title: string; description: string };
  portfolio: { title: string; description: string };
  contact: { title: string; description: string };
}
```

Add `seo: ISeo` to the `Translations` interface.

### English (`en.ts`)

```ts
seo: {
  home: {
    title: 'Irfandi Iqbal Abimanyu — Fullstack Web Developer',
    description: 'Portfolio of Irfandi Iqbal Abimanyu, a Fullstack Web Developer based in Jakarta, Indonesia. Explore projects, experience, and technical skills.',
  },
  portfolio: {
    title: 'Portfolio',
    description: 'Browse projects by Irfandi Iqbal Abimanyu — web applications built with React, Next.js, Node.js, Go, and more.',
  },
  contact: {
    title: 'Contact',
    description: 'Get in touch with Irfandi Iqbal Abimanyu for freelance, collaboration, or job opportunities.',
  },
},
```

### Indonesian (`id.ts`)

```ts
seo: {
  home: {
    title: 'Irfandi Iqbal Abimanyu — Pengembang Web Fullstack',
    description: 'Portofolio Irfandi Iqbal Abimanyu, seorang Pengembang Web Fullstack yang berbasis di Jakarta, Indonesia. Jelajahi proyek, pengalaman, dan keahlian teknis.',
  },
  portfolio: {
    title: 'Portofolio',
    description: 'Jelajahi proyek karya Irfandi Iqbal Abimanyu — aplikasi web yang dibangun dengan React, Next.js, Node.js, Go, dan lainnya.',
  },
  contact: {
    title: 'Kontak',
    description: 'Hubungi Irfandi Iqbal Abimanyu untuk freelance, kolaborasi, atau peluang kerja.',
  },
},
```

---

## 3. SEO Component (`src/components/common/SEO.astro`)

A reusable wrapper around `astro-seo`'s `<SEO>` component with site-wide defaults.

### Props

```ts
interface Props {
  title: string;
  description: string;
  noindex?: boolean;
}
```

### Behavior

- **Title template**: `%s — Irfandi Iqbal Abimanyu` (home page uses raw title, no template)
- **Canonical URL**: Auto-computed from `Astro.url.pathname` + `Astro.site`
- **Hreflang alternates**: Auto-computed for both locales based on current URL path
  - `/en/portfolio` → alternates: `[{ href: .../en/portfolio, hrefLang: 'en' }, { href: .../id/portfolio, hrefLang: 'id' }]`
- **Open Graph**: type `website`, locale `en_US` or `id_ID`, siteName `Irfandi Iqbal Abimanyu`
- **Twitter Card**: `summary`, site `@irfnd_iqbl`
- **Robots**: `index, follow` by default; `noindex` when prop is true
- **Theme color**: read from CSS variable or hardcode `#0f172a` (dark) — use `<meta name="theme-color">`

### Alternate URL Generation Logic

```ts
const currentPath = Astro.url.pathname;
const lang = getLangFromUrl(Astro.url);
const otherLang = lang === 'en' ? 'id' : 'en';
const pathWithoutLang = currentPath.replace(/^\/(en|id)/, '');
const alternates = [
  { href: `${site}/en${pathWithoutLang}`, hrefLang: 'en' },
  { href: `${site}/id${pathWithoutLang}`, hrefLang: 'id' },
];
```

---

## 4. BaseLayout Integration

Replace the current manual `<title>` and `<meta name="description">` with the `<SEO>` component.

### Before

```astro
<title>{title}</title>
<meta name="description" content={description} />
```

### After

```astro
<SEO title={title} description={description} />
```

The `<meta charset>`, `<meta viewport>`, font preloads, favicon, and theme-flash script remain unchanged.

---

## 5. Page Updates

Each page passes i18n-sourced SEO strings to `BaseLayout`:

### Home (`en/index.astro`, `id/index.astro`)

```astro
<BaseLayout title={t.seo.home.title} description={t.seo.home.description}>
```

Home page uses the full title directly (no template suffix since the name is already in it).

### Portfolio (`en/portfolio.astro`, `id/portfolio.astro`)

```astro
<BaseLayout title={t.seo.portfolio.title} description={t.seo.portfolio.description}>
```

Title template applies: "Portfolio — Irfandi Iqbal Abimanyu"

### Contact (`en/contact.astro`, `id/contact.astro`)

```astro
<BaseLayout title={t.seo.contact.title} description={t.seo.contact.description}>
```

Title template applies: "Contact — Irfandi Iqbal Abimanyu"

### Title Template Logic

The SEO component detects if the title already contains "Irfandi" to decide whether to apply the `%s — Irfandi Iqbal Abimanyu` template or use the raw title. This prevents double-naming on the home page.

---

## 6. JSON-LD Structured Data

### WebSite Schema (in SEO component — all pages)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Irfandi Iqbal Abimanyu",
  "url": "https://irfnd.id",
  "inLanguage": ["en", "id"]
}
```

### Person Schema (home page only)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Irfandi Iqbal Abimanyu",
  "jobTitle": "Fullstack Web Developer",
  "url": "https://irfnd.id",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Jakarta",
    "addressCountry": "ID"
  },
  "sameAs": [
    "https://www.linkedin.com/in/irfnd-iqbl",
    "https://github.com/irfnd",
    "https://www.instagram.com/irfnd.iqbl"
  ]
}
```

Implementation: A `<PersonSchema>` component renders a `<script type="application/ld+json">` tag. Imported only in the home page.

---

## 7. Static Files

### robots.txt

Update to match production domain:

```
User-agent: *
Allow: /

Sitemap: https://irfnd.id/sitemap-index.xml
```

Note: `@astrojs/sitemap` generates `sitemap-index.xml` at build time. The static `sitemap.xml` in `public/` should be removed since the integration handles it.

### Favicon

No changes needed — already present at `/favicon.svg`.

---

## 8. Testing

- Update or add tests for the new SEO component if head rendering is testable
- Ensure existing tests still pass with the i18n type changes
- Maintain 100% coverage
- Run Lighthouse audit after implementation to verify SEO score improvement

---

## Files Changed

| File | Action |
|------|--------|
| `astro.config.mjs` | Fix site URL, add sitemap i18n config |
| `package.json` | Add `astro-seo` dependency |
| `src/types/i18n.ts` | Add `ISeo` interface, extend `Translations` |
| `src/i18n/en.ts` | Add `seo` section |
| `src/i18n/id.ts` | Add `seo` section |
| `src/components/common/SEO.astro` | New — reusable SEO wrapper |
| `src/components/common/PersonSchema.astro` | New — JSON-LD Person schema |
| `src/layouts/BaseLayout.astro` | Replace manual meta with `<SEO>` |
| `src/pages/en/index.astro` | Pass i18n SEO props |
| `src/pages/en/portfolio.astro` | Pass i18n SEO props |
| `src/pages/en/contact.astro` | Pass i18n SEO props |
| `src/pages/id/index.astro` | Pass i18n SEO props |
| `src/pages/id/portfolio.astro` | Pass i18n SEO props |
| `src/pages/id/contact.astro` | Pass i18n SEO props |
| `public/robots.txt` | Fix sitemap URL |
| `public/sitemap.xml` | Remove (let integration generate) |
| Tests | Update as needed for type/coverage |
