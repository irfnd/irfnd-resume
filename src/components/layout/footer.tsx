import { useTranslation, useYear } from '@/hooks';

export function Footer() {
	const currentYear = useYear();
	const { footer, contact } = useTranslation();

	return (
		<footer className='border-t border-border/60 pt-8 flex flex-col items-center md:flex-row md:items-center justify-between gap-4'>
			<p className='text-xs text-muted-foreground/80'>
				{footer.copyright.replace('{year}', currentYear.toString())} {footer.builtWith}
			</p>

			<div className='flex gap-4'>
				{contact
					.filter((item) => item.showInFooter)
					.map((item) => (
						<a
							key={item.label}
							href={item.url}
							className='text-xs text-muted-foreground hover:text-blue-600 dark:hover:text-white transition-colors rounded-sm outline-none focus-visible:ring focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
						>
							{item.label}
						</a>
					))}
			</div>
		</footer>
	);
}
