import { cn } from '@/utils/cn';
import Layout from '@/components/core/Layout';
import About from '@/components/sections/about';
import Educations from '@/components/sections/educations';
import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import Projects from '@/components/sections/projects';
import Skills from '@/components/sections/skills';
import Works from '@/components/sections/works';

export default function App() {
	return (
		<Layout>
			<div className='flex flex-col sm:gap-6 dark:gap-0'>
				<Header />
				<div
					className={cn([
						'flex flex-col',
						'bg-white dark:bg-stone-900',
						'w-full h-full py-12 dark:pt-0 dark:pb-12 px-6 sm:px-10 gap-10',
						'sm:rounded-3xl dark:sm:rounded-t-none dark:sm:rounded-b-3xl shadow-xl dark:shadow-none',
					])}
				>
					<About />
					<Works />
					<Educations />
					<Skills />
					<Projects />
					<Footer />
				</div>
			</div>
		</Layout>
	);
}
