import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function ToggleLang() {
	const { t, i18n } = useTranslation();

	const toggleLang = () => (i18n.language === 'en' ? i18n.changeLanguage('id') : i18n.changeLanguage('en'));

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant='primary'
						className='rounded-full text-stone-900 dark:text-white'
						size='icon'
						aria-label={t('components.lang.tooltip')}
						onClick={toggleLang}
					>
						{i18n.language === 'en' ? 'ID' : 'EN'}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>{t('components.lang.tooltip')}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
