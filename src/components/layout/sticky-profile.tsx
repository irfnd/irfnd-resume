import { useTranslation } from '@/hooks';

import { FadeIn } from '@/components/ui';

export function Profile() {
	const { profile, contact } = useTranslation();

	return (
		<FadeIn className='relative md:flex md:items-start md:gap-14 lg:mb-8 lg:block lg:gap-0' delay={0.2}>
			<div className='relative size-24 mb-6 md:size-42 md:mb-0 lg:size-32 lg:mb-6 group shrink-0'>
				<div className='absolute -inset-1 bg-blue-600 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-700' />
				<img
					src={profile.photo.url}
					alt={profile.photo.alt}
					className='relative size-full object-cover rounded-full border-2 border-background shadow-lg dark:shadow-2xl grayscale group-hover:grayscale-0 transition duration-500'
				/>
			</div>

			<div className='md:flex-1 lg:flex-none'>
				<h1 className='text-3xl font-thin text-foreground tracking-tight leading-tight mb-2'>
					<span className='font-bold'>Irfandi</span> Iqbal Abimanyu
				</h1>

				<div className='flex items-center gap-2 mb-6'>
					<span className='relative flex size-3'>
						<span className='animate-ping absolute inline-flex size-full rounded-full bg-blue-500 opacity-75'></span>
						<span className='relative inline-flex rounded-full size-3 bg-blue-600 dark:bg-blue-500'></span>
					</span>
					<p className='text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wide uppercase bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-500/20'>
						{profile.role}
					</p>
				</div>

				<p className='text-sm leading-relaxed text-muted-foreground mb-6 max-w-sm font-normal'>{profile.description}</p>

				<div className='flex flex-wrap max-w-sm gap-x-4 gap-y-3'>
					{contact.map((item) => (
						<a
							key={item.label}
							href={item.url}
							target='_blank'
							rel='noopener noreferrer'
							className='group flex items-center gap-2 text-xs text-muted-foreground hover:text-blue-600 dark:hover:text-white transition-colors rounded-sm outline-none focus-visible:ring focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
						>
							<item.icon className='size-3.5 text-muted-foreground/70 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' />
							{item.label}
						</a>
					))}
				</div>
			</div>
		</FadeIn>
	);
}
