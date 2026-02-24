import { getTechStack } from '@/contents/tech-stack-list';
import type { Translations } from '@/types';
import { setHighlightText } from '@/utils/text';

import * as tabler from '@tabler/icons-react';

export const en: Translations = {
	navigation: [
		{ label: 'Home', url: '/', icon: tabler.IconHome },
		{ label: 'Portfolio', url: '/portfolio', icon: tabler.IconFolderStar },
		{ label: 'Contact', url: '/contact', icon: tabler.IconSend },
		{ label: 'Resume', url: '/resume', icon: tabler.IconFileDownload },
	],

	contact: [
		{
			type: 'location',
			label: 'Jakarta, Indonesia',
			url: 'https://maps.app.goo.gl/fyZkFpqiq9jYi1a28',
			icon: tabler.IconMapPin,
			showInContactPage: true,
		},
		{
			type: 'contact',
			label: 'irfandiabimanyu@gmail.com',
			url: 'mailto:irfandiabimanyu@gmail.com',
			icon: tabler.IconMail,
			showInStickyProfile: true,
			showInContactPage: true,
		},
		{
			type: 'contact',
			label: 'Whatsapp',
			url: 'https://wa.me/6282175688883',
			icon: tabler.IconBrandWhatsapp,
			showInContactPage: true,
		},
		{
			type: 'contact',
			label: 'LinkedIn',
			url: 'https://www.linkedin.com/in/irfnd-iqbl',
			icon: tabler.IconBrandLinkedin,
			showInStickyProfile: true,
			showInContactPage: true,
		},
		{
			type: 'contact',
			label: 'Github',
			url: 'https://github.com/irfnd',
			icon: tabler.IconBrandGithub,
			showInStickyProfile: true,
		},
		{
			type: 'contact',
			label: 'Instagram',
			url: 'https://www.instagram.com/irfnd.iqbl',
			icon: tabler.IconBrandInstagram,
			showInStickyProfile: true,
			showInContactPage: true,
		},
		{
			type: 'contact',
			label: 'Twitter',
			url: 'https://twitter.com/Irfnd_iqbl',
			icon: tabler.IconBrandX,
			showInStickyProfile: true,
		},
	],

	profile: {
		firstName: 'Irfandi',
		lastName: 'Iqbal Abimanyu',
		photo: {
			url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1722509145/Portfolio/Profile/irfnd-inovative',
			alt: 'Irfandi Photo Profile',
		},
		role: 'Fullstack Web Developer',
		description:
			'Results-driven Fullstack Developer specializing in scalable web architectures. Proven expertise in building robust backend systems and crafting high-fidelity, user-centric frontend interfaces.',
	},

	about: {
		title: 'Profile & Focus',
		description: [
			setHighlightText(
				'Specializing in the architecture of scalable web applications and high-performance APIs within the JavaScript/TypeScript ecosystem. I possess comprehensive expertise across relational and NoSQL database management, containerized deployments using Docker, and system performance optimization. Deeply committed to maintaining clean code standards, fostering technical excellence, and driving agile collaboration.',
				['JavaScript/TypeScript'],
			),
		],
		focus: [
			{ value: '3+ Years', label: 'Commercial Exp.', icon: tabler.IconCode },
			{ value: 'Full-Cycle', label: 'Development', icon: tabler.IconStack2 },
			{ value: 'Precision', label: 'UI/UX Engineering', icon: tabler.IconViewfinder },
		],
	},

	experience: {
		title: 'Professional Journey',
		jobs: [
			{
				company: 'Nutech Integrasi',
				mainPosition: 'Fullstack Web Engineer',
				type: 'Full-Time',
				location: 'Jakarta, Indonesia',
				duration: ['April 2023', 'October 2024'],
				link: 'https://www.nutech-integrasi.com/',
				descriptions: [
					{
						icon: tabler.IconServer2,
						position: 'Backend Development',
						summary: [],
						points: [
							setHighlightText(
								'Engineered the critical LRT Executive Dashboard and Digitax Middleware APIs for the Directorate General of Taxes, utilizing a robust stack of Express.js, Nest.js, and PostgreSQL to ensure high availability and data integrity.',
								['LRT Executive Dashboard', 'Digitax Middleware APIs'],
							),
							setHighlightText(
								'Optimized over 10 mission-critical API endpoints involving complex data aggregation, guaranteeing seamless and high-latency data synchronization between backend services and client applications.',
								['over 10 mission-critical API endpoints'],
							),
							setHighlightText(
								'Implemented a secure, scalable JWT authentication system and a high-throughput PDF processing service capable of handling concurrent operations for 90+ files.',
								['JWT authentication'],
							),
							setHighlightText(
								'Standardized API documentation protocols using Swagger, which successfully reduced frontend integration lead time by 80%.',
								['Standardized API documentation'],
							),
							setHighlightText(
								'Collaborated closely with QA and frontend engineering teams to streamline debugging workflows, reducing bug resolution time by 90% through effective cross-functional communication.',
								['QA and frontend engineering teams', 'reducing bug resolution time by 90%'],
							),
						],
						stacks: getTechStack(['TypeScript', 'Express.js', 'NestJS', 'PostgreSQL', 'Swagger']),
					},
					{
						icon: tabler.IconLayout,
						position: 'Frontend Development',
						summary: [],
						points: [
							setHighlightText(
								'Led the frontend modernization of the CEISA 4.0 Customs & Excise application, successfully delivering 2 core functional modules and integrating complex RESTful API services.',
								['CEISA 4.0 Customs & Excise application'],
							),
							setHighlightText(
								'Accelerated UI development velocity by 60% through the strategic implementation of the React Ant Design component library across 10+ responsive interfaces.',
								['React Ant Design'],
							),
							setHighlightText(
								'Optimized issue tracking workflows using Git and Jira, resulting in a 70% reduction in bug resolution turnaround time.',
								['Optimized issue tracking workflows'],
							),
						],
						stacks: getTechStack(['JavaScript', 'React', 'Redux', 'Ant Design']),
					},
				],
			},
			{
				company: 'Prof.Dito',
				mainPosition: 'Fullstack Web Developer',
				type: 'Freelance',
				location: 'Remote',
				duration: ['June 2022', 'May 2024'],
				link: 'https://profdito.com/',
				descriptions: [
					{
						position: 'Full-Stack Developer',
						summary: [],
						points: [
							setHighlightText(
								'Architected and deployed a comprehensive Language Diagnostic Platform using Next.js and MongoDB, supporting 15+ RESTful endpoints and a fully responsive, intuitive user interface.',
								['Language Diagnostic Platform'],
							),
							setHighlightText(
								'Integrated automated email dispatch systems and secure payment gateways, significantly enhancing user engagement and retention metrics.',
								['secure payment gateways'],
							),
							setHighlightText(
								'Managed end-to-end feature delivery in a remote setting, utilizing Git and Discord to ensure precise alignment with project milestones and timelines.',
								['Git', 'Discord'],
							),
						],
						stacks: getTechStack(['JavaScript', 'Next.js', 'Redux', 'Chakra UI', 'Express.js', 'MongoDB', 'Docker', 'Linux']),
					},
				],
			},
			{
				company: 'PLN UPDK Bandar Lampung',
				mainPosition: 'Engineering Staff',
				type: 'Internship',
				duration: ['March 2022', 'April 2022'],
				location: 'Lampung, Indonesia',
				link: null,
				descriptions: [
					{
						position: 'Engineering Staff',
						summary: [
							setHighlightText(
								'Modernized the Employee Data Archiving system for 500+ personnel by implementing a MERN stack solution, improving data retrieval efficiency by 60%.',
								['Employee Data Archiving', 'MERN stack'],
							),
						],
						points: [],
						stacks: getTechStack(['JavaScript', 'React', 'Chakra UI', 'PostgreSQL', 'Supabase']),
					},
				],
			},
		],
	},

	technology: {
		title: 'Technical Stack',
		stacks: {
			Languages: getTechStack(['JavaScript', 'TypeScript', 'Python', 'Go']),
			'Frameworks & UI': getTechStack([
				'Alpine.js',
				'React',
				'Vue.js',
				'Next.js',
				'Express.js',
				'NestJS',
				'Flask',
				'Django',
				'Tailwind CSS',
				'Shadcn UI',
				'Ant Design',
				'Material UI',
				'Chakra UI',
			]),
			'Databases & Infrastructure': getTechStack([
				'PostgreSQL',
				'MongoDB',
				'Redis',
				'Firebase',
				'Supabase',
				'GraphQL',
				'Docker',
				'Linux',
			]),
		},
	},

	portfolio: {
		header: 'Portfolio',
		title: 'Selected Works',
		subtitle:
			'A curated selection of production-grade applications, robust APIs, and innovative experiments engineered with modern web technologies.',
		projects: [
			{
				icon: tabler.IconShieldCheck,
				name: 'CEISA 4.0 (Licensing Module)',
				summary: [
					setHighlightText(
						'An enterprise-grade web application developed for the Directorate General of Customs and Excise. Designed to streamline complex business integrations and facilitate seamless user collaboration via robust RESTful AP architecture.',
						['Directorate General of Customs and Excise', 'business integrations', 'RESTful AP'],
					),
					setHighlightText(
						'Key capabilities include comprehensive management of excise registrations, NPPBKC issuance, power of attorney delegations, and automated payment scheduling workflows.',
						['NPPBKC issuance', 'power of attorney', 'automated payment scheduling'],
					),
				],
				type: 'private',
				category: 'frontend',
				demo: null,
				source: null,
				stacks: getTechStack(['JavaScript', 'React', 'Redux', 'Ant Design']),
				image: [
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039370/Portfolio/Ceisa/login',
						alt: 'Login Interface',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039370/Portfolio/Ceisa/browse-nppbkc',
						alt: 'NPPBKC Directory',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039370/Portfolio/Ceisa/create-nppbkc',
						alt: 'Create NPPBKC',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039370/Portfolio/Ceisa/kuasa',
						alt: 'Power of Attorney Management',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039371/Portfolio/Ceisa/kode-personalisasi',
						alt: 'Personalization Code',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039370/Portfolio/Ceisa/hubungan-keterkaitan',
						alt: 'Entity Relationships',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039370/Portfolio/Ceisa/golongan-bkc',
						alt: 'Excise Tax Classification',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039371/Portfolio/Ceisa/pembayaran-penundaan',
						alt: 'Deferred Payment Processing',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039371/Portfolio/Ceisa/pembayaran-berkala',
						alt: 'Periodic Payment Schedule',
					},
				],
			},
			{
				icon: tabler.IconLanguage,
				name: 'Profdito',
				summary: [
					setHighlightText(
						'A comprehensive diagnostic platform designed to assess multi-language proficiency. Engineered with secure testing environments, automated certification systems, and premium assessment modules.',
						['diagnostic platform', 'automated certification', 'premium assessment modules'],
					),
				],
				type: 'public',
				category: 'fullstack',
				demo: 'https://profdito.com',
				source: null,
				stacks: getTechStack(['JavaScript', 'Next.js', 'Redux', 'Chakra UI', 'Express.js', 'MongoDB']),
				image: [
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/beranda',
						alt: 'Landing Page',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/register',
						alt: 'User Registration',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/login',
						alt: 'Authentication',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/tentang-kami',
						alt: 'About Organization',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/faq',
						alt: 'FAQ Section',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/daftar-soal',
						alt: 'Assessment Catalog',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/detail-soal',
						alt: 'Assessment Details',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/pembayaran-soal',
						alt: 'Payment Checkout',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/pengerjaan-soal',
						alt: 'Examination Interface',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/hasil-pengerjaan',
						alt: 'Performance Results',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/dashboard-pengguna',
						alt: 'User Dashboard',
					},
				],
			},
			{
				icon: tabler.IconUsersGroup,
				name: 'StaffLab',
				summary: [
					setHighlightText(
						'A scalable HR management platform for optimizing employee lifecycle operations. Features real-time data synchronization, automated transfer processing, leave management, and dynamic visualization of organizational hierarchies (Branches, Divisions, Positions).',
						['HR management platform', 'real-time data synchronization', 'dynamic visualization'],
					),
				],
				type: 'public',
				category: 'frontend',
				demo: 'https://stafflab.irfnd.id',
				source: 'https://github.com/irfnd/fe-stafflab',
				stacks: getTechStack(['JavaScript', 'React', 'Chakra UI', 'PostgreSQL', 'Supabase']),
				image: [
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629557/Portfolio/Stafflab/dashboard',
						alt: 'Executive Dashboard',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629449/Portfolio/Stafflab/tambah-pegawai',
						alt: 'Onboard Employee',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629450/Portfolio/Stafflab/pegawai',
						alt: 'Personnel Directory',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629450/Portfolio/Stafflab/tambah-mutasi',
						alt: 'Initiate Transfer',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629450/Portfolio/Stafflab/proses-mutasi',
						alt: 'Transfer Workflow',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629450/Portfolio/Stafflab/riwayat-mutasi',
						alt: 'Transfer History',
					},
				],
			},
		],
	},

	education: {
		title: 'Education History',
		educations: [
			{
				institution: 'Lampung State Polytechnic',
				degree: "Associate's Degree",
				fieldOfStudy: 'Informatics Engineering',
				location: 'Lampung, Indonesia',
				duration: ['July 2019', 'May 2023'],
				link: 'https://polinela.ac.id/',
				summary: [],
				points: [],
				award: [
					{
						label: 'GPA: 4.00 / 4.00',
						description: 'Graduated Summa Cum Laude (Highest Honors)',
						icon: tabler.IconAward,
					},
				],
			},
			{
				institution: 'Pijar Camp',
				degree: 'Intensive Bootcamp',
				fieldOfStudy: 'Fullstack Web Development',
				location: 'Remote',
				duration: ['May 2022', 'August 2022'],
				link: 'https://camp.pijarmahir.id/',
				summary: [
					setHighlightText(
						'Completed a rigorous 400+ hour immersive program centered on the MERN stack architecture and Agile software development methodologies.',
						['MERN stack architecture', 'Agile software development'],
					),
				],
				points: [],
				award: [],
			},
		],
	},

	contactMe: {
		header: 'Contact Me',
		description:
			'Open to discussing new projects, technical challenges, or potential collaborations. Feel free to reach out to explore how we can build impactful digital solutions together.',
		formTitle: 'Start a Conversation',
		form: [
			{
				label: 'Name',
				name: 'fullName',
				type: 'text',
				placeholder: 'Your full name',
			},
			{
				label: 'Email Address',
				name: 'email',
				type: 'email',
				placeholder: 'Your email address',
			},
			{
				label: 'Telephone',
				name: 'telephone',
				type: 'tel',
				placeholder: 'Your contact number',
			},
			{
				label: 'Subject',
				name: 'subject',
				type: 'text',
				placeholder: 'Topic of discussion',
			},
			{
				label: 'Message',
				name: 'message',
				type: 'textarea',
				placeholder: 'How can I assist you?',
			},
		],
		submitButton: 'Send Message',
		successMessage: 'Message sent successfully!',
		sendAnotherMessage: 'Send another message',
		reachMeDirectly: 'Reach me directly',
	},

	footer: {
		copyright: '© {year} Irfandi Iqbal Abimanyu.',
		builtWith: 'Engineered with precision.',
	},

	common: {
		viewMore: 'View Details',
		liveDemo: 'Live Demo',
		downloadResume: 'Download Resume',
		source: 'Source Code',
		internal: 'Internal Project',
		portfolioCategories: [
			{ label: 'All', value: 'all' },
			{ label: 'Frontend', value: 'frontend' },
			{ label: 'Backend', value: 'backend' },
			{ label: 'Fullstack', value: 'fullstack' },
		],
	},
};
