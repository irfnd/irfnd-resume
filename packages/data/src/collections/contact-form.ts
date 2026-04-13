import type { I18nData } from '../helpers';
import type { ContactFormData } from '../schemas/contact-form';

export const contactForm: I18nData<ContactFormData> = {
	en: {
		header: 'Contact Me',
		description: 'Open to discussing new projects, technical challenges, or potential collaborations. Feel free to reach out to explore how we can build impactful digital solutions together.',
		formTitle: 'Start a Conversation',
		form: [
			{ label: 'Name', name: 'fullName', type: 'text', placeholder: 'Your full name' },
			{ label: 'Email Address', name: 'email', type: 'email', placeholder: 'Your email address' },
			{ label: 'Telephone', name: 'telephone', type: 'tel', placeholder: 'Your contact number' },
			{ label: 'Subject', name: 'subject', type: 'text', placeholder: 'Topic of discussion' },
			{ label: 'Message', name: 'message', type: 'textarea', placeholder: 'How can I assist you?' },
		],
		submitButton: 'Send Message',
		submittingButton: 'Sending...',
		successMessage: 'Message sent successfully!',
		sendAnotherMessage: 'Send another message',
		reachMeDirectly: 'Reach me directly',
		errors: {
			rateLimited: 'Too many requests. Please try again later.',
			networkError: 'Unable to connect. Check your internet connection.',
			serverError: 'Something went wrong. Please try again.',
			validationError: 'Please check your form inputs.',
		},
		validation: {
			fullName: { min: 'Name must be at least 2 characters', max: 'Name must be less than 100 characters' },
			email: { invalid: 'Invalid email address' },
			telephone: { min: 'Invalid phone number', max: 'Phone number too long' },
			subject: { min: 'Subject must be at least 2 characters', max: 'Subject must be less than 200 characters' },
			message: { min: 'Message must be at least 10 characters', max: 'Message must be less than 5000 characters' },
		},
	},
	id: {
		header: 'Hubungi Saya',
		description: 'Terbuka untuk diskusi proyek, tantangan teknis, maupun peluang kolaborasi. Jangan ragu menghubungi saya untuk mengeksplorasi bagaimana kita dapat membangun solusi digital yang berdampak bersama.',
		formTitle: 'Mulai Percakapan',
		form: [
			{ label: 'Nama Lengkap', name: 'fullName', type: 'text', placeholder: 'Nama lengkap Anda' },
			{ label: 'Alamat Email', name: 'email', type: 'email', placeholder: 'Alamat email aktif' },
			{ label: 'Nomor Telepon', name: 'telephone', type: 'tel', placeholder: 'Nomor yang dapat dihubungi' },
			{ label: 'Subjek', name: 'subject', type: 'text', placeholder: 'Topik diskusi' },
			{ label: 'Pesan', name: 'message', type: 'textarea', placeholder: 'Bagaimana saya bisa membantu?' },
		],
		submitButton: 'Kirim Pesan',
		submittingButton: 'Mengirim...',
		successMessage: 'Pesan berhasil dikirim!',
		sendAnotherMessage: 'Kirim pesan lain',
		reachMeDirectly: 'Hubungi secara langsung',
		errors: {
			rateLimited: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
			networkError: 'Tidak dapat terhubung. Periksa koneksi internet Anda.',
			serverError: 'Terjadi kesalahan. Silakan coba lagi.',
			validationError: 'Silakan periksa input formulir Anda.',
		},
		validation: {
			fullName: { min: 'Nama harus minimal 2 karakter', max: 'Nama harus kurang dari 100 karakter' },
			email: { invalid: 'Alamat email tidak valid' },
			telephone: { min: 'Nomor telepon tidak valid', max: 'Nomor telepon terlalu panjang' },
			subject: { min: 'Subjek harus minimal 2 karakter', max: 'Subjek harus kurang dari 200 karakter' },
			message: { min: 'Pesan harus minimal 10 karakter', max: 'Pesan harus kurang dari 5000 karakter' },
		},
	},
};
