import ToggleLang from '@/components/core/ToggleLang';
import ToggleTheme from '@/components/core/ToggleTheme';
import GetCV from '@/components/core/GetCV';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex justify-center bg-stone-200 dark:bg-stone-950 min-h-screen sm:p-6'>
			<div className='relative flex flex-col w-full max-w-4xl'>
				<div className='absolute flex gap-2 justify-end top-3 right-3 sm:-top-2 sm:-right-2'>
					<ToggleLang />
					<GetCV />
					<ToggleTheme />
				</div>
				{children}
			</div>
		</div>
	);
}
