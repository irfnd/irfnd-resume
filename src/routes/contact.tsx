import { SlideUp, StaggerContainer, StaggerItem } from '@/components/ui';
import { useTranslation } from '@/hooks';
import { cn } from '@/utils/cn';
import * as tabler from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import * as React from 'react';

export const Route = createFileRoute('/contact')({
	component: ContactPage,
});

function ContactPage() {
	const { contactMe, contact } = useTranslation();
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [isSuccess, setIsSuccess] = React.useState(false);

	const directContact = React.useMemo(() => contact.filter((val) => val.showInContactPage), [contact]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));

		setIsSubmitting(false);
		setIsSuccess(true);

		// Reset success message after 5 seconds
		setTimeout(() => setIsSuccess(false), 5000);
		(e.target as HTMLFormElement).reset();
	};

	return (
		<SlideUp as='div' delay={0.5} className='grid mb-8 gap-8'>
			<div className='flex items-center'>
				<h2 className='text-lg font-semibold text-foreground shrink-0 tracking-tight'>{contactMe.header}</h2>
				<div className='h-px bg-border w-full ml-6'></div>
			</div>

			<p className='text-base text-muted-foreground'>{contactMe.description}</p>

			<div className='flex flex-col gap-6 glass-card bg-white/60 dark:bg-white/5 border border-white/50 dark:border-white/5 rounded-3xl p-6 md:p-8 light-shadow dark:shadow-none relative'>
				<h3 className='text-lg font-bold text-foreground'>{contactMe.formTitle}</h3>

				<form onSubmit={handleSubmit} className='flex flex-col gap-6'>
					{isSuccess && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className='absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md p-8 text-center space-y-4 rounded-3xl'
						>
							<div className='h-16 w-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center'>
								<tabler.IconCheck size={32} />
							</div>
							<h4 className='text-lg font-bold text-foreground'>{contactMe.successMessage}</h4>
							<button
								type='button'
								onClick={() => setIsSuccess(false)}
								className='text-sm font-medium text-primary hover:underline'
							>
								{contactMe.sendAnotherMessage}
							</button>
						</motion.div>
					)}

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{contactMe.form.map((field) => {
							const isTextarea = field.type === 'textarea';

							return (
								<div className={cn('flex flex-col gap-2', isTextarea && 'md:col-span-2')} key={field.name}>
									<label htmlFor={field.name} className='text-sm font-semibold text-foreground cursor-pointer w-fit'>
										{field.label}
									</label>

									{isTextarea ? (
										<textarea
											id={field.name}
											name={field.name}
											rows={5}
											placeholder={field.placeholder}
											className='w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none placeholder:text-muted-foreground/40 text-base text-foreground'
											required
										/>
									) : (
										<input
											id={field.name}
											name={field.name}
											type={field.type}
											placeholder={field.placeholder}
											className='w-full h-12 px-4 rounded-xl bg-background/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/40 text-base text-foreground'
											required
										/>
									)}
								</div>
							);
						})}
					</div>

					<button
						type='submit'
						disabled={isSubmitting}
						className='w-full lg:w-auto lg:ml-auto h-12 px-6 bg-primary text-white text-base font-semibold rounded-xl shadow-none hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group'
					>
						{isSubmitting ? <tabler.IconLoader2 size={20} /> : contactMe.submitButton}
					</button>
				</form>

				<div className='h-px bg-border w-full'></div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='flex flex-col gap-6'>
						<h2 className='text-lg font-semibold text-foreground'>{contactMe.reachMeDirectly}</h2>
						<StaggerContainer className='flex flex-col gap-3'>
							{directContact.map((item) => (
								<StaggerItem key={item.label}>
									<a
										href={item.url}
										target='_blank'
										rel='noopener noreferrer'
										className='group flex w-fit items-center gap-2 text-xs text-muted-foreground hover:text-blue-600 dark:hover:text-white transition-colors rounded-sm outline-none focus-visible:ring focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
									>
										<item.icon className='size-3.5 text-muted-foreground/70 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' />
										{item.label}
									</a>
								</StaggerItem>
							))}
						</StaggerContainer>
					</div>

					<div className='w-full h-60 rounded-xl overflow-hidden border border-border'>
						<iframe
							src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253840.65295081857!2d106.68942954335938!3d-6.229386699999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2sus!4v1707600000000!5m2!1sen!2sus'
							width='100%'
							height='100%'
							style={{ border: 0 }}
							allowFullScreen
							loading='lazy'
							referrerPolicy='no-referrer-when-downgrade'
							title='Location Map'
						/>
					</div>
				</div>
			</div>
		</SlideUp>
	);
}
