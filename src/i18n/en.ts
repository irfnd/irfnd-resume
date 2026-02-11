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
			url: 'https://wa.me/082175688883',
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
			'Middle Developer specialized in scalable web ecosystems. Expert in backend architecture and pixel-perfect UI/UX frontend.',
	},

	about: {
		title: 'Profile & Focus',
		description: [
			setHighlightText(
				'Specialized in architecting scalable web applications and high-throughput APIs. Proficient in the JavaScript/TypeScript ecosystem. Expertise spans relational and NoSQL database management, containerized deployment via Docker, and performance optimization. Committed to clean code principles and agile collaboration.',
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
								'Engineered the LRT Executive Dashboard and Digitax Middleware APIs for the Directorate General of Taxes using Express.js, Nest.js, and PostgreSQL.',
								['LRT Executive Dashboard', 'Digitax Middleware APIs'],
							),
							setHighlightText(
								'Optimized 10+ critical API endpoints involving complex table joins, ensuring seamless data flow between backend and frontend.',
								['10+ critical API endpoints'],
							),
							setHighlightText(
								'Implemented secure JWT authentication and a high-volume PDF merging service capable of processing 90+ files simultaneously.',
								['JWT authentication'],
							),
							setHighlightText('Standardized API documentation via Swagger, reducing frontend integration time by 80%.', [
								'Standardized API documentation',
							]),
							setHighlightText(
								'Partnered with QA and frontend teams to reduce bug resolution time by 90% through streamlined communication.',
								['QA and frontend teams', 'reduce bug resolution time by 90%'],
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
								'Revamped the CEISA 4.0 Customs & Excise application, delivering 2 core modules and integrating complex RESTful APIs.',
								['CEISA 4.0 Customs & Excise application'],
							),
							setHighlightText(
								'Accelerated UI development by 60% through the implementation of React Ant Design across 10+ responsive pages.',
								['React Ant Design'],
							),
							setHighlightText('Streamlined issue tracking via Git and Jira, cutting bug resolution turnaround by 70%.', [
								'Streamlined issue tracking',
							]),
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
								'Architected a Language Diagnostic Platform using Next.js and MongoDB, featuring 15+ API endpoints and a fully responsive UI.',
								['Language Diagnostic Platform'],
							),
							setHighlightText(
								'Integrated automated email result delivery and a secure payment gateway, enhancing user retention.',
								['payment gateway'],
							),
							setHighlightText('Managed feature delivery remotely using Git and Discord, ensuring timely project milestones.', [
								'Git',
								'Discord',
							]),
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
								'Modernized Employee Data Archiving for 500+ staff using MERN stack, improving data retrieval efficiency by 60%.',
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
			Languages: getTechStack(['JavaScript', 'TypeScript', 'Pyhton', 'Go']),
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
		subtitle: 'A selection of production-grade applications, APIs, and experiments built with modern technologies.',
		projects: [
			{
				icon: tabler.IconShieldCheck,
				name: 'CEISA 4.0 (Perizinan Module)',
				summary: [
					setHighlightText(
						'An advanced web application for the Indonesian Directorate General of Customs and Excise. Streamlines business integrations and user collaboration via robust RESTful APIs.',
						['Directorate General of Customs and Excise', 'business integrations', 'RESTful APIs'],
					),
					setHighlightText(
						'Key features include management of excise registrations, NPPBKC numbers, power of attorney delegations, and automated payment scheduling.',
						['NPPBKC numbers', 'power of attorney', 'automated payment scheduling'],
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
						alt: 'Login Screen',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039370/Portfolio/Ceisa/browse-nppbkc',
						alt: 'Browse NPPBKC',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039370/Portfolio/Ceisa/create-nppbkc',
						alt: 'Create NPPBKC',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039370/Portfolio/Ceisa/kuasa',
						alt: 'Power of Attorney',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039371/Portfolio/Ceisa/kode-personalisasi',
						alt: 'Personalization Code',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039370/Portfolio/Ceisa/hubungan-keterkaitan',
						alt: 'Association Relations',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039370/Portfolio/Ceisa/golongan-bkc',
						alt: 'Excise Tax Group',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039371/Portfolio/Ceisa/pembayaran-penundaan',
						alt: 'Deferred Payments',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039371/Portfolio/Ceisa/pembayaran-berkala',
						alt: 'Periodic Payments',
					},
				],
			},
			{
				icon: tabler.IconLanguage,
				name: 'Profdito',
				summary: [
					setHighlightText(
						'A comprehensive diagnostic tool for assessing proficiency in multiple languages. Features include secure test-taking environments, automated certification, and premium question packages.',
						['diagnostic tool', 'automated certification', 'premium question packages'],
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
						alt: 'Home',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/register',
						alt: 'Register',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/login',
						alt: 'Login',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/tentang-kami',
						alt: 'About Us',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/faq',
						alt: 'FAQ',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/daftar-soal',
						alt: 'Package List',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/detail-soal',
						alt: 'Package Detail',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/pembayaran-soal',
						alt: 'Payment',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/pengerjaan-soal',
						alt: 'Test Interface',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/hasil-pengerjaan',
						alt: 'Test Results',
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
						'A robust HR platform for employee lifecycle management. Functionalities include real-time data updates, transfer processing, leave approval, and organizational hierarchy management (Branches, Divisions, Positions).',
						['HR platform', 'real-time data updates', 'organizational hierarchy management'],
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
						alt: 'Dashboard',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629449/Portfolio/Stafflab/tambah-pegawai',
						alt: 'Add Employee',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629450/Portfolio/Stafflab/pegawai',
						alt: 'Employee List',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629450/Portfolio/Stafflab/tambah-mutasi',
						alt: 'Add Job Transfer',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629450/Portfolio/Stafflab/proses-mutasi',
						alt: 'Job Transfer Process',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629450/Portfolio/Stafflab/riwayat-mutasi',
						alt: 'Job Transfer History',
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
						description: 'Graduated with Highest Honors (Summa Cum Laude)',
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
						'Intensive 400+ hour full-stack immersion program focusing on MERN architecture and agile methodologies.',
						['MERN architecture', 'agile methodologies'],
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
			"We're here to answer your questions, discuss your project, and help you find the best solutions for your software needs. Reach out to us, and let's start building something great together.",
		formTitle: "Let's talk about your project",
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
				placeholder: "What's this about?",
			},
			{
				label: 'Message',
				name: 'message',
				type: 'textarea',
				placeholder: 'Tell us how we can help',
			},
		],
		submitButton: 'Send Message',
		successMessage: 'Message sent successfully!',
		sendAnotherMessage: 'Send another message',
		reachMeDirectly: 'Reach me directly',
	},

	footer: {
		copyright: '© {year} Irfandi Iqbal Abimanyu.',
		builtWith: 'Built with precision.',
	},

	common: {
		viewMore: 'View More',
		liveDemo: 'Live Demo',
		downloadResume: 'Download Resume',
		source: 'Source',
		internal: 'Internal',
		portfolioCategories: [
			{ label: 'All', value: 'all' },
			{ label: 'Frontend', value: 'frontend' },
			{ label: 'Backend', value: 'backend' },
			{ label: 'Fullstack', value: 'fullstack' },
		],
	},
};
