import { SlideUp, StaggerContainer, StaggerItem, useToast } from '@/components/ui';
import { useLanguage, useTranslation } from '@/hooks';
import type { IContactMe, IContactValidation, IFormField } from '@/types';
import { cn } from '@/utils/cn';
import { createContactSchema, type ContactFormData } from '@irfnd/schemas';
import { IconCheck, IconLoader2 } from '@tabler/icons-react';
import { useForm } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import * as React from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_API_KEY || '';

export const Route = createFileRoute('/contact')({
	component: ContactPage,
});

const fieldMap: Record<string, keyof ContactFormData> = {
	fullName: 'fullName',
	email: 'email',
	telephone: 'telephone',
	subject: 'subject',
	message: 'message',
};

interface ContactFormProps {
	formFields: IFormField[];
	validation: IContactValidation;
	contactMe: IContactMe;
}

function ContactForm({ formFields, validation, contactMe }: ContactFormProps) {
	const { addToast } = useToast();
	const [isSuccess, setIsSuccess] = React.useState(false);
	const successTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

	const contactSchema = React.useMemo(() => createContactSchema(validation), [validation]);

	React.useEffect(() => {
		return () => {
			if (successTimer.current) clearTimeout(successTimer.current);
		};
	}, []);

	const form = useForm({
		defaultValues: {
			fullName: '',
			email: '',
			telephone: '',
			subject: '',
			message: '',
		} as ContactFormData,
		validators: {
			onChange: contactSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				const response = await fetch(`${API_URL}/contact`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-API-Key': API_KEY,
					},
					body: JSON.stringify(value),
				});

				if (response.status === 429) {
					addToast(contactMe.errors.rateLimited, 'error');
					return;
				}

				if (response.status === 400) {
					addToast(contactMe.errors.validationError, 'error');
					return;
				}

				if (!response.ok) {
					addToast(contactMe.errors.serverError, 'error');
					return;
				}

				setIsSuccess(true);
				form.reset();

				if (successTimer.current) clearTimeout(successTimer.current);
				successTimer.current = setTimeout(() => setIsSuccess(false), 5000);
			} catch {
				addToast(contactMe.errors.networkError, 'error');
			}
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className='flex flex-col gap-6'
		>
			{isSuccess && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md p-8 text-center space-y-4 rounded-3xl'
				>
					<div className='h-16 w-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center'>
						<IconCheck size={32} />
					</div>
					<h4 className='text-lg font-bold text-foreground'>{contactMe.successMessage}</h4>
					<button
						type='button'
						onClick={() => setIsSuccess(false)}
						className='text-sm font-medium text-primary hover:underline cursor-pointer'
					>
						{contactMe.sendAnotherMessage}
					</button>
				</motion.div>
			)}

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{formFields.map((field) => {
					const isTextarea = field.type === 'textarea';
					const fieldName = fieldMap[field.name];

					return (
						<form.Field key={field.name} name={fieldName}>
							{(fieldApi) => {
								const hasError = fieldApi.state.meta.isTouched && fieldApi.state.meta.errors.length > 0;

								return (
									<div className={cn('flex flex-col gap-2', isTextarea && 'md:col-span-2')}>
										<label htmlFor={field.name} className='text-sm font-semibold text-foreground cursor-pointer w-fit'>
											{field.label}
										</label>

										{isTextarea ? (
											<textarea
												id={field.name}
												name={field.name}
												rows={5}
												placeholder={field.placeholder}
												value={fieldApi.state.value}
												onChange={(e) => fieldApi.handleChange(e.target.value)}
												onBlur={fieldApi.handleBlur}
												className={cn(
													'w-full px-4 py-3 rounded-xl bg-background/50 border focus:ring-2 outline-none transition-all resize-none placeholder:text-muted-foreground/40 text-base text-foreground',
													hasError
														? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
														: 'border-border focus:border-primary focus:ring-primary/10',
												)}
											/>
										) : (
											<input
												id={field.name}
												name={field.name}
												type={field.type}
												placeholder={field.placeholder}
												value={fieldApi.state.value}
												onChange={(e) => fieldApi.handleChange(e.target.value)}
												onBlur={fieldApi.handleBlur}
												className={cn(
													'w-full h-12 px-4 rounded-xl bg-background/50 border focus:ring-2 outline-none transition-all placeholder:text-muted-foreground/40 text-base text-foreground',
													hasError
														? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
														: 'border-border focus:border-primary focus:ring-primary/10',
												)}
											/>
										)}

										{hasError && (
											<span className='text-xs text-red-500'>
												{fieldApi.state.meta.errors.map((e) => (typeof e === 'string' ? e : e?.message || String(e))).join(', ')}
											</span>
										)}
									</div>
								);
							}}
						</form.Field>
					);
				})}
			</div>

			<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
				{([canSubmit, isSubmitting]) => (
					<button
						type='submit'
						disabled={!canSubmit || isSubmitting}
						className='w-full lg:w-auto lg:ml-auto h-12 px-6 bg-primary text-white text-base font-semibold rounded-xl shadow-none hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group'
					>
						{isSubmitting ? (
							<>
								<IconLoader2 size={20} className='animate-spin' />
								{contactMe.submittingButton}
							</>
						) : (
							contactMe.submitButton
						)}
					</button>
				)}
			</form.Subscribe>
		</form>
	);
}

function ContactPage() {
	const language = useLanguage();
	const { contactMe, contact } = useTranslation();

	const directContact = React.useMemo(() => contact.filter((val) => val.showInContactPage), [contact]);

	return (
		<SlideUp as='div' delay={0.5} className='grid mb-8 gap-8'>
			<div className='flex items-center'>
				<h2 className='text-lg font-semibold text-foreground shrink-0 tracking-tight'>{contactMe.header}</h2>
				<div className='h-px bg-border w-full ml-6'></div>
			</div>

			<p className='text-base text-muted-foreground'>{contactMe.description}</p>

			<div className='flex flex-col gap-6 glass-card bg-white/60 dark:bg-white/5 border border-white/50 dark:border-white/5 rounded-3xl p-6 md:p-8 light-shadow dark:shadow-none relative'>
				<h3 className='text-lg font-bold text-foreground'>{contactMe.formTitle}</h3>

				{/* Key forces remount when language changes, ensuring new schema is used */}
				<ContactForm key={language} formFields={contactMe.form} validation={contactMe.validation} contactMe={contactMe} />

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
