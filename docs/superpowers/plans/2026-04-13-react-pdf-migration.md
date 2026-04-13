# React-PDF Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Puppeteer-based PDF generation in `apps/api` with `@react-pdf/renderer` React components, ported from the v2 branch and adapted to use `@irfnd/data` types.

**Architecture:** The API's resume route currently builds an HTML string and pipes it through Puppeteer's headless Chrome to produce a PDF. This plan replaces that with `@react-pdf/renderer` — React components that describe the PDF layout declaratively, rendered server-side via `renderToBuffer()`. Components are ported from the `irfnd/v2` branch, adapted to consume `@irfnd/data` types directly.

**Tech Stack:** `@react-pdf/renderer`, `react`, `@irfnd/data`, Hono, Vitest, `@testing-library/react`

**Design spec:** `docs/superpowers/specs/2026-04-13-react-pdf-migration-design.md`

---

## File Structure

### Files to Create

| File | Responsibility |
|------|---------------|
| `apps/api/src/templates/pdf/styles.ts` | StyleSheet definitions + Font hyphenation config |
| `apps/api/src/templates/pdf/sections/header.tsx` | Name, role, contact line section |
| `apps/api/src/templates/pdf/sections/experience.tsx` | Work experience with multi-position support |
| `apps/api/src/templates/pdf/sections/education.tsx` | Education history with awards |
| `apps/api/src/templates/pdf/sections/skills.tsx` | Categorized tech skills |
| `apps/api/src/templates/pdf/sections/projects.tsx` | Selected portfolio projects |
| `apps/api/src/templates/pdf/resume.tsx` | Root ResumePDF document component |
| `apps/api/src/templates/pdf/index.ts` | Barrel export |
| `apps/api/tests/templates/pdf/styles.test.ts` | Style definition tests |
| `apps/api/tests/templates/pdf/header-section.test.tsx` | Header section tests |
| `apps/api/tests/templates/pdf/experience-section.test.tsx` | Experience section tests |
| `apps/api/tests/templates/pdf/education-section.test.tsx` | Education section tests |
| `apps/api/tests/templates/pdf/skills-section.test.tsx` | Skills section tests |
| `apps/api/tests/templates/pdf/projects-section.test.tsx` | Projects section tests |
| `apps/api/tests/templates/pdf/resume.test.tsx` | ResumePDF composition tests |

### Files to Modify

| File | Change |
|------|--------|
| `apps/api/package.json` | Add `react`, `@react-pdf/renderer`; remove `puppeteer`; add `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` devDeps |
| `apps/api/tsconfig.json` | Add `"jsx": "react-jsx"` |
| `apps/api/vitest.config.ts` | Add `.tsx` to test include pattern; add jsdom environment override for tsx tests |
| `apps/api/src/routes/resume.ts` | Replace Puppeteer with `renderToBuffer()` + `createElement` |
| `apps/api/tests/routes/resume.test.ts` | Replace Puppeteer mock with `@react-pdf/renderer` mock |

### Files to Delete

| File | Reason |
|------|--------|
| `apps/api/src/templates/resume.ts` | Replaced by PDF components |
| `apps/api/tests/templates/resume.test.ts` | Replaced by PDF component tests |

---

## Task 1: Dependencies and Configuration

**Files:**
- Modify: `apps/api/package.json`
- Modify: `apps/api/tsconfig.json`
- Modify: `apps/api/vitest.config.ts`

- [ ] **Step 1: Add React PDF dependencies and remove Puppeteer**

```bash
cd apps/api
bun add react @react-pdf/renderer
bun add -D @testing-library/react @testing-library/jest-dom jsdom @types/react
bun remove puppeteer
```

- [ ] **Step 2: Add JSX support to tsconfig.json**

In `apps/api/tsconfig.json`, add `"jsx": "react-jsx"` to `compilerOptions`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "jsx": "react-jsx",
    "lib": ["ES2022"],
    "types": ["bun"],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src", "tests"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Update vitest.config.ts to include `.tsx` test files and add jsdom for component tests**

```ts
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: { alias: { '@': path.resolve(__dirname, './src') } },
	test: {
		globals: true,
		environment: 'node',
		env: { NODE_ENV: 'test' },
		include: ['tests/**/*.{test,spec}.{ts,tsx}'],
		exclude: ['node_modules', 'dist'],
		environmentMatchGlobs: [['tests/**/*.test.tsx', 'jsdom']],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			reportsDirectory: './coverage',
			include: ['src/**/*.{ts,tsx}'],
			exclude: ['src/types/**', 'src/**/index.ts'],
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

Key changes: `include` pattern adds `tsx`, `environmentMatchGlobs` runs `.tsx` tests in `jsdom`, coverage `include` adds `tsx`.

- [ ] **Step 4: Verify install succeeded**

```bash
cd apps/api
bun run test
```

Expected: All existing tests still pass (the Puppeteer mock in route test will break — that's expected and fixed in Task 7).

- [ ] **Step 5: Commit**

```bash
git add apps/api/package.json apps/api/tsconfig.json apps/api/vitest.config.ts bun.lock
git commit -m "chore(api): add react-pdf deps, remove puppeteer, configure jsx"
```

---

## Task 2: PDF Styles

**Files:**
- Create: `apps/api/src/templates/pdf/styles.ts`
- Create: `apps/api/tests/templates/pdf/styles.test.ts`

- [ ] **Step 1: Write the styles test**

Create `apps/api/tests/templates/pdf/styles.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-pdf/renderer', () => ({
	Font: { registerHyphenationCallback: vi.fn() },
	StyleSheet: {
		create: <T extends Record<string, unknown>>(styles: T): T => styles,
	},
}));

import { styles } from '@/templates/pdf/styles';

describe('PDF Styles', () => {
	it('should define page styles', () => {
		expect(styles.page).toBeDefined();
		expect(styles.page.flexDirection).toBe('column');
		expect(styles.page.backgroundColor).toBe('#ffffff');
		expect(styles.page.paddingHorizontal).toBe(50);
		expect(styles.page.paddingVertical).toBe(36);
		expect(styles.page.gap).toBe(14);
	});

	it('should define text styles', () => {
		expect(styles.text).toBeDefined();
		expect(styles.text.fontFamily).toBe('Times-Roman');
		expect(styles.text.fontSize).toBe(10);
	});

	it('should define bold styles', () => {
		expect(styles.bold).toBeDefined();
		expect(styles.bold.fontFamily).toBe('Times-Bold');
	});

	it('should define italic styles', () => {
		expect(styles.italic).toBeDefined();
		expect(styles.italic.fontFamily).toBe('Times-Italic');
	});

	it('should define link styles', () => {
		expect(styles.link).toBeDefined();
		expect(styles.link.color).toBe('#000');
		expect(styles.link.textDecoration).toBe('none');
	});

	it('should define vertical divider styles', () => {
		expect(styles.dividerV).toBeDefined();
		expect(styles.dividerV.borderLeft).toBe('1px solid black');
	});

	it('should define horizontal divider styles', () => {
		expect(styles.dividerH).toBeDefined();
		expect(styles.dividerH.borderTop).toBe('1px solid black');
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd apps/api && bun vitest run tests/templates/pdf/styles.test.ts
```

Expected: FAIL — `@/templates/pdf/styles` module not found.

- [ ] **Step 3: Implement styles**

Create `apps/api/src/templates/pdf/styles.ts`:

```ts
import { Font, StyleSheet } from '@react-pdf/renderer';

/* v8 ignore next -- @preserve */
Font.registerHyphenationCallback((word) => [word]);

export const styles = StyleSheet.create({
	page: { flexDirection: 'column', backgroundColor: '#ffffff', paddingHorizontal: 50, paddingVertical: 36, gap: 14 },
	text: { fontFamily: 'Times-Roman', fontSize: 10 },
	bold: { fontFamily: 'Times-Bold' },
	italic: { fontFamily: 'Times-Italic' },
	link: { color: '#000', textDecoration: 'none' },
	dividerV: { borderLeft: '1px solid black' },
	dividerH: { borderTop: '1px solid black' },
});
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd apps/api && bun vitest run tests/templates/pdf/styles.test.ts
```

Expected: All 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/templates/pdf/styles.ts apps/api/tests/templates/pdf/styles.test.ts
git commit -m "feat(api): add react-pdf styles module"
```

---

## Task 3: Header Section

**Files:**
- Create: `apps/api/src/templates/pdf/sections/header.tsx`
- Create: `apps/api/tests/templates/pdf/header-section.test.tsx`

- [ ] **Step 1: Write the header section test**

Create `apps/api/tests/templates/pdf/header-section.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-pdf/renderer', () => ({
	Link: ({ children, src }: { children: React.ReactNode; src: string }) => (
		<a href={src} data-testid="pdf-link">{children}</a>
	),
	Text: ({ children }: { children: React.ReactNode }) => <span data-testid="pdf-text">{children}</span>,
	View: ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-view">{children}</div>,
	Font: { registerHyphenationCallback: vi.fn() },
	StyleSheet: { create: (s: Record<string, unknown>) => s },
}));

vi.mock('@/templates/pdf/styles', () => ({
	styles: { text: {}, bold: {}, italic: {}, link: {} },
}));

import { render, screen } from '@testing-library/react';
import type { ContactData, ProfileData } from '@irfnd/data';

import { HeaderSection } from '@/templates/pdf/sections/header';

describe('HeaderSection', () => {
	const mockProfile: ProfileData = {
		firstName: 'John',
		lastName: 'Doe',
		role: 'Software Engineer',
		photo: { url: '', alt: '' },
		description: '',
	};

	const mockContact: ContactData = {
		items: [
			{ type: 'location', label: 'Jakarta, Indonesia', url: 'https://maps.example.com', icon: 'tabler:map-pin', showInResume: true },
			{ type: 'contact', label: 'irfandi@example.com', url: 'mailto:irfandi@example.com', icon: 'tabler:mail', showInResume: true },
			{ type: 'contact', label: 'LinkedIn', url: 'https://www.linkedin.com/in/johndoe', icon: 'tabler:brand-linkedin', showInResume: true },
			{ type: 'contact', label: 'GitHub', url: 'https://github.com/johndoe', icon: 'tabler:brand-github', showInResume: true },
			{ type: 'contact', label: 'Whatsapp', url: 'https://wa.me/123456', icon: 'tabler:brand-whatsapp', showInContactPage: true },
		],
	};

	it('should render profile name in uppercase', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
	});

	it('should render profile role', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		expect(screen.getByText('Software Engineer')).toBeInTheDocument();
	});

	it('should render location', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		expect(screen.getByText('Jakarta, Indonesia')).toBeInTheDocument();
	});

	it('should format mailto URLs correctly', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		expect(screen.getByText('irfandi@example.com')).toBeInTheDocument();
	});

	it('should format LinkedIn URLs correctly', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		expect(screen.getByText('linkedin.com/in/johndoe')).toBeInTheDocument();
	});

	it('should format GitHub URLs correctly', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		expect(screen.getByText('github.com/johndoe')).toBeInTheDocument();
	});

	it('should only render items with showInResume', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		expect(screen.queryByText(/wa\.me/)).not.toBeInTheDocument();
	});

	it('should render links for non-location resume contacts', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		const links = screen.getAllByTestId('pdf-link');
		expect(links).toHaveLength(3);
	});

	it('should render without location when none has showInResume', () => {
		const noLocation: ContactData = {
			items: mockContact.items.filter((c) => c.type !== 'location'),
		};
		render(<HeaderSection profile={mockProfile} contact={noLocation} />);
		expect(screen.queryByText('Jakarta, Indonesia')).not.toBeInTheDocument();
	});

	it('should render pipe separators between contact items', () => {
		render(<HeaderSection profile={mockProfile} contact={mockContact} />);
		const pipes = screen.getAllByText('|');
		expect(pipes).toHaveLength(3);
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd apps/api && bun vitest run tests/templates/pdf/header-section.test.tsx
```

Expected: FAIL — `@/templates/pdf/sections/header` not found.

- [ ] **Step 3: Implement header section**

Create `apps/api/src/templates/pdf/sections/header.tsx`:

```tsx
import type { ContactData, ProfileData } from '@irfnd/data';
import { Link, Text, View } from '@react-pdf/renderer';
import * as React from 'react';

import { styles } from '@/templates/pdf/styles';

interface HeaderSectionProps {
	profile: ProfileData;
	contact: ContactData;
}

function formatUrl(url: string) {
	return url.replace('mailto:', '').replace('https://www.', '').replace('https://', '').replace(/\/$/, '');
}

export function HeaderSection({ profile, contact }: HeaderSectionProps) {
	const name = `${profile.firstName} ${profile.lastName}`;
	const resumeItems = contact.items.filter((c) => c.showInResume);
	const location = resumeItems.find((c) => c.type === 'location');
	const resumeLinks = resumeItems.filter((c) => c.type !== 'location');

	return (
		<View style={{ alignItems: 'flex-start' }}>
			<Text style={[styles.bold, { fontSize: 16 }]}>{name.toUpperCase()}</Text>
			<Text style={[styles.text, styles.italic, { marginBottom: 2 }]}>{profile.role}</Text>
			<View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
				{location && <Text style={styles.text}>{location.label}</Text>}
				{resumeLinks.map((item, i) => (
					<React.Fragment key={i}>
						<Text style={styles.text}>|</Text>
						<Link src={item.url} style={[styles.text, styles.link]}>
							{formatUrl(item.url)}
						</Link>
					</React.Fragment>
				))}
			</View>
		</View>
	);
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd apps/api && bun vitest run tests/templates/pdf/header-section.test.tsx
```

Expected: All 10 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/templates/pdf/sections/header.tsx apps/api/tests/templates/pdf/header-section.test.tsx
git commit -m "feat(api): add PDF header section component"
```

---

## Task 4: Experience Section

**Files:**
- Create: `apps/api/src/templates/pdf/sections/experience.tsx`
- Create: `apps/api/tests/templates/pdf/experience-section.test.tsx`

- [ ] **Step 1: Write the experience section test**

Create `apps/api/tests/templates/pdf/experience-section.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-pdf/renderer', () => ({
	Link: ({ children, src }: { children: React.ReactNode; src: string }) => (
		<a href={src} data-testid="pdf-link">{children}</a>
	),
	Text: ({ children }: { children: React.ReactNode }) => <span data-testid="pdf-text">{children}</span>,
	View: ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-view">{children}</div>,
	Font: { registerHyphenationCallback: vi.fn() },
	StyleSheet: { create: (s: Record<string, unknown>) => s },
}));

vi.mock('@/templates/pdf/styles', () => ({
	styles: { text: {}, bold: {}, italic: {}, dividerH: {}, link: {} },
}));

import { render, screen } from '@testing-library/react';
import type { ExperienceData } from '@irfnd/data';

import { ExperienceSection } from '@/templates/pdf/sections/experience';

describe('ExperienceSection', () => {
	const mockExperience: ExperienceData = {
		title: 'Work Experience',
		jobs: [
			{
				company: 'Tech Corp',
				mainPosition: 'Senior Developer',
				location: 'Remote',
				type: 'Full-time',
				duration: ['Jan 2023', 'Present'],
				link: 'https://techcorp.com',
				descriptions: [
					{
						position: 'Senior Developer',
						summary: [{ value: 'Built {0} applications.', keywords: ['scalable'] }],
						points: [{ value: 'Led team of {0} developers.', keywords: ['5'] }],
						stacks: [],
					},
				],
			},
			{
				company: 'Startup Inc',
				mainPosition: 'Full Stack Developer',
				location: 'Jakarta',
				type: 'Contract',
				duration: ['Jun 2022', 'Dec 2022'],
				link: null,
				descriptions: [
					{
						position: 'Full Stack Developer',
						summary: [],
						points: [],
						stacks: [],
					},
					{
						position: 'Frontend Developer',
						duration: ['Jun 2022', 'Sep 2022'],
						summary: [],
						points: [{ value: 'Implemented UI components.', keywords: [] }],
						stacks: [],
					},
				],
			},
		],
	};

	it('should render section title in uppercase', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('WORK EXPERIENCE')).toBeInTheDocument();
	});

	it('should render company name in uppercase with link', () => {
		render(<ExperienceSection experience={mockExperience} />);
		const link = screen.getByText('TECH CORP');
		expect(link.closest('a')).toHaveAttribute('href', 'https://techcorp.com');
	});

	it('should render company name without link when null', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('STARTUP INC')).toBeInTheDocument();
	});

	it('should render job duration', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Jan 2023 – Present')).toBeInTheDocument();
	});

	it('should render position title', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Senior Developer')).toBeInTheDocument();
	});

	it('should render location and type for first description', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Remote · Full-time')).toBeInTheDocument();
	});

	it('should render per-description duration for subsequent descriptions', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Jun 2022 – Sep 2022')).toBeInTheDocument();
	});

	it('should fall back to job duration when description has no duration', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Jakarta · Contract')).toBeInTheDocument();
	});

	it('should render summary with resolved placeholders', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Built scalable applications.')).toBeInTheDocument();
	});

	it('should render bullet points with resolved placeholders', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Led team of 5 developers.')).toBeInTheDocument();
	});

	it('should render multiple positions for same company', () => {
		render(<ExperienceSection experience={mockExperience} />);
		expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
		expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd apps/api && bun vitest run tests/templates/pdf/experience-section.test.tsx
```

Expected: FAIL — `@/templates/pdf/sections/experience` not found.

- [ ] **Step 3: Implement experience section**

Create `apps/api/src/templates/pdf/sections/experience.tsx`:

```tsx
import type { ExperienceData } from '@irfnd/data';
import { resolveParagraph } from '@irfnd/data';
import { Link, Text, View } from '@react-pdf/renderer';

import { styles } from '@/templates/pdf/styles';

interface ExperienceSectionProps {
	experience: ExperienceData;
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
	return (
		<View style={{ gap: 10 }}>
			<View style={{ gap: 4 }}>
				<Text style={[styles.bold, { fontSize: 12 }]}>{experience.title.toUpperCase()}</Text>
				<View style={styles.dividerH} />
			</View>

			{experience.jobs.map((job, i) => (
				<View key={i} style={{ gap: 3 }}>
					{job.descriptions.map((desc, j) => (
						<View key={j}>
							{j === 0 && (
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
									{job.link ? (
										<Link src={job.link} style={[styles.text, styles.bold, styles.link]}>
											{job.company.toUpperCase()}
										</Link>
									) : (
										<Text style={[styles.text, styles.bold]}>{job.company.toUpperCase()}</Text>
									)}
									<Text style={[styles.text, styles.italic]}>{job.duration.join(' – ')}</Text>
								</View>
							)}
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
								<Text style={[styles.text, styles.bold]}>{desc.position}</Text>
								{j === 0 ? (
									<Text style={[styles.text, styles.italic]}>
										{job.location} · {job.type}
									</Text>
								) : (
									<Text style={[styles.text, styles.italic]}>
										{(desc.duration ?? job.duration).join(' – ')}
									</Text>
								)}
							</View>

							{desc.summary.length > 0 && (
								<View>
									{desc.summary.map((s, k) => (
										<Text key={k} style={[styles.text, { textAlign: 'justify' }]}>
											{resolveParagraph(s)}
										</Text>
									))}
								</View>
							)}

							{desc.points.length > 0 && (
								<View>
									{desc.points.map((point, k) => (
										<View key={k} style={{ flexDirection: 'row' }}>
											<Text style={[styles.text, { width: '2%' }]}>•</Text>
											<Text style={[styles.text, { width: '98%', textAlign: 'justify' }]}>
												{resolveParagraph(point)}
											</Text>
										</View>
									))}
								</View>
							)}
						</View>
					))}
				</View>
			))}
		</View>
	);
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd apps/api && bun vitest run tests/templates/pdf/experience-section.test.tsx
```

Expected: All 11 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/templates/pdf/sections/experience.tsx apps/api/tests/templates/pdf/experience-section.test.tsx
git commit -m "feat(api): add PDF experience section component"
```

---

## Task 5: Education Section

**Files:**
- Create: `apps/api/src/templates/pdf/sections/education.tsx`
- Create: `apps/api/tests/templates/pdf/education-section.test.tsx`

- [ ] **Step 1: Write the education section test**

Create `apps/api/tests/templates/pdf/education-section.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-pdf/renderer', () => ({
	Link: ({ children, src }: { children: React.ReactNode; src: string }) => (
		<a href={src} data-testid="pdf-link">{children}</a>
	),
	Text: ({ children }: { children: React.ReactNode }) => <span data-testid="pdf-text">{children}</span>,
	View: ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-view">{children}</div>,
	Font: { registerHyphenationCallback: vi.fn() },
	StyleSheet: { create: (s: Record<string, unknown>) => s },
}));

vi.mock('@/templates/pdf/styles', () => ({
	styles: { text: {}, bold: {}, italic: {}, dividerH: {}, link: {} },
}));

import { render, screen } from '@testing-library/react';
import type { EducationData } from '@irfnd/data';

import { EducationSection } from '@/templates/pdf/sections/education';

describe('EducationSection', () => {
	const mockEducation: EducationData = {
		title: 'Education',
		educations: [
			{
				institution: 'University of Technology',
				location: 'Jakarta',
				degree: 'Bachelor of Science',
				fieldOfStudy: 'Computer Science',
				duration: ['2018', '2022'],
				link: 'https://university.edu',
				summary: [{ value: 'Graduated with {0}.', keywords: ['honors'] }],
				points: [{ value: "Dean's List {0}.", keywords: ['2020'] }],
				award: [{ label: 'Best Thesis', description: 'Machine Learning Project', icon: '' }],
			},
			{
				institution: 'High School',
				location: 'Bandung',
				degree: 'High School Diploma',
				fieldOfStudy: 'Science',
				duration: ['2015', '2018'],
				link: null,
				summary: [],
				points: [],
				award: [],
			},
		],
	};

	it('should render section title in uppercase', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText('EDUCATION')).toBeInTheDocument();
	});

	it('should render institution name in uppercase with link', () => {
		render(<EducationSection education={mockEducation} />);
		const link = screen.getByText('UNIVERSITY OF TECHNOLOGY');
		expect(link.closest('a')).toHaveAttribute('href', 'https://university.edu');
	});

	it('should render institution name without link when null', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText('HIGH SCHOOL')).toBeInTheDocument();
	});

	it('should render education duration', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText('2018 – 2022')).toBeInTheDocument();
	});

	it('should render degree and field of study', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText('Bachelor of Science · Computer Science')).toBeInTheDocument();
	});

	it('should render location', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText('Jakarta')).toBeInTheDocument();
	});

	it('should render summary with resolved placeholders', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText('Graduated with honors.')).toBeInTheDocument();
	});

	it('should render bullet points with resolved placeholders', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText("Dean's List 2020.")).toBeInTheDocument();
	});

	it('should render awards', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText('Best Thesis — Machine Learning Project')).toBeInTheDocument();
	});

	it('should handle empty summary, points, and awards', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText('HIGH SCHOOL')).toBeInTheDocument();
		expect(screen.getByText('High School Diploma · Science')).toBeInTheDocument();
	});

	it('should render multiple education entries', () => {
		render(<EducationSection education={mockEducation} />);
		expect(screen.getByText('UNIVERSITY OF TECHNOLOGY')).toBeInTheDocument();
		expect(screen.getByText('HIGH SCHOOL')).toBeInTheDocument();
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd apps/api && bun vitest run tests/templates/pdf/education-section.test.tsx
```

Expected: FAIL — `@/templates/pdf/sections/education` not found.

- [ ] **Step 3: Implement education section**

Create `apps/api/src/templates/pdf/sections/education.tsx`:

```tsx
import type { EducationData } from '@irfnd/data';
import { resolveParagraph } from '@irfnd/data';
import { Link, Text, View } from '@react-pdf/renderer';

import { styles } from '@/templates/pdf/styles';

interface EducationSectionProps {
	education: EducationData;
}

export function EducationSection({ education }: EducationSectionProps) {
	return (
		<View style={{ gap: 10 }}>
			<View style={{ gap: 4 }}>
				<Text style={[styles.bold, { fontSize: 12 }]}>{education.title.toUpperCase()}</Text>
				<View style={styles.dividerH} />
			</View>

			{education.educations.map((edu, i) => (
				<View key={i} style={{ gap: 2 }}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						{edu.link ? (
							<Link src={edu.link} style={[styles.text, styles.bold, styles.link]}>
								{edu.institution.toUpperCase()}
							</Link>
						) : (
							<Text style={[styles.text, styles.bold]}>{edu.institution.toUpperCase()}</Text>
						)}
						<Text style={[styles.text, styles.italic]}>{edu.duration.join(' – ')}</Text>
					</View>

					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text style={[styles.text, styles.bold]}>
							{edu.degree} · {edu.fieldOfStudy}
						</Text>
						<Text style={[styles.text, styles.italic]}>{edu.location}</Text>
					</View>

					{edu.summary.length > 0 && (
						<View>
							{edu.summary.map((s, j) => (
								<Text key={j} style={[styles.text, { textAlign: 'justify' }]}>
									{resolveParagraph(s)}
								</Text>
							))}
						</View>
					)}

					{edu.points.length > 0 && (
						<View>
							{edu.points.map((point, j) => (
								<View key={j} style={{ flexDirection: 'row' }}>
									<Text style={[styles.text, { width: '2%' }]}>•</Text>
									<Text style={[styles.text, { width: '98%', textAlign: 'justify' }]}>
										{resolveParagraph(point)}
									</Text>
								</View>
							))}
						</View>
					)}

					{edu.award.length > 0 && (
						<View>
							{edu.award.map((award, j) => (
								<Text key={j} style={[styles.text, styles.italic]}>
									{award.label} — {award.description}
								</Text>
							))}
						</View>
					)}
				</View>
			))}
		</View>
	);
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd apps/api && bun vitest run tests/templates/pdf/education-section.test.tsx
```

Expected: All 11 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/templates/pdf/sections/education.tsx apps/api/tests/templates/pdf/education-section.test.tsx
git commit -m "feat(api): add PDF education section component"
```

---

## Task 6: Skills Section

**Files:**
- Create: `apps/api/src/templates/pdf/sections/skills.tsx`
- Create: `apps/api/tests/templates/pdf/skills-section.test.tsx`

- [ ] **Step 1: Write the skills section test**

Create `apps/api/tests/templates/pdf/skills-section.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-pdf/renderer', () => ({
	Text: ({ children }: { children: React.ReactNode }) => <span data-testid="pdf-text">{children}</span>,
	View: ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-view">{children}</div>,
	Font: { registerHyphenationCallback: vi.fn() },
	StyleSheet: { create: (s: Record<string, unknown>) => s },
}));

vi.mock('@/templates/pdf/styles', () => ({
	styles: { text: {}, bold: {}, italic: {}, dividerH: {} },
}));

import { render, screen } from '@testing-library/react';
import type { TechnologyData } from '@irfnd/data';

import { SkillsSection } from '@/templates/pdf/sections/skills';

describe('SkillsSection', () => {
	const mockTechnology: TechnologyData = {
		title: 'Technical Skills',
		stacks: {
			Frontend: ['React', 'Vue.js', 'Angular'],
			Backend: ['Node.js', 'Python'],
			Database: ['PostgreSQL'],
		},
	};

	it('should render section title in uppercase', () => {
		render(<SkillsSection technology={mockTechnology} />);
		expect(screen.getByText('TECHNICAL SKILLS')).toBeInTheDocument();
	});

	it('should render all skill categories', () => {
		render(<SkillsSection technology={mockTechnology} />);
		expect(screen.getByText('Frontend')).toBeInTheDocument();
		expect(screen.getByText('Backend')).toBeInTheDocument();
		expect(screen.getByText('Database')).toBeInTheDocument();
	});

	it('should render skill labels sorted alphabetically', () => {
		render(<SkillsSection technology={mockTechnology} />);
		expect(screen.getByText('Angular, React, Vue.js')).toBeInTheDocument();
	});

	it('should render skills separated by commas', () => {
		render(<SkillsSection technology={mockTechnology} />);
		expect(screen.getByText('Node.js, Python')).toBeInTheDocument();
	});

	it('should render single skill without comma', () => {
		render(<SkillsSection technology={mockTechnology} />);
		expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
	});

	it('should render colon separators', () => {
		render(<SkillsSection technology={mockTechnology} />);
		const colons = screen.getAllByText(':');
		expect(colons).toHaveLength(3);
	});

	it('should handle empty stacks object', () => {
		const emptyTech: TechnologyData = { title: 'Skills', stacks: {} };
		render(<SkillsSection technology={emptyTech} />);
		expect(screen.getByText('SKILLS')).toBeInTheDocument();
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd apps/api && bun vitest run tests/templates/pdf/skills-section.test.tsx
```

Expected: FAIL — `@/templates/pdf/sections/skills` not found.

- [ ] **Step 3: Implement skills section**

Create `apps/api/src/templates/pdf/sections/skills.tsx`:

```tsx
import type { TechnologyData } from '@irfnd/data';
import { Text, View } from '@react-pdf/renderer';

import { styles } from '@/templates/pdf/styles';

interface SkillsSectionProps {
	technology: TechnologyData;
}

export function SkillsSection({ technology }: SkillsSectionProps) {
	return (
		<View style={{ gap: 10 }} break>
			<View style={{ gap: 4 }}>
				<Text style={[styles.bold, { fontSize: 12 }]}>{technology.title.toUpperCase()}</Text>
				<View style={styles.dividerH} />
			</View>

			<View style={{ gap: 3 }}>
				{Object.entries(technology.stacks).map(([category, skills]) => (
					<View key={category} style={{ flexDirection: 'row', gap: 5 }}>
						<Text style={[styles.text, styles.bold, { width: 130 }]}>{category}</Text>
						<Text style={[styles.text, { width: 8 }]}>:</Text>
						<Text style={[styles.text, styles.italic, { flex: 1 }]}>
							{[...skills].sort((a, b) => a.localeCompare(b)).join(', ')}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
}
```

Note: Unlike v2 which had `stacks` as objects with `.label`, the current `TechnologyData` has `stacks: Record<string, string[]>` — skills are already plain strings.

- [ ] **Step 4: Run test to verify it passes**

```bash
cd apps/api && bun vitest run tests/templates/pdf/skills-section.test.tsx
```

Expected: All 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/templates/pdf/sections/skills.tsx apps/api/tests/templates/pdf/skills-section.test.tsx
git commit -m "feat(api): add PDF skills section component"
```

---

## Task 7: Projects Section

**Files:**
- Create: `apps/api/src/templates/pdf/sections/projects.tsx`
- Create: `apps/api/tests/templates/pdf/projects-section.test.tsx`

- [ ] **Step 1: Write the projects section test**

Create `apps/api/tests/templates/pdf/projects-section.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-pdf/renderer', () => ({
	Link: ({ children, src }: { children: React.ReactNode; src: string }) => (
		<a href={src} data-testid="pdf-link">{children}</a>
	),
	Text: ({ children }: { children: React.ReactNode }) => <span data-testid="pdf-text">{children}</span>,
	View: ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-view">{children}</div>,
	Font: { registerHyphenationCallback: vi.fn() },
	StyleSheet: { create: (s: Record<string, unknown>) => s },
}));

vi.mock('@/templates/pdf/styles', () => ({
	styles: { text: {}, bold: {}, italic: {}, dividerH: {}, dividerV: {}, link: {} },
}));

import { render, screen } from '@testing-library/react';
import type { LangCode, PortfolioData } from '@irfnd/data';

import { ProjectsSection } from '@/templates/pdf/sections/projects';

describe('ProjectsSection', () => {
	const mockPortfolio: PortfolioData = {
		header: 'Portfolio',
		title: 'Projects',
		subtitle: 'My projects',
		projects: [
			{
				icon: '',
				name: 'Project Alpha',
				category: 'frontend',
				type: 'public',
				summary: [{ value: 'A {0} web app.', keywords: ['modern'] }],
				stacks: ['TypeScript', 'React'],
				demo: 'https://alpha.example.com',
				source: 'https://github.com/example/alpha',
				image: [],
				isSelected: true,
			},
			{
				icon: '',
				name: 'Project Beta',
				category: 'backend',
				type: 'private',
				summary: [{ value: 'Internal API service.', keywords: [] }],
				stacks: [],
				demo: null,
				source: null,
				image: [],
				isSelected: true,
			},
			{
				icon: '',
				name: 'Project Gamma',
				category: 'fullstack',
				type: 'public',
				summary: [],
				stacks: ['Node.js'],
				demo: 'https://gamma.example.com',
				source: null,
				image: [],
				isSelected: true,
			},
			{
				icon: '',
				name: 'Hidden Project',
				category: 'frontend',
				type: 'public',
				summary: [],
				stacks: [],
				demo: null,
				source: null,
				image: [],
			},
		],
	};

	describe('English language', () => {
		it('should render section title in uppercase', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.getByText('PROJECTS')).toBeInTheDocument();
		});

		it('should render project name in uppercase with demo link', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			const link = screen.getByText('PROJECT ALPHA');
			expect(link.closest('a')).toHaveAttribute('href', 'https://alpha.example.com');
		});

		it('should render project name without link when no demo', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.getByText('PROJECT BETA')).toBeInTheDocument();
		});

		it('should render summary with resolved placeholders', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.getByText('A modern web app.')).toBeInTheDocument();
		});

		it('should render technology stacks sorted alphabetically', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.getByText('React, TypeScript')).toBeInTheDocument();
		});

		it('should render Technologies label in English', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.getAllByText(/Technologies:/)).toHaveLength(2);
		});

		it('should render Live Demo link in English', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.getAllByText('Live Demo')).toHaveLength(2);
		});

		it('should render Source Code link in English', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.getByText('Source Code')).toBeInTheDocument();
		});

		it('should not render projects without isSelected', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.queryByText('HIDDEN PROJECT')).not.toBeInTheDocument();
		});

		it('should handle empty summary', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.getByText('PROJECT GAMMA')).toBeInTheDocument();
		});

		it('should handle empty stacks', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			expect(screen.getByText('PROJECT BETA')).toBeInTheDocument();
		});

		it('should not render links when neither demo nor source', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="en" />);
			const links = screen.getAllByTestId('pdf-link');
			const sourceLinks = links.filter((l) => l.textContent === 'Source Code');
			expect(sourceLinks).toHaveLength(1);
		});
	});

	describe('Indonesian language', () => {
		it('should render Technologies label in Indonesian', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="id" />);
			expect(screen.getAllByText(/Teknologi:/)).toHaveLength(2);
		});

		it('should render Live Demo link in Indonesian', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="id" />);
			expect(screen.getAllByText('Lihat Demo')).toHaveLength(2);
		});

		it('should render Source Code link in Indonesian', () => {
			render(<ProjectsSection portfolio={mockPortfolio} language="id" />);
			expect(screen.getByText('Lihat Source Code')).toBeInTheDocument();
		});
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd apps/api && bun vitest run tests/templates/pdf/projects-section.test.tsx
```

Expected: FAIL — `@/templates/pdf/sections/projects` not found.

- [ ] **Step 3: Implement projects section**

Create `apps/api/src/templates/pdf/sections/projects.tsx`:

```tsx
import type { LangCode, PortfolioData } from '@irfnd/data';
import { resolveParagraph } from '@irfnd/data';
import { Link, Text, View } from '@react-pdf/renderer';
import * as React from 'react';

import { styles } from '@/templates/pdf/styles';

interface ProjectsSectionProps {
	portfolio: PortfolioData;
	language: LangCode;
}

export function ProjectsSection({ portfolio, language }: ProjectsSectionProps) {
	const techLabel = language === 'en' ? 'Technologies' : 'Teknologi';
	const demoLabel = language === 'en' ? 'Live Demo' : 'Lihat Demo';
	const sourceLabel = language === 'en' ? 'Source Code' : 'Lihat Source Code';

	const selected = portfolio.projects.filter((p) => p.isSelected);

	return (
		<View style={{ gap: 10 }}>
			<View style={{ gap: 4 }}>
				<Text style={[styles.bold, { fontSize: 12 }]}>{portfolio.title.toUpperCase()}</Text>
				<View style={styles.dividerH} />
			</View>

			{selected.map((project, i) => (
				<View key={i} style={{ gap: 2 }} wrap={false}>
					{project.demo ? (
						<Link src={project.demo} style={[styles.text, styles.bold, styles.link]}>
							{project.name.toUpperCase()}
						</Link>
					) : (
						<Text style={[styles.text, styles.bold]}>{project.name.toUpperCase()}</Text>
					)}

					{project.summary.length > 0 && (
						<Text style={[styles.text, { textAlign: 'justify' }]}>
							{resolveParagraph(project.summary[0])}
						</Text>
					)}

					{project.stacks.length > 0 && (
						<View style={{ flexDirection: 'row', gap: 3 }}>
							<Text style={styles.text}>{techLabel}: </Text>
							<Text style={[styles.text, styles.italic]}>
								{[...project.stacks].sort((a, b) => a.localeCompare(b)).join(', ')}
							</Text>
						</View>
					)}

					{(project.demo || project.source) && (
						<View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
							{project.demo && (
								<Link src={project.demo} style={[styles.text, { color: '#000' }]}>
									{demoLabel}
								</Link>
							)}
							{project.demo && project.source && <View style={styles.dividerV} />}
							{project.source && (
								<Link src={project.source} style={[styles.text, { color: '#000' }]}>
									{sourceLabel}
								</Link>
							)}
						</View>
					)}
				</View>
			))}
		</View>
	);
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd apps/api && bun vitest run tests/templates/pdf/projects-section.test.tsx
```

Expected: All 15 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/templates/pdf/sections/projects.tsx apps/api/tests/templates/pdf/projects-section.test.tsx
git commit -m "feat(api): add PDF projects section component"
```

---

## Task 8: ResumePDF Root Component and Barrel Export

**Files:**
- Create: `apps/api/src/templates/pdf/resume.tsx`
- Create: `apps/api/src/templates/pdf/index.ts`
- Create: `apps/api/tests/templates/pdf/resume.test.tsx`

- [ ] **Step 1: Write the ResumePDF test**

Create `apps/api/tests/templates/pdf/resume.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-pdf/renderer', () => ({
	Document: ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-document">{children}</div>,
	Page: ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-page">{children}</div>,
	View: ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-view">{children}</div>,
	Text: ({ children }: { children: React.ReactNode }) => <span data-testid="pdf-text">{children}</span>,
	Link: ({ children }: { children: React.ReactNode }) => <a data-testid="pdf-link">{children}</a>,
	Font: { registerHyphenationCallback: vi.fn() },
	StyleSheet: { create: (s: Record<string, unknown>) => s },
}));

vi.mock('@/templates/pdf/styles', () => ({
	styles: {
		page: {},
		text: {},
		bold: {},
		italic: {},
		link: {},
		dividerH: {},
		dividerV: {},
	},
}));

import { render, screen } from '@testing-library/react';
import type {
	ContactData,
	EducationData,
	ExperienceData,
	LangCode,
	PortfolioData,
	ProfileData,
	TechnologyData,
} from '@irfnd/data';

import { ResumePDF, type ResumePDFProps } from '@/templates/pdf/resume';

describe('ResumePDF', () => {
	const mockProps: ResumePDFProps = {
		profile: {
			firstName: 'John',
			lastName: 'Doe',
			role: 'Software Engineer',
			photo: { url: '', alt: '' },
			description: '',
		},
		contact: {
			items: [
				{ type: 'location', label: 'Jakarta', url: '', icon: '', showInResume: true },
				{ type: 'contact', label: 'Email', url: 'mailto:john@example.com', icon: 'tabler:mail', showInResume: true },
			],
		},
		experience: {
			title: 'Experience',
			jobs: [],
		},
		education: {
			title: 'Education',
			educations: [],
		},
		technology: {
			title: 'Skills',
			stacks: {},
		},
		portfolio: {
			header: 'Portfolio',
			title: 'Projects',
			subtitle: '',
			projects: [],
		},
		language: 'en' as LangCode,
	};

	it('should render Document component', () => {
		render(<ResumePDF {...mockProps} />);
		expect(screen.getByTestId('pdf-document')).toBeInTheDocument();
	});

	it('should render Page component', () => {
		render(<ResumePDF {...mockProps} />);
		expect(screen.getByTestId('pdf-page')).toBeInTheDocument();
	});

	it('should render all sections', () => {
		render(<ResumePDF {...mockProps} />);
		expect(screen.getByText('JOHN DOE')).toBeInTheDocument();
		expect(screen.getByText('EXPERIENCE')).toBeInTheDocument();
		expect(screen.getByText('EDUCATION')).toBeInTheDocument();
		expect(screen.getByText('SKILLS')).toBeInTheDocument();
		expect(screen.getByText('PROJECTS')).toBeInTheDocument();
	});

	it('should pass language prop to ProjectsSection', () => {
		render(<ResumePDF {...mockProps} language="id" />);
		expect(screen.getByText('PROJECTS')).toBeInTheDocument();
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd apps/api && bun vitest run tests/templates/pdf/resume.test.tsx
```

Expected: FAIL — `@/templates/pdf/resume` not found.

- [ ] **Step 3: Implement ResumePDF component**

Create `apps/api/src/templates/pdf/resume.tsx`:

```tsx
import type {
	ContactData,
	EducationData,
	ExperienceData,
	LangCode,
	PortfolioData,
	ProfileData,
	TechnologyData,
} from '@irfnd/data';
import { Document, Page } from '@react-pdf/renderer';

import { EducationSection } from '@/templates/pdf/sections/education';
import { ExperienceSection } from '@/templates/pdf/sections/experience';
import { HeaderSection } from '@/templates/pdf/sections/header';
import { ProjectsSection } from '@/templates/pdf/sections/projects';
import { SkillsSection } from '@/templates/pdf/sections/skills';
import { styles } from '@/templates/pdf/styles';

export interface ResumePDFProps {
	profile: ProfileData;
	contact: ContactData;
	experience: ExperienceData;
	education: EducationData;
	technology: TechnologyData;
	portfolio: PortfolioData;
	language: LangCode;
}

export function ResumePDF(props: ResumePDFProps) {
	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<HeaderSection profile={props.profile} contact={props.contact} />
				<ExperienceSection experience={props.experience} />
				<EducationSection education={props.education} />
				<SkillsSection technology={props.technology} />
				<ProjectsSection portfolio={props.portfolio} language={props.language} />
			</Page>
		</Document>
	);
}
```

- [ ] **Step 4: Create barrel export**

Create `apps/api/src/templates/pdf/index.ts`:

```ts
export { ResumePDF, type ResumePDFProps } from './resume';
```

- [ ] **Step 5: Run test to verify it passes**

```bash
cd apps/api && bun vitest run tests/templates/pdf/resume.test.tsx
```

Expected: All 4 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/api/src/templates/pdf/resume.tsx apps/api/src/templates/pdf/index.ts apps/api/tests/templates/pdf/resume.test.tsx
git commit -m "feat(api): add ResumePDF root component and barrel export"
```

---

## Task 9: Update Resume Route and Delete Old Template

**Files:**
- Modify: `apps/api/src/routes/resume.ts`
- Delete: `apps/api/src/templates/resume.ts`
- Modify: `apps/api/tests/routes/resume.test.ts`
- Delete: `apps/api/tests/templates/resume.test.ts`

- [ ] **Step 1: Update the route test to mock `@react-pdf/renderer` instead of Puppeteer**

Replace the contents of `apps/api/tests/routes/resume.test.ts`:

```ts
import { Hono } from 'hono';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@react-pdf/renderer', () => ({
	renderToBuffer: vi.fn().mockResolvedValue(Buffer.from('fake-pdf-content')),
	Document: vi.fn(),
	Page: vi.fn(),
	View: vi.fn(),
	Text: vi.fn(),
	Link: vi.fn(),
	Font: { registerHyphenationCallback: vi.fn() },
	StyleSheet: { create: (s: Record<string, unknown>) => s },
}));

const { resumeRoute } = await import('@/routes/resume');

describe('Resume Route', () => {
	let app: Hono;

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		app = new Hono();
		app.route('/resume', resumeRoute);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns PDF for valid English request', async () => {
		const res = await app.request('/resume?lang=en');
		expect(res.status).toBe(200);
		expect(res.headers.get('content-type')).toBe('application/pdf');
		expect(res.headers.get('content-disposition')).toContain('Resume_Irfandi_EN.pdf');
	});

	it('returns PDF for valid Indonesian request', async () => {
		const res = await app.request('/resume?lang=id');
		expect(res.status).toBe(200);
		expect(res.headers.get('content-type')).toBe('application/pdf');
		expect(res.headers.get('content-disposition')).toContain('Resume_Irfandi_ID.pdf');
	});

	it('defaults to English when no lang provided', async () => {
		const res = await app.request('/resume');
		expect(res.status).toBe(200);
		expect(res.headers.get('content-disposition')).toContain('EN.pdf');
	});

	it('returns 400 for invalid language', async () => {
		const res = await app.request('/resume?lang=fr');
		expect(res.status).toBe(400);
		const body = (await res.json()) as { error: string };
		expect(body.error).toContain('Invalid language');
	});

	it('returns 500 when renderToBuffer fails', async () => {
		const renderer = await import('@react-pdf/renderer');
		vi.mocked(renderer.renderToBuffer).mockRejectedValueOnce(new Error('Render failed'));

		const res = await app.request('/resume?lang=en');
		expect(res.status).toBe(500);
		const body = (await res.json()) as { error: string };
		expect(body.error).toContain('Failed to generate');
	});
});
```

- [ ] **Step 2: Update the resume route**

Replace the contents of `apps/api/src/routes/resume.ts`:

```ts
import type { LangCode } from '@irfnd/data';
import { contact, education, experience, getByLang, portfolio, profile, technology } from '@irfnd/data';
import { Hono } from 'hono';
import { createElement } from 'react';

import { ResumePDF } from '@/templates/pdf';

export const resumeRoute = new Hono();

resumeRoute.get('/', async (c) => {
	const lang = c.req.query('lang') || 'en';

	if (lang !== 'en' && lang !== 'id') {
		return c.json({ error: 'Invalid language. Use "en" or "id".' }, 400);
	}

	try {
		const l = lang as LangCode;
		const { renderToBuffer } = await import('@react-pdf/renderer');
		const buffer = await renderToBuffer(
			createElement(ResumePDF, {
				profile: getByLang(profile, l),
				contact: getByLang(contact, l),
				experience: getByLang(experience, l),
				education: getByLang(education, l),
				technology: getByLang(technology, l),
				portfolio: getByLang(portfolio, l),
				language: l,
			}),
		);

		return new Response(buffer, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="Resume_Irfandi_${lang.toUpperCase()}.pdf"`,
			},
		});
	} catch (err) {
		console.error('Resume generation error:', err);
		return c.json({ error: 'Failed to generate resume' }, 500);
	}
});
```

- [ ] **Step 3: Delete the old HTML template and its test**

```bash
rm apps/api/src/templates/resume.ts
rm apps/api/tests/templates/resume.test.ts
```

- [ ] **Step 4: Run the full test suite**

```bash
cd apps/api && bun vitest run
```

Expected: All tests pass — the old template tests are gone, the new PDF tests run, and the route test works with the new mock.

- [ ] **Step 5: Run coverage check**

```bash
cd apps/api && bun run test:coverage
```

Expected: 100% coverage. The old `resume.ts` source file is gone so it won't affect coverage. The new `pdf/` files should all be covered by their tests.

- [ ] **Step 6: Commit**

```bash
git add -A apps/api/src/routes/resume.ts apps/api/src/templates/ apps/api/tests/
git commit -m "feat(api): migrate resume route from puppeteer to react-pdf"
```

---

## Task 10: Full Verification

**Files:** None (verification only)

- [ ] **Step 1: Run full monorepo test suite**

```bash
bun run test
```

Expected: All 3 workspaces pass (packages/data, apps/api, apps/web).

- [ ] **Step 2: Build the API**

```bash
cd apps/api && bun run build
```

Expected: Build succeeds.

- [ ] **Step 3: Build the web app**

```bash
cd apps/web && bun run build
```

Expected: Build succeeds.

- [ ] **Step 4: Run coverage for API**

```bash
cd apps/api && bun run test:coverage
```

Expected: 100% on all metrics.

- [ ] **Step 5: Manual smoke test (optional)**

Start the API and test the resume endpoint:

```bash
cd apps/api && bun run dev &
curl -o /tmp/test-resume.pdf http://localhost:3000/resume?lang=en
file /tmp/test-resume.pdf
```

Expected: `test-resume.pdf: PDF document, version 1.4` (or similar).

- [ ] **Step 6: Commit any remaining fixes if needed**
