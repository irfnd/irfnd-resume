import { generateResumeHTML } from '@/templates/resume';
import type { ResumeData } from '@/templates/resume';
import { Hono } from 'hono';

function getResumeData(lang: string): ResumeData {
	return {
		name: 'Irfandi Iqbal Abimanyu',
		role: lang === 'id' ? 'Pengembang Full-Stack' : 'Full-Stack Developer',
		email: 'irfandiabimanyu@gmail.com',
		location: 'Jakarta, Indonesia',
		linkedin: 'linkedin.com/in/irfnd-iqbl',
		github: 'github.com/irfnd',
		summary:
			lang === 'id'
				? 'Pengembang full-stack berpengalaman dengan keahlian dalam React, TypeScript, dan Node.js.'
				: 'Experienced full-stack developer with expertise in React, TypeScript, and Node.js.',
		experience: [],
		education: [],
		skills: ['TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'Docker'],
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
