import { useTheme } from '@/hooks';

import { IconMoon, IconSun } from '@tabler/icons-react';

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	return (
		<button
			className='p-2.5 rounded-full bg-background/80 border border-border/60 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 light-shadow dark:shadow-none ring-1 ring-transparent hover:ring-blue-100 dark:hover:ring-blue-900/20 backdrop-blur-md cursor-pointer outline-none focus-visible:ring focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500 focus-visible:border-blue-300 dark:focus-visible:border-blue-600'
			onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
		>
			<IconSun className='size-4 hidden dark:block' />
			<IconMoon className='size-4 block dark:hidden' />
		</button>
	);
}
