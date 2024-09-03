import Avatar from '@/components/sections/header/Avatar';
import Contact from '@/components/sections/header/Contact';
import Name from '@/components/sections/header/Name';
import { cn } from '@/utils/cn';

export default function Header() {
	return (
		<div className='bg-transparent dark:bg-stone-900 dark:pb-12 rounded-t-3xl'>
			<div
				className={cn([
					'flex flex-col sm:flex-row',
					'bg-stone-900 dark:bg-stone-950',
					'items-center justify-center sm:justify-between',
					'w-full py-20 sm:py-10 px-6 sm:px-10 gap-8',
					'sm:rounded-3xl shadow-xl dark:shadow-lg dark:hover:shadow-lime-400',
					'dark:border-b-2 dark:sm:border-2 dark:border-lime-400',
					'transition-all delay-50',
				])}
			>
				<Avatar />
				<div className='flex flex-col items-center sm:items-end gap-3'>
					<Name />
					<Contact />
				</div>
			</div>
		</div>
	);
}
