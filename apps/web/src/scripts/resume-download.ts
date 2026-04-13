function initResumeDownload() {
	document.addEventListener('click', async (e) => {
		const btn = (e.target as HTMLElement).closest('[data-resume-download]');
		if (!btn) return;

		const lang = btn.getAttribute('data-resume-lang') || 'en';
		const apiUrl = btn.getAttribute('data-resume-api') || 'http://localhost:3000';
		const apiKey = btn.getAttribute('data-resume-key') || '';

		// Prevent double-click
		if (btn.hasAttribute('data-downloading')) return;
		btn.setAttribute('data-downloading', '');

		const loader = btn.querySelector('[data-resume-loader]');
		const icon = btn.querySelector('[data-resume-icon]');
		const label = btn.querySelector('[data-resume-label]');
		const originalLabel = label?.textContent || '';

		loader?.classList.remove('hidden');
		icon?.classList.add('hidden');
		if (label) label.textContent = 'Generating...';

		try {
			const response = await fetch(`${apiUrl}/resume?lang=${lang}`, {
				headers: { 'X-API-Key': apiKey },
			});

			if (!response.ok) {
				window.showToast('Failed to generate resume', 'error');
				return;
			}

			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `Resume_${lang.toUpperCase()}.pdf`;
			link.click();
			URL.revokeObjectURL(url);

			window.showToast('Resume downloaded!', 'success');
		} catch {
			window.showToast('Failed to download resume', 'error');
		} finally {
			loader?.classList.add('hidden');
			icon?.classList.remove('hidden');
			if (label) label.textContent = originalLabel;
			btn.removeAttribute('data-downloading');
		}
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initResumeDownload);
} else {
	initResumeDownload();
}

export { initResumeDownload };
