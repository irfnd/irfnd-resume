import { useI18n, useTranslation } from '@/hooks';
import * as React from 'react';

export function useResumeDownload() {
	const { language } = useI18n();
	const t = useTranslation();
	const [loading, setLoading] = React.useState(false);

	const download = async () => {
		if (loading) return;
		setLoading(true);

		try {
			const [{ pdf }, { ResumePDF }] = await Promise.all([import('@react-pdf/renderer'), import('@/components/pdf/resume')]);
			const blob = await pdf(React.createElement(ResumePDF, { ...t, language })).toBlob();
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `Resume_${t.profile.firstName}_${t.profile.lastName}_${language.toUpperCase()}.pdf`;
			link.click();
			URL.revokeObjectURL(url);
		} finally {
			setLoading(false);
		}
	};

	return { download, loading };
}
