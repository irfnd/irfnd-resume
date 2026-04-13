import type { ResumeData } from '@/templates/resume';
import { generateResumeHTML } from '@/templates/resume';
import type { LangCode } from '@irfnd/data';
import {
	contact,
	education,
	experience,
	getByLang,
	portfolio,
	profile,
	resolveParagraph,
	technology,
} from '@irfnd/data';
import { Hono } from 'hono';

function getResumeData(lang: string): ResumeData {
	const l = (lang === 'id' ? 'id' : 'en') as LangCode;
	const p = getByLang(profile, l);
	const exp = getByLang(experience, l);
	const edu = getByLang(education, l);
	const tech = getByLang(technology, l);
	const c = getByLang(contact, l);
	const port = getByLang(portfolio, l);

	return {
		name: `${p.firstName} ${p.lastName}`,
		/* v8 ignore start -- @preserve */
		contacts: c.items
			.filter((i) => i.showInResume)
			.map((i) =>
				i.type === 'location' || i.icon === 'tabler:mail'
					? i.label
					: i.url.replace(/^https?:\/\//, '').replace(/^mailto:/, '').replace(/\/$/, ''),
			)
			.filter(Boolean),
		/* v8 ignore stop */
		experience: exp.jobs.map((job) => ({
			company: job.company,
			companyUrl: job.link,
			positions: job.descriptions.map((d) => ({
				title: d.position,
				duration: d.duration ? d.duration.join(' - ') : job.duration.join(' - '),
				location: job.location,
				points: [...d.summary, ...d.points].map((pt) => resolveParagraph(pt)),
			})),
		})),
		education: edu.educations.map((e) => ({
			institution: e.institution,
			institutionUrl: e.link,
			degree: `${e.degree} — ${e.fieldOfStudy}`,
			duration: e.duration.join(' - '),
			location: e.location,
			points: [...e.summary, ...e.points].map((pt) => resolveParagraph(pt)),
		})),
		skills: tech.stacks,
		portfolios: port.projects.filter((proj) => proj.isSelected).map((proj) => ({
			name: proj.name,
			description: proj.summary.map((s) => resolveParagraph(s)).join(' '),
			technologies: proj.stacks,
			demo: proj.demo,
			source: proj.source,
		})),
	};
}

export const resumeRoute = new Hono();

resumeRoute.get('/', async (c) => {
	const lang = c.req.query('lang') || 'en';

	if (lang !== 'en' && lang !== 'id') {
		return c.json({ error: 'Invalid language. Use "en" or "id".' }, 400);
	}

	try {
		const puppeteer = await import('puppeteer');
		const browser = await puppeteer.default.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});

		const page = await browser.newPage();
		const html = generateResumeHTML(getResumeData(lang));
		await page.setContent(html, { waitUntil: 'networkidle0' });

		const pdf = await page.pdf({
			format: 'A4',
			printBackground: true,
			margin: { top: '0', bottom: '0', left: '0', right: '0' },
		});

		await browser.close();

		return new Response(pdf, {
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
