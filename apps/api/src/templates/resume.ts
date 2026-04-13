import { escapeHtml } from '@/utils';

interface ResumeData {
	name: string;
	contacts: string[];
	experience: {
		company: string;
		companyUrl: string | null;
		positions: {
			title: string;
			duration: string;
			location: string;
			points: string[];
		}[];
	}[];
	education: {
		institution: string;
		institutionUrl: string | null;
		degree: string;
		duration: string;
		location: string;
		points: string[];
	}[];
	skills: Record<string, string[]>;
	portfolios: {
		name: string;
		description: string;
		technologies: string[];
		demo: string | null;
		source: string | null;
	}[];
}

export function generateResumeHTML(data: ResumeData): string {
	const contactLine = data.contacts.map((c) => escapeHtml(c)).join('<span class="sep">|</span>');

	const experienceHtml = data.experience
		.map((job) => {
			const companyName = job.companyUrl
				? `<a href="${escapeHtml(job.companyUrl)}" class="company-link">${escapeHtml(job.company)}</a>`
				: `<span class="company-link">${escapeHtml(job.company)}</span>`;

			return job.positions
				.map(
					(pos, i) => `
		<div class="position">
			<div class="row">${i === 0 ? `<strong>${companyName}</strong>` : ''}<span class="right">${escapeHtml(pos.duration)}</span></div>
			<div class="row"><em>${escapeHtml(pos.title)}</em><span class="right"><em>${escapeHtml(pos.location)}</em></span></div>
			${pos.points.length > 0 ? `<ul>${pos.points.map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul>` : ''}
		</div>`,
				)
				.join('');
		})
		.join('');

	const educationHtml = data.education
		.map((edu) => {
			const instName = edu.institutionUrl
				? `<a href="${escapeHtml(edu.institutionUrl)}" class="company-link">${escapeHtml(edu.institution)}</a>`
				: `<span class="company-link">${escapeHtml(edu.institution)}</span>`;

			return `
		<div class="position">
			<div class="row"><strong>${instName}</strong><span class="right">${escapeHtml(edu.duration)}</span></div>
			<div class="row"><em>${escapeHtml(edu.degree)}</em><span class="right"><em>${escapeHtml(edu.location)}</em></span></div>
			${edu.points.length > 0 ? `<ul>${edu.points.map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul>` : ''}
		</div>`;
		})
		.join('');

	const skillsHtml = Object.entries(data.skills)
		.map(
			([category, items]) =>
				`<div class="skill-row"><strong>${escapeHtml(category)}:</strong> ${items.map((s) => escapeHtml(s)).join(', ')}</div>`,
		)
		.join('');

	const portfoliosHtml = data.portfolios
		.map((p) => {
			const links: string[] = [];
			if (p.demo) links.push(`<a href="${escapeHtml(p.demo)}" class="project-link">See Demo</a>`);
			if (p.source) links.push(`<a href="${escapeHtml(p.source)}" class="project-link">Source Code</a>`);

			return `
		<div class="project">
			<div class="project-name">${escapeHtml(p.name)}</div>
			<div class="project-desc">${escapeHtml(p.description)}</div>
			<div class="project-tech"><em>Technologies: ${p.technologies.map((t) => escapeHtml(t)).join(', ')}</em></div>
			${links.length > 0 ? `<div class="project-links">${links.join('  ')}</div>` : ''}
		</div>`;
		})
		.join('');

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 11px;
      line-height: 1.5;
      color: #000;
      padding: 40px 50px;
    }
    a { color: #000; text-decoration: none; }
    .header { text-align: center; margin-bottom: 10px; }
    .header h1 { font-size: 20px; font-weight: 700; letter-spacing: 1px; margin-bottom: 4px; text-transform: uppercase; }
    .contact-line { font-size: 10px; }
    .contact-line .sep { margin: 0 6px; }
    h2 {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #000;
      padding-bottom: 2px;
      margin: 14px 0 6px;
    }
    .position { margin-bottom: 6px; }
    .row { display: flex; justify-content: space-between; align-items: baseline; }
    .right { text-align: right; white-space: nowrap; }
    .company-link { font-weight: 700; text-transform: uppercase; }
    ul { padding-left: 16px; margin-top: 2px; }
    li { margin-bottom: 1px; }
    .skill-row { margin-bottom: 2px; }
    .skill-row strong { margin-right: 4px; }
    .project { margin-bottom: 8px; }
    .project-name { font-weight: 700; text-transform: uppercase; }
    .project-desc { margin: 2px 0; }
    .project-tech { margin: 2px 0; }
    .project-link { text-decoration: underline; margin-right: 12px; }
    .project-links { margin-top: 2px; }
    @page { size: A4; margin: 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${escapeHtml(data.name)}</h1>
    <div class="contact-line">${contactLine}</div>
  </div>

  <h2>Work Experience</h2>
  ${experienceHtml}

  <h2>Education</h2>
  ${educationHtml}

  <h2>Skills</h2>
  ${skillsHtml}

  <h2>Portfolio</h2>
  ${portfoliosHtml}
</body>
</html>`;
}

export type { ResumeData };
