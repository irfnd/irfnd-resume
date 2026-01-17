import { useTranslation, useYear } from '@/hooks';

export function Footer() {
	const currentYear = useYear();
	const { footer, contact } = useTranslation();

	return (
		<footer className='border-t border-slate-200 dark:border-neutral-800/50 pt-8 flex flex-col items-center md:flex-row md:items-center justify-between gap-4'>
			<p className='text-xs text-slate-400 dark:text-neutral-600'>
				{footer.copyright.replace('{year}', currentYear.toString())} {footer.builtWith}
			</p>

			<div className='flex gap-4'>
				{contact.slice(2).map((item) => (
					<a
						key={item.label}
						href={item.url}
						className='text-xs text-slate-500 dark:text-neutral-600 hover:text-blue-600 dark:hover:text-white transition-colors rounded-sm outline-none focus-visible:ring focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900'
					>
						{item.label}
					</a>
				))}
			</div>
		</footer>
	);
}
