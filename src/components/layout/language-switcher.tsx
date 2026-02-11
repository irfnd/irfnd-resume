import { useI18n } from '@/hooks';
import { languages } from '@/i18n';
import type { Language } from '@/types';

import { Menu } from '@base-ui/react/menu';
import { IconCheck, IconSelector } from '@tabler/icons-react';

export function LanguageSwitcher() {
	const { language, setLanguage } = useI18n();

	const currentLang = languages.find((l) => l.code === language);

	return (
		<Menu.Root>
			<Menu.Trigger
				className='flex items-center gap-2 p-2.5 rounded-full bg-background/80 border border-border/60 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 light-shadow dark:shadow-none ring ring-transparent hover:ring-blue-100 dark:hover:ring-blue-900/20 backdrop-blur-md cursor-pointer outline-none focus-visible:ring focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500 focus-visible:border-blue-300 dark:focus-visible:border-blue-600'
				aria-label='Change language'
			>
				<span className='leading-0 font-medium'>{currentLang?.flag}</span>
				<IconSelector className='size-4' />
			</Menu.Trigger>

			<Menu.Portal>
				<Menu.Positioner align='end' sideOffset={8}>
					<Menu.Popup className='w-42 p-2 rounded-2xl bg-popover/95 border border-border/60 light-shadow dark:shadow-lg backdrop-blur-md z-65 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2'>
						<Menu.RadioGroup
							className='flex flex-col gap-1'
							value={language}
							onValueChange={(value) => setLanguage(value as Language)}
						>
							{languages.map((lang) => (
								<Menu.RadioItem
									key={lang.code}
									value={lang.code}
									className='relative rounded-xl px-4 py-2 text-sm flex items-center gap-2 transition-colors cursor-pointer outline-none data-highlighted:bg-muted data-highlighted:text-foreground data-checked:text-blue-600 dark:data-checked:[&_svg]:text-blue-400 dark:data-checked:text-foreground data-checked:bg-blue-50 dark:data-checked:bg-blue-500/10 text-muted-foreground'
								>
									<span>{lang.flag}</span>
									<span className='flex-1'>{lang.label}</span>
									<Menu.RadioItemIndicator>
										<IconCheck className='size-4' />
									</Menu.RadioItemIndicator>
								</Menu.RadioItem>
							))}
						</Menu.RadioGroup>
					</Menu.Popup>
				</Menu.Positioner>
			</Menu.Portal>
		</Menu.Root>
	);
}
