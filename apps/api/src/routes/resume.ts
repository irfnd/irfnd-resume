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
