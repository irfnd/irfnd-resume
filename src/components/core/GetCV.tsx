import { useTranslation } from 'react-i18next';
import { pdf } from '@react-pdf/renderer';

import type { About } from '@/utils/types';

import { IconDownload } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import CV from '@/components/templates/cv';

export default function GetCV() {
	const { t, i18n } = useTranslation();

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
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant='primary' className='rounded-full' size='icon' aria-label='Download CV' onClick={getPDF}>
						<IconDownload size={20} className='text-stone-900 dark:text-white' />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>{pdfProps.btn}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
