import type { ResumeData } from '@/templates/resume';
import { generateResumeHTML } from '@/templates/resume';
import type { LangCode } from '@irfnd/data';
import { contact, education, experience, getByLang, profile, technology } from '@irfnd/data';
import { Hono } from 'hono';

function getResumeData(lang: string): ResumeData {
	const l = (lang === 'id' ? 'id' : 'en') as LangCode;
	const p = getByLang(profile, l);
	const exp = getByLang(experience, l);
	const edu = getByLang(education, l);
	const tech = getByLang(technology, l);
	const c = getByLang(contact, l);

	return {
		name: `${p.firstName} ${p.lastName}`,
		role: p.role,
		/* v8 ignore start -- @preserve */
		email: c.items.find((i) => i.icon === 'tabler:mail')?.label ?? '',
		location: c.items.find((i) => i.type === 'location')?.label ?? '',
		linkedin: c.items.find((i) => i.icon === 'tabler:brand-linkedin')?.url ?? '',
		github: c.items.find((i) => i.icon === 'tabler:brand-github')?.url ?? '',
		/* v8 ignore stop */
		summary: p.description,
		experience: exp.jobs.map((job) => ({
			company: job.company,
			position: job.mainPosition,
			duration: job.duration.join(' - '),
			location: job.location,
			points: job.descriptions.flatMap((d) => [...d.summary, ...d.points].map((pt) => pt.value)),
		})),
		education: edu.educations.map((e) => ({
			institution: e.institution,
			degree: `${e.degree} — ${e.fieldOfStudy}`,
			duration: e.duration.join(' - '),
			location: e.location,
		})),
		skills: Object.values(tech.stacks).flat(),
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
