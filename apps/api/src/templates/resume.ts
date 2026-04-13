interface ResumeData {
	name: string;
	role: string;
	email: string;
	location: string;
	linkedin: string;
	github: string;
	summary: string;
	experience: {
		company: string;
		position: string;
		duration: string;
		location: string;
		points: string[];
	}[];
	education: {
		institution: string;
		degree: string;
		duration: string;
		location: string;
	}[];
	skills: string[];
}

export function generateResumeHTML(data: ResumeData): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 11px;
      line-height: 1.5;
      color: #1a1a1a;
      padding: 40px 50px;
    }
    h1 { font-size: 22px; font-weight: 700; color: #111; margin-bottom: 2px; }
    h2 {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #2563eb;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 4px;
      margin: 16px 0 8px;
    }
    h3 { font-size: 12px; font-weight: 600; }
    .header { text-align: center; margin-bottom: 16px; }
    .role { font-size: 14px; color: #4b5563; margin-bottom: 6px; }
    .contact-info { font-size: 10px; color: #6b7280; }
    .contact-info span { margin: 0 6px; }
    .job { margin-bottom: 12px; }
    .job-header { display: flex; justify-content: space-between; align-items: baseline; }
    .job-meta { font-size: 10px; color: #6b7280; }
    ul { padding-left: 18px; margin-top: 4px; }
    li { margin-bottom: 2px; }
    .skills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
    .skill-tag {
      background: #eff6ff;
      color: #2563eb;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
    }
    .edu { margin-bottom: 8px; }
    .edu-header { display: flex; justify-content: space-between; }
    .summary { margin-top: 6px; color: #374151; }
    @page { size: A4; margin: 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${data.name}</h1>
    <div class="role">${data.role}</div>
    <div class="contact-info">
      <span>${data.email}</span>
      <span>|</span>
      <span>${data.location}</span>
      <span>|</span>
      <span>${data.linkedin}</span>
      <span>|</span>
      <span>${data.github}</span>
    </div>
  </div>

  ${data.summary ? `<h2>Summary</h2><p class="summary">${data.summary}</p>` : ''}

  <h2>Experience</h2>
  ${data.experience
		.map(
			(job) => `
    <div class="job">
      <div class="job-header">
        <h3>${job.position} — ${job.company}</h3>
        <span class="job-meta">${job.duration}</span>
      </div>
      <div class="job-meta">${job.location}</div>
      <ul>
        ${job.points.map((p) => `<li>${p}</li>`).join('')}
      </ul>
    </div>
  `,
		)
		.join('')}

  <h2>Education</h2>
  ${data.education
		.map(
			(edu) => `
    <div class="edu">
      <div class="edu-header">
        <h3>${edu.degree} — ${edu.institution}</h3>
        <span class="job-meta">${edu.duration}</span>
      </div>
      <div class="job-meta">${edu.location}</div>
    </div>
  `,
		)
		.join('')}

  <h2>Skills</h2>
  <div class="skills">
    ${data.skills.map((s) => `<span class="skill-tag">${s}</span>`).join('')}
  </div>
</body>
</html>`;
}

export type { ResumeData };
