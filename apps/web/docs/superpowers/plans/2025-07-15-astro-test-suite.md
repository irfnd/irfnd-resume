# Phase 9: Astro Test Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace broken React tests with a comprehensive Astro-compatible test suite achieving 100% coverage on all included source files.

**Architecture:** Delete all old React test files (keeping `tests/i18n/utils.test.ts`). Update `vitest.config.ts` to exclude legacy React files from coverage and enable `happy-dom` environment. Write new tests for pure utilities (`cn`, `cloudinary`, `portfolio`, `text`), content data (`tech-stack-list`, translations), and DOM-dependent scripts (`theme`, `toast`, `language`, `contact-form`, `project-dialog`, `resume-download`, `gsap-init`). All DOM script files auto-execute on import, so every test uses `vi.resetModules()` + dynamic `await import()`.

**Tech Stack:** Vitest 4, happy-dom, `@irfnd/schemas` (Zod 4)

---

## File Structure

### Files to Delete
- `tests/components/` — entire directory (27 React component test files)
- `tests/hooks/` — entire directory (2 React hook test files)
- `tests/providers/` — entire directory (2 React context test files)
- `tests/routes/` — entire directory (1 React route test file)
- `tests/contents/` — entire directory (1 file, will recreate)
- `tests/utils/` — entire directory (4 files, will recreate)
- `tests/test-utils.tsx` — React testing utilities
- `tests/router-utils.tsx` — React router utilities
- `tests/setup.ts` — React test setup
- `tests/index.ts` — barrel file

### Files to Keep (unchanged)
- `tests/i18n/utils.test.ts` — 8 passing tests for `getLangFromUrl`, `useTranslations`, `getLocalizedPath`

### Files to Modify
- `vitest.config.ts` — add `environment: 'happy-dom'`, expand coverage excludes

### Files to Create
- `tests/utils/cn.test.ts`
- `tests/utils/cloudinary.test.ts`
- `tests/utils/portfolio.test.ts`
- `tests/utils/text.test.ts`
- `tests/contents/tech-stack-list.test.ts`
- `tests/i18n/translations.test.ts`
- `tests/scripts/theme.test.ts`
- `tests/scripts/toast.test.ts`
- `tests/scripts/language.test.ts`
- `tests/scripts/contact-form.test.ts`
- `tests/scripts/project-dialog.test.ts`
- `tests/scripts/resume-download.test.ts`
- `tests/scripts/gsap-init.test.ts`

---

### Task 1: Delete Old React Tests and Update Config

**Files:**
- Delete: `tests/components/`, `tests/hooks/`, `tests/providers/`, `tests/routes/`, `tests/contents/`, `tests/utils/`, `tests/test-utils.tsx`, `tests/router-utils.tsx`, `tests/setup.ts`, `tests/index.ts`
- Modify: `vitest.config.ts`

- [ ] **Step 1: Delete old React test files**

```bash
cd /Users/irfnd/Coding/portfolios/irfnd-resume/.worktrees/astro-migration/apps/web
rm -rf tests/components tests/hooks tests/providers tests/routes tests/contents tests/utils
rm -f tests/test-utils.tsx tests/router-utils.tsx tests/setup.ts tests/index.ts
```

Verify only `tests/i18n/utils.test.ts` remains:

```bash
find tests/ -type f
```

Expected output:
```
tests/i18n/utils.test.ts
```

- [ ] **Step 2: Update vitest.config.ts**

Replace the entire `vitest.config.ts` with:

```ts
import { getViteConfig } from 'astro/config';
import path from 'path';

export default getViteConfig({
	resolve: { alias: { '@': path.resolve(__dirname, './src'), '@test': path.resolve(__dirname, './tests') } },
	test: {
		globals: true,
		environment: 'happy-dom',
		include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		exclude: ['node_modules', 'dist', '.git', '.cache'],
		pool: 'threads',
		isolate: false,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			reportsDirectory: './coverage',
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
				'src/types/**',
				'src/**/index.ts',
				'src/env.d.ts',
				'src/vite-env.d.ts',
				'src/routeTree.gen.ts',
				'src/utils/router.ts',
				'src/hooks/**',
				'src/components/pdf/**',
				'src/routes/**',
				'src/providers/**',
				'src/components/layout/*.tsx',
				'src/components/ui/*.tsx',
				'src/components/page/**/*.tsx',
				'src/components/providers/**',
			],
			thresholds: {
				statements: 100,
				branches: 100,
				functions: 100,
				lines: 100,
			},
		},
	},
});
```

Key changes from original:
- Added `environment: 'happy-dom'` — provides DOM globals for script tests (lightweight, won't affect pure utility tests)
- Added `src/env.d.ts`, `src/vite-env.d.ts` to exclude (declaration files)
- Added `src/routeTree.gen.ts` (auto-generated)
- Added `src/utils/router.ts` (React router utility, pending deletion)
- Added `src/hooks/**`, `src/components/pdf/**`, `src/routes/**`, `src/providers/**` (React code, pending deletion)
- Added `src/components/layout/*.tsx`, `src/components/ui/*.tsx`, `src/components/page/**/*.tsx` (React components)
- Added `src/components/providers/**` (React providers)

- [ ] **Step 3: Run existing test to verify nothing broke**

```bash
cd /Users/irfnd/Coding/portfolios/irfnd-resume/.worktrees/astro-migration/apps/web
npx vitest run tests/i18n/utils.test.ts
```

Expected: 8 tests pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit --no-verify -m "test(web): delete old React tests and update vitest config for Astro"
```

---

### Task 2: Pure Utility Tests — cn, cloudinary, portfolio, text

**Files:**
- Create: `tests/utils/cn.test.ts`
- Create: `tests/utils/cloudinary.test.ts`
- Create: `tests/utils/portfolio.test.ts`
- Create: `tests/utils/text.test.ts`

- [ ] **Step 1: Create tests/utils/cn.test.ts**

Source under test (`src/utils/cn.ts`):
```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
```

Test file:

```ts
import { describe, expect, it } from 'vitest';
import { cn } from '@/utils/cn';

describe('cn', () => {
	it('merges class names', () => {
		expect(cn('foo', 'bar')).toBe('foo bar');
	});

	it('handles conditional classes', () => {
		expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
	});

	it('merges tailwind conflicts (last wins)', () => {
		expect(cn('p-4', 'p-2')).toBe('p-2');
	});

	it('handles undefined and null', () => {
		expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
	});

	it('handles empty input', () => {
		expect(cn()).toBe('');
	});
});
```

- [ ] **Step 2: Create tests/utils/cloudinary.test.ts**

Source under test (`src/utils/cloudinary.ts`):
```ts
export function cloudinaryResize(url: string, width: number): string {
	return url.replace(/\/image\/upload\/[^/]+\//, `/image/upload/c_scale,w_${width},f_auto,q_auto/`);
}
```

The regex matches `/image/upload/<anything>/` and replaces it. Test file:

```ts
import { describe, expect, it } from 'vitest';
import { cloudinaryResize } from '@/utils/cloudinary';

describe('cloudinaryResize', () => {
	it('replaces existing transform segment with new width', () => {
		const url = 'https://res.cloudinary.com/demo/image/upload/v1234/photo.jpg';
		expect(cloudinaryResize(url, 800)).toBe(
			'https://res.cloudinary.com/demo/image/upload/c_scale,w_800,f_auto,q_auto/photo.jpg',
		);
	});

	it('handles URL with existing transforms', () => {
		const url = 'https://res.cloudinary.com/demo/image/upload/c_fill,w_500/photo.jpg';
		expect(cloudinaryResize(url, 1200)).toBe(
			'https://res.cloudinary.com/demo/image/upload/c_scale,w_1200,f_auto,q_auto/photo.jpg',
		);
	});

	it('returns original URL if pattern does not match', () => {
		const url = 'https://example.com/photos/test.jpg';
		expect(cloudinaryResize(url, 800)).toBe('https://example.com/photos/test.jpg');
	});
});
```

- [ ] **Step 3: Create tests/utils/portfolio.test.ts**

Source under test (`src/utils/portfolio.ts`):
```ts
import type { IPortfolio } from '@/types';
export function sortProjects(projects: IPortfolio['projects']): IPortfolio['projects'] {
	return [...projects].sort((a, b) => {
		if (a.isSelected !== b.isSelected) return a.isSelected ? -1 : 1;
		return a.name.localeCompare(b.name);
	});
}
```

Test file:

```ts
import { describe, expect, it } from 'vitest';
import { sortProjects } from '@/utils/portfolio';
import type { IPortfolio } from '@/types';

type Project = IPortfolio['projects'][number];

function makeProject(overrides: Partial<Project> & Pick<Project, 'name'>): Project {
	return {
		icon: 'tabler:code',
		name: overrides.name,
		summary: [],
		image: [],
		type: 'public',
		demo: null,
		source: null,
		stacks: [],
		category: 'frontend',
		isSelected: false,
		...overrides,
	};
}

describe('sortProjects', () => {
	it('puts selected projects first', () => {
		const projects = [makeProject({ name: 'Bravo' }), makeProject({ name: 'Alpha', isSelected: true })];
		const sorted = sortProjects(projects);
		expect(sorted[0].name).toBe('Alpha');
		expect(sorted[1].name).toBe('Bravo');
	});

	it('sorts alphabetically within same selection status', () => {
		const projects = [
			makeProject({ name: 'Charlie', isSelected: true }),
			makeProject({ name: 'Alpha', isSelected: true }),
			makeProject({ name: 'Bravo', isSelected: true }),
		];
		const sorted = sortProjects(projects);
		expect(sorted.map((p) => p.name)).toEqual(['Alpha', 'Bravo', 'Charlie']);
	});

	it('handles empty array', () => {
		expect(sortProjects([])).toEqual([]);
	});

	it('does not mutate the original array', () => {
		const projects = [makeProject({ name: 'Bravo' }), makeProject({ name: 'Alpha' })];
		const original = [...projects];
		sortProjects(projects);
		expect(projects[0].name).toBe(original[0].name);
	});

	it('handles mixed selected/unselected with alphabetical sub-sort', () => {
		const projects = [
			makeProject({ name: 'Delta' }),
			makeProject({ name: 'Alpha', isSelected: true }),
			makeProject({ name: 'Charlie' }),
			makeProject({ name: 'Bravo', isSelected: true }),
		];
		const sorted = sortProjects(projects);
		expect(sorted.map((p) => p.name)).toEqual(['Alpha', 'Bravo', 'Charlie', 'Delta']);
	});
});
```

- [ ] **Step 4: Create tests/utils/text.test.ts**

Source under test (`src/utils/text.ts`):
```ts
import type { IParagraph } from '@/types';
export function setHighlightText(text: string, keywords: string[]) {
	let result = text;
	keywords.forEach((keyword, index) => {
		const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regex = new RegExp(escapedKeyword, 'g');
		result = result.replace(regex, `{${index}}`);
	});
	return { value: result, keywords };
}
export function resolveText({ value, keywords }: IParagraph): string {
	return keywords.reduce((text, keyword, index) => text.replace(new RegExp(`\\{${index}\\}`, 'g'), keyword), value);
}
```

Test file:

```ts
import { describe, expect, it } from 'vitest';
import { resolveText, setHighlightText } from '@/utils/text';

describe('setHighlightText', () => {
	it('replaces keywords with indexed placeholders', () => {
		const result = setHighlightText('Hello World', ['World']);
		expect(result.value).toBe('Hello {0}');
		expect(result.keywords).toEqual(['World']);
	});

	it('handles multiple keywords', () => {
		const result = setHighlightText('foo bar baz', ['foo', 'baz']);
		expect(result.value).toBe('{0} bar {1}');
	});

	it('replaces all occurrences of a keyword', () => {
		const result = setHighlightText('go go go', ['go']);
		expect(result.value).toBe('{0} {0} {0}');
	});

	it('escapes special regex characters in keywords', () => {
		const result = setHighlightText('price is $100 (USD)', ['$100', '(USD)']);
		expect(result.value).toBe('price is {0} {1}');
	});

	it('returns original text when keywords is empty', () => {
		const result = setHighlightText('Hello World', []);
		expect(result.value).toBe('Hello World');
		expect(result.keywords).toEqual([]);
	});
});

describe('resolveText', () => {
	it('replaces placeholders with keywords', () => {
		expect(resolveText({ value: 'Hello {0}', keywords: ['World'] })).toBe('Hello World');
	});

	it('handles multiple placeholders', () => {
		expect(resolveText({ value: '{0} and {1}', keywords: ['Alpha', 'Bravo'] })).toBe('Alpha and Bravo');
	});

	it('handles repeated placeholders', () => {
		expect(resolveText({ value: '{0} or {0}', keywords: ['same'] })).toBe('same or same');
	});

	it('returns value unchanged when no keywords', () => {
		expect(resolveText({ value: 'no placeholders', keywords: [] })).toBe('no placeholders');
	});

	it('roundtrips with setHighlightText', () => {
		const original = 'Build with React and TypeScript';
		const highlighted = setHighlightText(original, ['React', 'TypeScript']);
		expect(resolveText(highlighted)).toBe(original);
	});
});
```

- [ ] **Step 5: Run utility tests**

```bash
cd /Users/irfnd/Coding/portfolios/irfnd-resume/.worktrees/astro-migration/apps/web
npx vitest run tests/utils/
```

Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit --no-verify -m "test(web): add pure utility tests for cn, cloudinary, portfolio, text"
```

---

### Task 3: Content and Translation Tests

**Files:**
- Create: `tests/contents/tech-stack-list.test.ts`
- Create: `tests/i18n/translations.test.ts`

- [ ] **Step 1: Create tests/contents/tech-stack-list.test.ts**

Source under test (`src/contents/tech-stack-list.ts`): exports `getTechStack(keys)` and a `TechStackList` array (29 items). `getTechStack` filters the list by label. Note: `TechStackList` is not exported — only `getTechStack` is. We test via `getTechStack`.

```ts
import { describe, expect, it } from 'vitest';
import { getTechStack } from '@/contents/tech-stack-list';

describe('getTechStack', () => {
	it('returns matching tech stack entries', () => {
		const result = getTechStack(['React', 'TypeScript']);
		expect(result).toHaveLength(2);
		expect(result.map((t) => t.label)).toEqual(expect.arrayContaining(['React', 'TypeScript']));
	});

	it('returns empty array for no matches', () => {
		const result = getTechStack(['NonExistent' as never]);
		expect(result).toEqual([]);
	});

	it('returns entries with required properties', () => {
		const [item] = getTechStack(['React']);
		expect(item).toHaveProperty('label', 'React');
		expect(item).toHaveProperty('url');
		expect(item).toHaveProperty('icon');
	});

	it('returns single item for single key', () => {
		const result = getTechStack(['Docker']);
		expect(result).toHaveLength(1);
		expect(result[0].label).toBe('Docker');
	});

	it('handles entries with customColor property', () => {
		const result = getTechStack(['Next.js']);
		expect(result).toHaveLength(1);
		expect(result[0].customColor).toBe(true);
		expect(result[0]).toHaveProperty('border');
	});

	it('returns empty array for empty keys', () => {
		expect(getTechStack([])).toEqual([]);
	});
});
```

- [ ] **Step 2: Create tests/i18n/translations.test.ts**

Both `en.ts` and `id.ts` export objects conforming to the `Translations` interface. We test structural parity (same keys at every nesting level) and array length consistency.

```ts
import { describe, expect, it } from 'vitest';
import { en } from '@/i18n/en';
import { id } from '@/i18n/id';
import type { Translations } from '@/types/i18n';

function getKeys(obj: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(obj).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (value && typeof value === 'object' && !Array.isArray(value)) {
			return getKeys(value as Record<string, unknown>, path);
		}
		return [path];
	});
}

describe('translation structure parity', () => {
	it('en and id have the same top-level keys', () => {
		expect(Object.keys(en).sort()).toEqual(Object.keys(id).sort());
	});

	it('en and id have the same nested key structure', () => {
		const enKeys = getKeys(en as unknown as Record<string, unknown>).sort();
		const idKeys = getKeys(id as unknown as Record<string, unknown>).sort();
		expect(enKeys).toEqual(idKeys);
	});

	it('navigation arrays have same length', () => {
		expect(en.navigation).toHaveLength(id.navigation.length);
	});

	it('contact arrays have same length', () => {
		expect(en.contact).toHaveLength(id.contact.length);
	});

	it('navigation items have consistent shape', () => {
		for (const nav of en.navigation) {
			expect(nav).toHaveProperty('label');
			expect(nav).toHaveProperty('url');
			expect(nav).toHaveProperty('icon');
		}
		for (const nav of id.navigation) {
			expect(nav).toHaveProperty('label');
			expect(nav).toHaveProperty('url');
			expect(nav).toHaveProperty('icon');
		}
	});

	it('navigation URLs match between en and id', () => {
		const enUrls = en.navigation.map((n) => n.url);
		const idUrls = id.navigation.map((n) => n.url);
		expect(enUrls).toEqual(idUrls);
	});

	it('contact items share same urls and icons', () => {
		const enMeta = en.contact.map((c) => ({ url: c.url, icon: c.icon, type: c.type }));
		const idMeta = id.contact.map((c) => ({ url: c.url, icon: c.icon, type: c.type }));
		expect(enMeta).toEqual(idMeta);
	});

	it('experience jobs array has same length', () => {
		expect(en.experience.jobs).toHaveLength(id.experience.jobs.length);
	});

	it('portfolio projects array has same length', () => {
		expect(en.portfolio.projects).toHaveLength(id.portfolio.projects.length);
	});

	it('education array has same length', () => {
		expect(en.education.educations).toHaveLength(id.education.educations.length);
	});

	it('contactMe form fields have same length', () => {
		expect(en.contactMe.form).toHaveLength(id.contactMe.form.length);
	});

	it('common portfolioCategories have same length', () => {
		expect(en.common.portfolioCategories).toHaveLength(id.common.portfolioCategories.length);
	});
});

describe('translation content sanity', () => {
	function checkTranslation(t: Translations, label: string) {
		it(`${label}: profile has required fields`, () => {
			expect(t.profile.firstName).toBeTruthy();
			expect(t.profile.lastName).toBeTruthy();
			expect(t.profile.role).toBeTruthy();
		});

		it(`${label}: about has description and focus`, () => {
			expect(t.about.description.length).toBeGreaterThan(0);
			expect(t.about.focus.length).toBeGreaterThan(0);
		});

		it(`${label}: contactMe has all error keys`, () => {
			expect(t.contactMe.errors).toHaveProperty('rateLimited');
			expect(t.contactMe.errors).toHaveProperty('networkError');
			expect(t.contactMe.errors).toHaveProperty('serverError');
			expect(t.contactMe.errors).toHaveProperty('validationError');
		});

		it(`${label}: technology stacks is non-empty`, () => {
			expect(Object.keys(t.technology.stacks).length).toBeGreaterThan(0);
		});
	}

	checkTranslation(en, 'en');
	checkTranslation(id, 'id');
});
```

- [ ] **Step 3: Run content and translation tests**

```bash
cd /Users/irfnd/Coding/portfolios/irfnd-resume/.worktrees/astro-migration/apps/web
npx vitest run tests/contents/ tests/i18n/
```

Expected: All tests pass (existing 8 i18n tests + new tests).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit --no-verify -m "test(web): add tech-stack-list and translation parity tests"
```

---

### Task 4: Theme Script Tests

**Files:**
- Create: `tests/scripts/theme.test.ts`

- [ ] **Step 1: Create tests/scripts/theme.test.ts**

Source under test (`src/scripts/theme.ts`):
- `getStoredTheme()` — reads `localStorage.getItem('irfnd-ui-theme')`, returns `'dark'` if not `'light'` or `'dark'`
- `applyTheme(theme)` — removes 'light'/'dark' from `document.documentElement.classList`, adds theme, sets localStorage
- `initTheme()` — calls `applyTheme(getStoredTheme())`, adds click listener for `[data-theme-toggle]`
- **Auto-executes:** `initTheme()` is called at module level on import

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('theme', () => {
	beforeEach(() => {
		vi.resetModules();
		document.documentElement.className = '';
		localStorage.clear();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('getStoredTheme', () => {
		it('returns "dark" by default when nothing stored', async () => {
			const { getStoredTheme } = await import('@/scripts/theme');
			expect(getStoredTheme()).toBe('dark');
		});

		it('returns "light" when stored', async () => {
			localStorage.setItem('irfnd-ui-theme', 'light');
			const { getStoredTheme } = await import('@/scripts/theme');
			expect(getStoredTheme()).toBe('light');
		});

		it('returns "dark" when stored', async () => {
			localStorage.setItem('irfnd-ui-theme', 'dark');
			const { getStoredTheme } = await import('@/scripts/theme');
			expect(getStoredTheme()).toBe('dark');
		});

		it('returns "dark" for invalid stored value', async () => {
			localStorage.setItem('irfnd-ui-theme', 'invalid');
			const { getStoredTheme } = await import('@/scripts/theme');
			expect(getStoredTheme()).toBe('dark');
		});
	});

	describe('applyTheme', () => {
		it('sets dark class and localStorage', async () => {
			const { applyTheme } = await import('@/scripts/theme');
			applyTheme('dark');
			expect(document.documentElement.classList.contains('dark')).toBe(true);
			expect(document.documentElement.classList.contains('light')).toBe(false);
			expect(localStorage.getItem('irfnd-ui-theme')).toBe('dark');
		});

		it('sets light class and localStorage', async () => {
			const { applyTheme } = await import('@/scripts/theme');
			applyTheme('light');
			expect(document.documentElement.classList.contains('light')).toBe(true);
			expect(document.documentElement.classList.contains('dark')).toBe(false);
			expect(localStorage.getItem('irfnd-ui-theme')).toBe('light');
		});

		it('removes previous theme class', async () => {
			document.documentElement.classList.add('light');
			const { applyTheme } = await import('@/scripts/theme');
			applyTheme('dark');
			expect(document.documentElement.classList.contains('light')).toBe(false);
			expect(document.documentElement.classList.contains('dark')).toBe(true);
		});
	});

	describe('initTheme', () => {
		it('applies dark theme on load by default', async () => {
			await import('@/scripts/theme');
			expect(document.documentElement.classList.contains('dark')).toBe(true);
		});

		it('applies stored light theme on load', async () => {
			localStorage.setItem('irfnd-ui-theme', 'light');
			await import('@/scripts/theme');
			expect(document.documentElement.classList.contains('light')).toBe(true);
		});

		it('toggles theme on toggle button click', async () => {
			await import('@/scripts/theme');
			expect(document.documentElement.classList.contains('dark')).toBe(true);

			const btn = document.createElement('button');
			btn.setAttribute('data-theme-toggle', '');
			document.body.appendChild(btn);

			btn.click();
			expect(document.documentElement.classList.contains('light')).toBe(true);
			expect(document.documentElement.classList.contains('dark')).toBe(false);

			btn.click();
			expect(document.documentElement.classList.contains('dark')).toBe(true);

			btn.remove();
		});

		it('ignores clicks on non-toggle elements', async () => {
			await import('@/scripts/theme');
			const div = document.createElement('div');
			document.body.appendChild(div);
			div.click();
			expect(document.documentElement.classList.contains('dark')).toBe(true);
			div.remove();
		});
	});
});
```

- [ ] **Step 2: Run theme tests**

```bash
cd /Users/irfnd/Coding/portfolios/irfnd-resume/.worktrees/astro-migration/apps/web
npx vitest run tests/scripts/theme.test.ts
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit --no-verify -m "test(web): add theme script tests"
```

---

### Task 5: Toast Script Tests

**Files:**
- Create: `tests/scripts/toast.test.ts`

- [ ] **Step 1: Create tests/scripts/toast.test.ts**

Source under test (`src/scripts/toast.ts`):
- `showToast(message, variant?, duration?)` — creates toast element, appends to container, auto-removes after duration
- `removeToast(id)` — removes toast by id with fade-out animation (300ms delay)
- Module-level: adds click listener for `[data-toast-close]`, assigns `window.showToast` and `window.removeToast`
- `getContainer()` — internal, creates `#toast-container` if not found
- Uses `crypto.randomUUID()` for IDs

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('toast', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.useFakeTimers();
		document.body.innerHTML = '';
		document.documentElement.className = '';
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it('showToast creates a container if none exists', async () => {
		const { showToast } = await import('@/scripts/toast');
		showToast('Hello');
		expect(document.getElementById('toast-container')).not.toBeNull();
	});

	it('showToast reuses existing container', async () => {
		const container = document.createElement('div');
		container.id = 'toast-container';
		document.body.appendChild(container);

		const { showToast } = await import('@/scripts/toast');
		showToast('Hello');
		expect(document.querySelectorAll('#toast-container')).toHaveLength(1);
	});

	it('showToast adds toast element to container', async () => {
		const { showToast } = await import('@/scripts/toast');
		showToast('Test message', 'success');
		const container = document.getElementById('toast-container');
		expect(container?.children).toHaveLength(1);
		expect(container?.children[0].textContent).toContain('Test message');
	});

	it('showToast returns an id string', async () => {
		const { showToast } = await import('@/scripts/toast');
		const id = showToast('Hello');
		expect(typeof id).toBe('string');
		expect(id.length).toBeGreaterThan(0);
	});

	it('showToast auto-removes after duration', async () => {
		const { showToast } = await import('@/scripts/toast');
		showToast('Temporary', 'info', 3000);
		const container = document.getElementById('toast-container');
		expect(container?.children).toHaveLength(1);

		vi.advanceTimersByTime(3000);
		// After removeToast is called, there's a 300ms delay for the animation
		vi.advanceTimersByTime(300);
		expect(container?.children).toHaveLength(0);
	});

	it('showToast with duration 0 does not auto-remove', async () => {
		const { showToast } = await import('@/scripts/toast');
		showToast('Persistent', 'info', 0);
		vi.advanceTimersByTime(60000);
		const container = document.getElementById('toast-container');
		expect(container?.children).toHaveLength(1);
	});

	it('removeToast removes the toast element after animation delay', async () => {
		const { showToast, removeToast } = await import('@/scripts/toast');
		const id = showToast('To remove', 'error', 0);
		const container = document.getElementById('toast-container');
		expect(container?.children).toHaveLength(1);

		removeToast(id);
		// Fade-out animation: 300ms
		vi.advanceTimersByTime(300);
		expect(container?.children).toHaveLength(0);
	});

	it('removeToast is no-op for non-existent id', async () => {
		const { removeToast } = await import('@/scripts/toast');
		expect(() => removeToast('non-existent')).not.toThrow();
	});

	it('close button removes toast via click delegation', async () => {
		const { showToast } = await import('@/scripts/toast');
		const id = showToast('Click close', 'warning', 0);

		const closeBtn = document.querySelector(`[data-toast-close="${id}"]`) as HTMLElement;
		expect(closeBtn).not.toBeNull();
		closeBtn.click();

		vi.advanceTimersByTime(300);
		const container = document.getElementById('toast-container');
		expect(container?.children).toHaveLength(0);
	});

	it('sets window.showToast and window.removeToast', async () => {
		await import('@/scripts/toast');
		expect(typeof window.showToast).toBe('function');
		expect(typeof window.removeToast).toBe('function');
	});

	it('supports all toast variants', async () => {
		const { showToast } = await import('@/scripts/toast');
		const variants = ['success', 'error', 'warning', 'info'] as const;
		for (const variant of variants) {
			showToast(`Test ${variant}`, variant, 0);
		}
		const container = document.getElementById('toast-container');
		expect(container?.children).toHaveLength(4);
	});
});
```

- [ ] **Step 2: Run toast tests**

```bash
cd /Users/irfnd/Coding/portfolios/irfnd-resume/.worktrees/astro-migration/apps/web
npx vitest run tests/scripts/toast.test.ts
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit --no-verify -m "test(web): add toast script tests"
```

---

### Task 6: Language Script Tests

**Files:**
- Create: `tests/scripts/language.test.ts`

- [ ] **Step 1: Create tests/scripts/language.test.ts**

Source under test (`src/scripts/language.ts`):
- `getLangFromPath()` — reads `window.location.pathname`, splits by `/`, returns `'id'` or `'en'`
- `switchLanguage(targetLang)` — replaces `/(en|id)` prefix in pathname, sets `window.location.href`
- `initLanguageSwitcher()` — click delegation: `[data-lang-toggle]` toggles dropdown, `[data-lang-option]` switches lang, click-outside closes dropdown
- **Auto-executes:** `initLanguageSwitcher()` called at module level

In happy-dom, `window.location` is available but we need to set pathname before import. We can use `Object.defineProperty` or just navigate.

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function setLocationPathname(pathname: string) {
	Object.defineProperty(window, 'location', {
		value: { ...window.location, pathname, href: `http://localhost${pathname}` },
		writable: true,
		configurable: true,
	});
}

describe('language', () => {
	beforeEach(() => {
		vi.resetModules();
		document.body.innerHTML = '';
		setLocationPathname('/en/');
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('getLangFromPath', () => {
		it('returns "en" for English path', async () => {
			setLocationPathname('/en/portfolio');
			const { getLangFromPath } = await import('@/scripts/language');
			expect(getLangFromPath()).toBe('en');
		});

		it('returns "id" for Indonesian path', async () => {
			setLocationPathname('/id/contact');
			const { getLangFromPath } = await import('@/scripts/language');
			expect(getLangFromPath()).toBe('id');
		});

		it('defaults to "en" for unknown language', async () => {
			setLocationPathname('/fr/about');
			const { getLangFromPath } = await import('@/scripts/language');
			expect(getLangFromPath()).toBe('en');
		});
	});

	describe('switchLanguage', () => {
		it('navigates to the new language path', async () => {
			setLocationPathname('/en/portfolio');
			const { switchLanguage } = await import('@/scripts/language');
			switchLanguage('id');
			expect(window.location.href).toBe('/id/portfolio');
		});

		it('replaces en with id in root path', async () => {
			setLocationPathname('/en/');
			const { switchLanguage } = await import('@/scripts/language');
			switchLanguage('id');
			expect(window.location.href).toBe('/id/');
		});
	});

	describe('initLanguageSwitcher', () => {
		it('toggles dropdown on toggle button click', async () => {
			const dropdown = document.createElement('div');
			dropdown.setAttribute('data-lang-dropdown', '');
			dropdown.classList.add('hidden');
			document.body.appendChild(dropdown);

			const toggle = document.createElement('button');
			toggle.setAttribute('data-lang-toggle', '');
			document.body.appendChild(toggle);

			await import('@/scripts/language');

			toggle.click();
			expect(dropdown.classList.contains('hidden')).toBe(false);

			toggle.click();
			expect(dropdown.classList.contains('hidden')).toBe(true);
		});

		it('switches language on option click', async () => {
			setLocationPathname('/en/');
			const dropdown = document.createElement('div');
			dropdown.setAttribute('data-lang-dropdown', '');
			document.body.appendChild(dropdown);

			const option = document.createElement('button');
			option.setAttribute('data-lang-option', 'id');
			document.body.appendChild(option);

			await import('@/scripts/language');
			option.click();

			expect(window.location.href).toBe('/id/');
			expect(dropdown.classList.contains('hidden')).toBe(true);
		});

		it('does not switch if target lang is same as current', async () => {
			setLocationPathname('/en/');
			const hrefBefore = window.location.href;

			const dropdown = document.createElement('div');
			dropdown.setAttribute('data-lang-dropdown', '');
			document.body.appendChild(dropdown);

			const option = document.createElement('button');
			option.setAttribute('data-lang-option', 'en');
			document.body.appendChild(option);

			await import('@/scripts/language');
			option.click();

			expect(dropdown.classList.contains('hidden')).toBe(true);
		});

		it('closes dropdown on click outside', async () => {
			const dropdown = document.createElement('div');
			dropdown.setAttribute('data-lang-dropdown', '');
			document.body.appendChild(dropdown);

			await import('@/scripts/language');

			// First open via non-standard means (remove hidden manually)
			dropdown.classList.remove('hidden');
			expect(dropdown.classList.contains('hidden')).toBe(false);

			// Click a random element
			const random = document.createElement('div');
			document.body.appendChild(random);
			random.click();

			expect(dropdown.classList.contains('hidden')).toBe(true);
		});
	});
});
```

- [ ] **Step 2: Run language tests**

```bash
cd /Users/irfnd/Coding/portfolios/irfnd-resume/.worktrees/astro-migration/apps/web
npx vitest run tests/scripts/language.test.ts
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit --no-verify -m "test(web): add language script tests"
```

---

### Task 7: Contact Form Script Tests

**Files:**
- Create: `tests/scripts/contact-form.test.ts`

- [ ] **Step 1: Create tests/scripts/contact-form.test.ts**

Source under test (`src/scripts/contact-form.ts`):
- `initContactForm()` — finds `[data-contact-form]`, reads `data-validation`/`data-errors` attributes, creates schema, handles submit
- Uses `import.meta.env.PUBLIC_API_URL` and `PUBLIC_API_KEY`
- Auto-executes: calls `initContactForm()` on DOMContentLoaded or immediately
- Uses `window.showToast` (from toast.ts)

We must mock `window.showToast`, `fetch`, and `import.meta.env`. We also need `@irfnd/schemas` to be available (it's a workspace dep).

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const VALIDATION = {
	fullName: { min: 'Name min 2', max: 'Name max 100' },
	email: { invalid: 'Invalid email' },
	telephone: { min: 'Phone min 5', max: 'Phone max 20' },
	subject: { min: 'Subject min 2', max: 'Subject max 200' },
	message: { min: 'Message min 10', max: 'Message max 5000' },
};

const ERRORS = {
	rateLimited: 'Rate limited',
	networkError: 'Network error',
	serverError: 'Server error',
	validationError: 'Validation error',
};

function buildFormHTML() {
	return `
		<form data-contact-form data-validation='${JSON.stringify(VALIDATION)}' data-errors='${JSON.stringify(ERRORS)}'>
			<input data-field="fullName" name="fullName" value="Test User" />
			<span data-field-error="fullName" class="hidden"></span>
			<input data-field="email" name="email" value="test@example.com" />
			<span data-field-error="email" class="hidden"></span>
			<input data-field="telephone" name="telephone" value="1234567890" />
			<span data-field-error="telephone" class="hidden"></span>
			<input data-field="subject" name="subject" value="Hello There" />
			<span data-field-error="subject" class="hidden"></span>
			<textarea data-field="message" name="message">This is a test message that is long enough.</textarea>
			<span data-field-error="message" class="hidden"></span>
			<button data-submit-btn type="submit">
				<span data-submit-text>Send</span>
				<span data-loading-text class="hidden">Sending...</span>
			</button>
		</form>
		<div data-contact-success class="hidden"></div>
	`;
}

function submitForm() {
	const form = document.querySelector<HTMLFormElement>('[data-contact-form]')!;
	form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

describe('contact-form', () => {
	beforeEach(() => {
		vi.resetModules();
		document.body.innerHTML = buildFormHTML();
		window.showToast = vi.fn() as unknown as typeof window.showToast;
		window.removeToast = vi.fn() as unknown as typeof window.removeToast;
		vi.stubGlobal('fetch', vi.fn());
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
		document.body.innerHTML = '';
	});

	it('does not crash when no form element exists', async () => {
		document.body.innerHTML = '';
		await expect(import('@/scripts/contact-form')).resolves.toBeDefined();
	});

	it('submits form successfully and shows success overlay', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));

		await import('@/scripts/contact-form');
		submitForm();

		// Wait for async submit handler
		await vi.waitFor(() => {
			expect(fetch).toHaveBeenCalledTimes(1);
		});

		const successOverlay = document.querySelector('[data-contact-success]');
		expect(successOverlay?.classList.contains('hidden')).toBe(false);
		expect(successOverlay?.classList.contains('flex')).toBe(true);
	});

	it('shows validation errors for invalid data', async () => {
		const emailInput = document.querySelector<HTMLInputElement>('[data-field="email"]')!;
		emailInput.value = 'not-an-email';

		await import('@/scripts/contact-form');
		submitForm();

		// Validation is synchronous — no fetch should be called
		await vi.waitFor(() => {
			const errorEl = document.querySelector('[data-field-error="email"]');
			expect(errorEl?.classList.contains('hidden')).toBe(false);
		});
		expect(fetch).not.toHaveBeenCalled();
	});

	it('shows error styles on invalid fields', async () => {
		const nameInput = document.querySelector<HTMLInputElement>('[data-field="fullName"]')!;
		nameInput.value = 'A'; // Too short (min 2, but 'A' is 1 char)

		await import('@/scripts/contact-form');
		submitForm();

		await vi.waitFor(() => {
			const fieldEl = document.querySelector('[data-field="fullName"]');
			expect(fieldEl?.classList.contains('border-red-500')).toBe(true);
		});
	});

	it('handles rate limit (429) response', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 429 }));

		await import('@/scripts/contact-form');
		submitForm();

		await vi.waitFor(() => {
			expect(window.showToast).toHaveBeenCalledWith('Rate limited', 'error');
		});
	});

	it('handles validation error (400) response', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 400 }));

		await import('@/scripts/contact-form');
		submitForm();

		await vi.waitFor(() => {
			expect(window.showToast).toHaveBeenCalledWith('Validation error', 'error');
		});
	});

	it('handles server error (500) response', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }));

		await import('@/scripts/contact-form');
		submitForm();

		await vi.waitFor(() => {
			expect(window.showToast).toHaveBeenCalledWith('Server error', 'error');
		});
	});

	it('handles network error', async () => {
		vi.mocked(fetch).mockRejectedValueOnce(new Error('Network failure'));

		await import('@/scripts/contact-form');
		submitForm();

		await vi.waitFor(() => {
			expect(window.showToast).toHaveBeenCalledWith('Network error', 'error');
		});
	});

	it('toggles loading state during submission', async () => {
		let resolveFetch!: (value: Response) => void;
		vi.mocked(fetch).mockImplementationOnce(
			() => new Promise<Response>((resolve) => { resolveFetch = resolve; }),
		);

		await import('@/scripts/contact-form');
		submitForm();

		await vi.waitFor(() => {
			const submitBtn = document.querySelector<HTMLButtonElement>('[data-submit-btn]')!;
			expect(submitBtn.disabled).toBe(true);
			const submitText = document.querySelector('[data-submit-text]');
			expect(submitText?.classList.contains('hidden')).toBe(true);
			const loadingText = document.querySelector('[data-loading-text]');
			expect(loadingText?.classList.contains('hidden')).toBe(false);
		});

		resolveFetch(new Response(JSON.stringify({ ok: true }), { status: 200 }));

		await vi.waitFor(() => {
			const submitBtn = document.querySelector<HTMLButtonElement>('[data-submit-btn]')!;
			expect(submitBtn.disabled).toBe(false);
		});
	});

	it('clears previous errors before new submission', async () => {
		// First, trigger a validation error
		const emailInput = document.querySelector<HTMLInputElement>('[data-field="email"]')!;
		emailInput.value = 'bad';

		await import('@/scripts/contact-form');
		submitForm();

		await vi.waitFor(() => {
			const errorEl = document.querySelector('[data-field-error="email"]');
			expect(errorEl?.classList.contains('hidden')).toBe(false);
		});

		// Fix the email and resubmit
		emailInput.value = 'good@example.com';
		vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }));
		submitForm();

		await vi.waitFor(() => {
			const errorEl = document.querySelector('[data-field-error="email"]');
			expect(errorEl?.classList.contains('hidden')).toBe(true);
		});
	});

	it('handles missing data attributes gracefully', async () => {
		document.body.innerHTML = `
			<form data-contact-form>
				<input name="fullName" value="Test" />
				<button data-submit-btn type="submit"><span data-submit-text>Send</span></button>
			</form>
		`;
		// Should not throw even without data-validation/data-errors
		await expect(import('@/scripts/contact-form')).resolves.toBeDefined();
	});
});
```

- [ ] **Step 2: Run contact-form tests**

```bash
cd /Users/irfnd/Coding/portfolios/irfnd-resume/.worktrees/astro-migration/apps/web
npx vitest run tests/scripts/contact-form.test.ts
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit --no-verify -m "test(web): add contact-form script tests"
```

---

### Task 8: Project Dialog Script Tests

**Files:**
- Create: `tests/scripts/project-dialog.test.ts`

- [ ] **Step 1: Create tests/scripts/project-dialog.test.ts**

Source under test (`src/scripts/project-dialog.ts`):
- `initProjectDialog()` — finds `[data-project-dialog]` dialog, sets up open/close/carousel
- Opens on `[data-project-id]` click, populates from `[data-project-detail="{id}"]` template
- Closes on backdrop click (target === dialog), `[data-dialog-close]` click, or Escape key
- `closeDialog(dialog)` — calls `dialog.close()`, resets `body.overflow`
- `initCarousel(dialog)` — sets up prev/next/arrow-key navigation on `[data-carousel-track]`
- Auto-executes on DOMContentLoaded or immediately

Note: happy-dom's `<dialog>` support is limited — `showModal()` may not exist. We mock it.

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function buildDialogHTML() {
	return `
		<div data-project-id="project-1">Click to open</div>
		<template data-project-detail="project-1">
			<div data-carousel-track>
				<div>Slide 1</div>
				<div>Slide 2</div>
				<div>Slide 3</div>
			</div>
			<button data-carousel-prev>Prev</button>
			<button data-carousel-next>Next</button>
		</template>
		<dialog data-project-dialog>
			<div data-dialog-content></div>
			<button data-dialog-close>Close</button>
		</dialog>
	`;
}

describe('project-dialog', () => {
	beforeEach(() => {
		vi.resetModules();
		document.body.innerHTML = buildDialogHTML();

		// Mock dialog methods since happy-dom may not implement them
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;
		if (!dialog.showModal) {
			dialog.showModal = vi.fn();
		} else {
			vi.spyOn(dialog, 'showModal').mockImplementation(() => {});
		}
		if (!dialog.close) {
			dialog.close = vi.fn();
		} else {
			vi.spyOn(dialog, 'close').mockImplementation(() => {});
		}
	});

	afterEach(() => {
		vi.restoreAllMocks();
		document.body.innerHTML = '';
	});

	it('does not crash when no dialog exists', async () => {
		document.body.innerHTML = '';
		await expect(import('@/scripts/project-dialog')).resolves.toBeDefined();
	});

	it('opens dialog when project card is clicked', async () => {
		await import('@/scripts/project-dialog');
		const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;

		card.click();

		expect(dialog.showModal).toHaveBeenCalled();
		expect(document.body.style.overflow).toBe('hidden');
	});

	it('populates dialog content from template', async () => {
		await import('@/scripts/project-dialog');
		const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
		card.click();

		const dialogContent = document.querySelector('[data-dialog-content]');
		expect(dialogContent?.innerHTML).toContain('Slide 1');
	});

	it('closes dialog when close button is clicked', async () => {
		await import('@/scripts/project-dialog');
		const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;

		card.click();

		const closeBtn = dialog.querySelector('[data-dialog-close]') as HTMLElement;
		dialog.dispatchEvent(
			new MouseEvent('click', { bubbles: true, target: closeBtn } as MouseEventInit),
		);
		// Simulate click on close button via dialog's click listener
		const clickEvent = new MouseEvent('click', { bubbles: true });
		Object.defineProperty(clickEvent, 'target', { value: closeBtn });
		dialog.dispatchEvent(clickEvent);

		expect(dialog.close).toHaveBeenCalled();
	});

	it('closes dialog on backdrop click (target === dialog)', async () => {
		await import('@/scripts/project-dialog');
		const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;

		card.click();

		const clickEvent = new MouseEvent('click', { bubbles: true });
		Object.defineProperty(clickEvent, 'target', { value: dialog });
		dialog.dispatchEvent(clickEvent);

		expect(dialog.close).toHaveBeenCalled();
		expect(document.body.style.overflow).toBe('');
	});

	it('closes dialog on Escape key', async () => {
		await import('@/scripts/project-dialog');
		const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;

		card.click();

		dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		expect(dialog.close).toHaveBeenCalled();
	});

	it('does not close on non-Escape key', async () => {
		await import('@/scripts/project-dialog');
		const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;

		card.click();
		vi.mocked(dialog.close).mockClear();

		dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		expect(dialog.close).not.toHaveBeenCalled();
	});

	it('ignores click on card with no matching template', async () => {
		const orphanCard = document.createElement('div');
		orphanCard.setAttribute('data-project-id', 'nonexistent');
		document.body.appendChild(orphanCard);

		await import('@/scripts/project-dialog');
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;

		orphanCard.click();
		expect(dialog.showModal).not.toHaveBeenCalled();
	});

	it('ignores click on card with empty project id', async () => {
		const emptyCard = document.createElement('div');
		emptyCard.setAttribute('data-project-id', '');
		document.body.appendChild(emptyCard);

		await import('@/scripts/project-dialog');
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;

		emptyCard.click();
		expect(dialog.showModal).not.toHaveBeenCalled();
	});

	describe('carousel', () => {
		it('navigates to next slide', async () => {
			await import('@/scripts/project-dialog');
			const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
			card.click();

			const track = document.querySelector<HTMLElement>('[data-carousel-track]')!;
			const nextBtn = document.querySelector('[data-carousel-next]') as HTMLElement;

			nextBtn.click();
			expect(track.style.transform).toBe('translateX(-100%)');

			nextBtn.click();
			expect(track.style.transform).toBe('translateX(-200%)');
		});

		it('navigates to previous slide (wraps around)', async () => {
			await import('@/scripts/project-dialog');
			const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
			card.click();

			const track = document.querySelector<HTMLElement>('[data-carousel-track]')!;
			const prevBtn = document.querySelector('[data-carousel-prev]') as HTMLElement;

			prevBtn.click();
			// Wraps: ((-1 % 3) + 3) % 3 = 2
			expect(track.style.transform).toBe('translateX(-200%)');
		});

		it('navigates via arrow keys', async () => {
			await import('@/scripts/project-dialog');
			const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
			const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;
			card.click();

			const track = document.querySelector<HTMLElement>('[data-carousel-track]')!;

			dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
			expect(track.style.transform).toBe('translateX(-100%)');

			dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
			expect(track.style.transform).toBe('translateX(0%)');
		});

		it('wraps forward past last slide', async () => {
			await import('@/scripts/project-dialog');
			const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
			card.click();

			const track = document.querySelector<HTMLElement>('[data-carousel-track]')!;
			const nextBtn = document.querySelector('[data-carousel-next]') as HTMLElement;

			nextBtn.click(); // 1
			nextBtn.click(); // 2
			nextBtn.click(); // wraps to 0
			expect(track.style.transform).toBe('translateX(0%)');
		});
	});

	it('handles dialog click that is not close button or backdrop', async () => {
		await import('@/scripts/project-dialog');
		const card = document.querySelector('[data-project-id="project-1"]') as HTMLElement;
		const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]')!;
		card.click();
		vi.mocked(dialog.close).mockClear();

		const dialogContent = dialog.querySelector('[data-dialog-content]') as HTMLElement;
		const clickEvent = new MouseEvent('click', { bubbles: true });
		Object.defineProperty(clickEvent, 'target', { value: dialogContent });
		dialog.dispatchEvent(clickEvent);

		expect(dialog.close).not.toHaveBeenCalled();
	});
});
```

- [ ] **Step 2: Run project-dialog tests**

```bash
cd /Users/irfnd/Coding/portfolios/irfnd-resume/.worktrees/astro-migration/apps/web
npx vitest run tests/scripts/project-dialog.test.ts
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit --no-verify -m "test(web): add project-dialog script tests"
```

---

### Task 9: Resume Download Script Tests

**Files:**
- Create: `tests/scripts/resume-download.test.ts`

- [ ] **Step 1: Create tests/scripts/resume-download.test.ts**

Source under test (`src/scripts/resume-download.ts`):
- `initResumeDownload()` — click delegation on `[data-resume-download]` buttons
- Reads `data-resume-lang`, `data-resume-api`, `data-resume-key` attributes from button
- Prevents double-click via `data-downloading` attribute
- Fetches PDF, creates blob URL, creates `<a>` link and clicks it, revokes URL
- Shows loading spinner during fetch
- Uses `window.showToast` for success/error messages
- Auto-executes on DOMContentLoaded or immediately

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function buildResumeButtonHTML() {
	return `<button data-resume-download data-resume-lang="en" data-resume-api="http://localhost:3000" data-resume-key="test-key">
		<span>Download Resume</span>
	</button>`;
}

describe('resume-download', () => {
	let mockCreateObjectURL: ReturnType<typeof vi.fn>;
	let mockRevokeObjectURL: ReturnType<typeof vi.fn>;
	let clickedLinks: { href: string; download: string }[];

	beforeEach(() => {
		vi.resetModules();
		document.body.innerHTML = buildResumeButtonHTML();
		window.showToast = vi.fn() as unknown as typeof window.showToast;
		window.removeToast = vi.fn() as unknown as typeof window.removeToast;
		vi.stubGlobal('fetch', vi.fn());

		mockCreateObjectURL = vi.fn().mockReturnValue('blob:http://localhost/fake-blob-url');
		mockRevokeObjectURL = vi.fn();
		vi.stubGlobal('URL', { ...URL, createObjectURL: mockCreateObjectURL, revokeObjectURL: mockRevokeObjectURL });

		clickedLinks = [];
		const origCreateElement = document.createElement.bind(document);
		vi.spyOn(document, 'createElement').mockImplementation((tag: string, options?: ElementCreationOptions) => {
			const el = origCreateElement(tag, options);
			if (tag === 'a') {
				vi.spyOn(el as HTMLAnchorElement, 'click').mockImplementation(() => {
					clickedLinks.push({
						href: (el as HTMLAnchorElement).href,
						download: (el as HTMLAnchorElement).download,
					});
				});
			}
			return el;
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
		document.body.innerHTML = '';
	});

	it('does nothing when click is not on a resume download button', async () => {
		await import('@/scripts/resume-download');
		const div = document.createElement('div');
		document.body.appendChild(div);
		div.click();
		expect(fetch).not.toHaveBeenCalled();
	});

	it('downloads PDF on button click', async () => {
		const blob = new Blob(['pdf-content'], { type: 'application/pdf' });
		vi.mocked(fetch).mockResolvedValueOnce(new Response(blob, { status: 200 }));

		await import('@/scripts/resume-download');
		const btn = document.querySelector('[data-resume-download]') as HTMLElement;
		btn.click();

		await vi.waitFor(() => {
			expect(fetch).toHaveBeenCalledWith('http://localhost:3000/resume?lang=en', {
				headers: { 'X-API-Key': 'test-key' },
			});
		});

		await vi.waitFor(() => {
			expect(mockCreateObjectURL).toHaveBeenCalled();
			expect(mockRevokeObjectURL).toHaveBeenCalled();
			expect(window.showToast).toHaveBeenCalledWith('Resume downloaded!', 'success');
		});
	});

	it('prevents double-click during download', async () => {
		let resolveFetch!: (value: Response) => void;
		vi.mocked(fetch).mockImplementationOnce(
			() => new Promise<Response>((resolve) => { resolveFetch = resolve; }),
		);

		await import('@/scripts/resume-download');
		const btn = document.querySelector('[data-resume-download]') as HTMLElement;

		btn.click();
		await vi.waitFor(() => expect(btn.hasAttribute('data-downloading')).toBe(true));

		// Second click should be ignored
		btn.click();
		expect(fetch).toHaveBeenCalledTimes(1);

		resolveFetch(new Response(new Blob(), { status: 200 }));
		await vi.waitFor(() => expect(btn.hasAttribute('data-downloading')).toBe(false));
	});

	it('shows loading spinner during download', async () => {
		let resolveFetch!: (value: Response) => void;
		vi.mocked(fetch).mockImplementationOnce(
			() => new Promise<Response>((resolve) => { resolveFetch = resolve; }),
		);

		await import('@/scripts/resume-download');
		const btn = document.querySelector('[data-resume-download]') as HTMLElement;
		const originalHTML = btn.innerHTML;

		btn.click();
		await vi.waitFor(() => expect(btn.innerHTML).toContain('Generating...'));

		resolveFetch(new Response(new Blob(), { status: 200 }));
		await vi.waitFor(() => expect(btn.innerHTML).toBe(originalHTML));
	});

	it('shows error toast on fetch failure', async () => {
		vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

		await import('@/scripts/resume-download');
		const btn = document.querySelector('[data-resume-download]') as HTMLElement;
		btn.click();

		await vi.waitFor(() => {
			expect(window.showToast).toHaveBeenCalledWith('Failed to download resume', 'error');
		});
	});

	it('shows error toast on non-ok response', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }));

		await import('@/scripts/resume-download');
		const btn = document.querySelector('[data-resume-download]') as HTMLElement;
		btn.click();

		await vi.waitFor(() => {
			expect(window.showToast).toHaveBeenCalledWith('Failed to generate resume', 'error');
		});
	});

	it('restores button state after error', async () => {
		vi.mocked(fetch).mockRejectedValueOnce(new Error('fail'));

		await import('@/scripts/resume-download');
		const btn = document.querySelector('[data-resume-download]') as HTMLElement;
		const originalHTML = btn.innerHTML;
		btn.click();

		await vi.waitFor(() => {
			expect(btn.innerHTML).toBe(originalHTML);
			expect(btn.hasAttribute('data-downloading')).toBe(false);
		});
	});

	it('uses default values when data attributes are missing', async () => {
		document.body.innerHTML = '<button data-resume-download>Download</button>';
		vi.mocked(fetch).mockResolvedValueOnce(new Response(new Blob(), { status: 200 }));

		await import('@/scripts/resume-download');
		const btn = document.querySelector('[data-resume-download]') as HTMLElement;
		btn.click();

		await vi.waitFor(() => {
			expect(fetch).toHaveBeenCalledWith('http://localhost:3000/resume?lang=en', {
				headers: { 'X-API-Key': '' },
			});
		});
	});
});
```

- [ ] **Step 2: Run resume-download tests**

```bash
cd /Users/irfnd/Coding/portfolios/irfnd-resume/.worktrees/astro-migration/apps/web
npx vitest run tests/scripts/resume-download.test.ts
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit --no-verify -m "test(web): add resume-download script tests"
```

---

### Task 10: GSAP Init Script Tests

**Files:**
- Create: `tests/scripts/gsap-init.test.ts`

- [ ] **Step 1: Create tests/scripts/gsap-init.test.ts**

Source under test (`src/scripts/gsap-init.ts`):
- Imports `gsap` and `ScrollTrigger`, registers plugin
- `initGSAP()` — animates `[data-gsap-fade]`, `[data-gsap-slide-up]`, `[data-gsap-stagger]` elements
- Stagger skips containers with no children
- Auto-executes on DOMContentLoaded or immediately

We mock `gsap` and `gsap/ScrollTrigger` entirely.

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockFromTo = vi.fn();
const mockRegisterPlugin = vi.fn();
const MockScrollTrigger = { name: 'ScrollTrigger' };

vi.mock('gsap', () => ({
	default: { fromTo: mockFromTo, registerPlugin: mockRegisterPlugin },
}));

vi.mock('gsap/ScrollTrigger', () => ({
	ScrollTrigger: MockScrollTrigger,
}));

describe('gsap-init', () => {
	beforeEach(() => {
		vi.resetModules();
		mockFromTo.mockClear();
		mockRegisterPlugin.mockClear();
		document.body.innerHTML = '';

		// Re-mock after resetModules
		vi.doMock('gsap', () => ({
			default: { fromTo: mockFromTo, registerPlugin: mockRegisterPlugin },
		}));
		vi.doMock('gsap/ScrollTrigger', () => ({
			ScrollTrigger: MockScrollTrigger,
		}));
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('registers ScrollTrigger plugin', async () => {
		await import('@/scripts/gsap-init');
		expect(mockRegisterPlugin).toHaveBeenCalledWith(MockScrollTrigger);
	});

	it('animates data-gsap-fade elements', async () => {
		document.body.innerHTML = '<div data-gsap-fade>Fade me</div>';
		await import('@/scripts/gsap-init');

		expect(mockFromTo).toHaveBeenCalledWith(
			expect.any(Element),
			{ autoAlpha: 0 },
			expect.objectContaining({ autoAlpha: 1, duration: 0.6 }),
		);
	});

	it('animates data-gsap-slide-up elements', async () => {
		document.body.innerHTML = '<div data-gsap-slide-up>Slide me</div>';
		await import('@/scripts/gsap-init');

		expect(mockFromTo).toHaveBeenCalledWith(
			expect.any(Element),
			{ autoAlpha: 0, y: 30 },
			expect.objectContaining({ autoAlpha: 1, y: 0, duration: 0.6 }),
		);
	});

	it('animates children of data-gsap-stagger containers', async () => {
		document.body.innerHTML = `
			<div data-gsap-stagger>
				<div>Child 1</div>
				<div>Child 2</div>
			</div>
		`;
		await import('@/scripts/gsap-init');

		expect(mockFromTo).toHaveBeenCalledWith(
			expect.any(HTMLCollection),
			{ autoAlpha: 0, y: 20 },
			expect.objectContaining({ autoAlpha: 1, y: 0, stagger: 0.1 }),
		);
	});

	it('skips stagger container with no children', async () => {
		document.body.innerHTML = '<div data-gsap-stagger></div>';
		await import('@/scripts/gsap-init');

		// fromTo should not be called for the stagger (only registerPlugin was called)
		expect(mockFromTo).not.toHaveBeenCalled();
	});

	it('handles multiple elements of each type', async () => {
		document.body.innerHTML = `
			<div data-gsap-fade>A</div>
			<div data-gsap-fade>B</div>
			<div data-gsap-slide-up>C</div>
		`;
		await import('@/scripts/gsap-init');

		// 2 fade + 1 slide-up = 3 calls
		expect(mockFromTo).toHaveBeenCalledTimes(3);
	});

	it('does nothing when no animated elements exist', async () => {
		document.body.innerHTML = '<div>No animations</div>';
		await import('@/scripts/gsap-init');
		expect(mockFromTo).not.toHaveBeenCalled();
	});
});
```

- [ ] **Step 2: Run gsap-init tests**

```bash
cd /Users/irfnd/Coding/portfolios/irfnd-resume/.worktrees/astro-migration/apps/web
npx vitest run tests/scripts/gsap-init.test.ts
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit --no-verify -m "test(web): add gsap-init script tests"
```

---

### Task 11: Coverage Audit and Final Adjustments

- [ ] **Step 1: Run full test suite**

```bash
cd /Users/irfnd/Coding/portfolios/irfnd-resume/.worktrees/astro-migration/apps/web
npx vitest run 2>&1 | tail -30
```

Expected: All tests pass.

- [ ] **Step 2: Run coverage check**

```bash
npx vitest run --coverage 2>&1 | tail -60
```

Expected: 100% coverage on all included files, or clear indication of which lines need attention.

- [ ] **Step 3: Fix any coverage gaps**

If any file has < 100% coverage:
1. If it's a defensive/unreachable branch, add `/* v8 ignore next -- @preserve */` in the source file
2. If it's a testable branch we missed, add the test
3. If the file is too complex to reach 100% (e.g., gsap-init edge cases), add it to `vitest.config.ts` coverage exclude list

- [ ] **Step 4: Re-run coverage to confirm 100%**

```bash
npx vitest run --coverage 2>&1 | tail -60
```

Expected: All thresholds met (100% statements, branches, functions, lines).

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit --no-verify -m "test(web): replace React tests with Astro-compatible test suite

- Delete all React component, hook, provider, and route tests
- Update vitest.config.ts: add happy-dom env, exclude legacy React files from coverage
- Add pure utility tests: cn, cloudinary, portfolio, text
- Add content tests: tech-stack-list, translation structure parity
- Add DOM script tests: theme, toast, language, contact-form, project-dialog, resume-download, gsap-init
- All scripts use dynamic import with vi.resetModules() for auto-executing modules
- 100% coverage on all included source files"
```
