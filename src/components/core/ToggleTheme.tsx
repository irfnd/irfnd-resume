import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/core/Theme';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { IconMoon, IconSun, IconSunMoon } from '@tabler/icons-react';

export default function ToggleTheme() {
	const { theme, setTheme } = useTheme();
	const { t } = useTranslation();

	const toggleTheme = () => (theme === 'dark' ? setTheme('light') : setTheme('dark'));

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant='primary'
						className='rounded-full'
						size='icon'
						aria-label={t('components.theme.tooltip')}
						onClick={toggleTheme}
					>
						{theme === 'dark' ? (
							<IconSun size={20} className='text-white' />
						) : theme === 'light' ? (
							<IconMoon size={20} className='text-stone-900' />
						) : (
							<IconSunMoon size={20} className='text-stone-900 dark:text-white' />
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>{t('components.theme.tooltip')}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
