import useDate from '@/utils/hooks/useDate';
import { parseDate } from '@/utils/string.utils';
import { pdf } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';

import type { About } from '@/utils/types';

import CV from '@/components/templates/cv';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

export default function Footer() {
	const { t, i18n } = useTranslation();
	const date = useDate();

	const name: About['name'] = t('portfolio.about.name');
	const pdfProps: Record<string, any> = t('components.pdf', { returnObjects: true });

	const getPDF = async () => {
		try {
			const blobPdf = await pdf(<CV />).toBlob();
			const urlPdf = window.URL.createObjectURL(new Blob([blobPdf], { type: 'application/pdf' }));
			const link = document.createElement('a');
			link.download = `CV_${name}_${i18n.language.toUpperCase()}`;
			link.href = urlPdf;
			link.click();
			window.URL.revokeObjectURL(urlPdf);
			toast.success(pdfProps.toastMsg, { description: pdfProps.toastDesc });
		} catch (err: Error | any) {
			toast.error(err.message);
		}
	};

	return (
		<div className='flex flex-col sm:flex-row items-center sm:justify-between text-stone-600 dark:text-stone-400 gap-2 mt-10'>
			<p className='text-sm'>{parseDate(date.getTime(), i18n.language)}</p>
			<p
				className={cn([
					'cursor-pointer',
					'text-sm hover:dark:text-white hover:underline hover:underline-offset-4',
					'hover:decoration-2 hover:decoration-lime-600 hover:decoration-dotted',
				])}
				onClick={getPDF}
			>
				{pdfProps.text}
			</p>
		</div>
	);
}
