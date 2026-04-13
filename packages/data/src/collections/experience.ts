import type { I18nData } from '../helpers';
import type { ExperienceData } from '../schemas/experience';

export const experience: I18nData<ExperienceData> = {
	en: {
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
						icon: 'tabler:server-2',
						position: 'Backend Development',
						duration: ['July 2024', 'October 2024'],
						summary: [],
						points: [
							{
								value:
									'Engineered the critical {0} and {1} for the Directorate General of Taxes, utilizing a robust stack of Express.js, Nest.js, and PostgreSQL to ensure high availability and data integrity.',
								keywords: ['LRT Executive Dashboard', 'Digitax Middleware APIs'],
							},
							{
								value:
									'Optimized {0} involving complex data aggregation, guaranteeing seamless and high-latency data synchronization between backend services and client applications.',
								keywords: ['over 10 mission-critical API endpoints'],
							},
							{
								value:
									'Implemented a secure, scalable {0} system and a high-throughput PDF processing service capable of handling concurrent operations for 90+ files.',
								keywords: ['JWT authentication'],
							},
							{
								value: '{0} protocols using Swagger, which successfully reduced frontend integration lead time by 80%.',
								keywords: ['Standardized API documentation'],
							},
							{
								value:
									'Collaborated closely with {0} to streamline debugging workflows, {1} through effective cross-functional communication.',
								keywords: ['QA and frontend engineering teams', 'reducing bug resolution time by 90%'],
							},
						],
						stacks: ['TypeScript', 'Express.js', 'NestJS', 'PostgreSQL', 'Swagger'],
					},
					{
						icon: 'tabler:layout',
						position: 'Frontend Development',
						duration: ['April 2023', 'July 2024'],
						summary: [],
						points: [
							{
								value:
									'Led the frontend modernization of the {0}, successfully delivering 2 core functional modules and integrating complex RESTful API services.',
								keywords: ['CEISA 4.0 Customs & Excise application'],
							},
							{
								value:
									'Accelerated UI development velocity by 60% through the strategic implementation of the {0} component library across 10+ responsive interfaces.',
								keywords: ['React Ant Design'],
							},
							{
								value: '{0} using Git and Jira, resulting in a 70% reduction in bug resolution turnaround time.',
								keywords: ['Optimized issue tracking workflows'],
							},
						],
						stacks: ['JavaScript', 'React', 'Ant Design', 'Redux'],
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
							{
								value:
									'Architected and deployed a comprehensive {0} using Next.js and MongoDB, supporting 15+ RESTful endpoints and a fully responsive, intuitive user interface.',
								keywords: ['Language Diagnostic Platform'],
							},
							{
								value:
									'Integrated automated email dispatch systems and {0}, significantly enhancing user engagement and retention metrics.',
								keywords: ['secure payment gateways'],
							},
							{
								value:
									'Managed end-to-end feature delivery in a remote setting, utilizing {0} and {1} to ensure precise alignment with project milestones and timelines.',
								keywords: ['Git', 'Discord'],
							},
						],
						stacks: ['JavaScript', 'Next.js', 'Express.js', 'Chakra UI', 'MongoDB', 'Docker', 'Linux', 'Redux'],
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
							{
								value:
									'Modernized the {0} system for 500+ personnel by implementing a {1} solution, improving data retrieval efficiency by 60%.',
								keywords: ['Employee Data Archiving', 'MERN stack'],
							},
						],
						points: [],
						stacks: ['JavaScript', 'React', 'Chakra UI', 'PostgreSQL', 'Supabase'],
					},
				],
			},
		],
	},
	id: {
		title: 'Perjalanan Profesional',
		jobs: [
			{
				company: 'Nutech Integrasi',
				mainPosition: 'Fullstack Web Engineer',
				type: 'Full-Time',
				location: 'Jakarta, Indonesia',
				duration: ['April 2023', 'Oktober 2024'],
				link: 'https://www.nutech-integrasi.com/',
				descriptions: [
					{
						icon: 'tabler:server-2',
						position: 'Backend Development',
						duration: ['Juli 2024', 'Oktober 2024'],
						summary: [],
						points: [
							{
								value:
									'Membangun {0} dan {1} untuk Direktorat Jenderal Pajak menggunakan stack Express.js, NestJS, dan PostgreSQL guna menjamin high availability dan integritas data.',
								keywords: ['Dashboard Eksekutif LRT', 'Middleware API Digitax'],
							},
							{
								value:
									'Mengoptimalkan {0} yang melibatkan agregasi data kompleks, memastikan sinkronisasi data yang seamless dan low-latency antara layanan backend dan aplikasi klien.',
								keywords: ['lebih dari 10 endpoint API kritis'],
							},
							{
								value:
									'Mengimplementasikan sistem {0} yang aman serta layanan pemrosesan PDF high-throughput yang mampu menangani operasi konkuren untuk 90+ file.',
								keywords: ['autentikasi JWT'],
							},
							{
								value: '{0} menggunakan Swagger, yang berhasil mempersingkat waktu integrasi frontend hingga 80%.',
								keywords: ['Menstandarisasi dokumentasi API'],
							},
							{
								value:
									'Berkolaborasi intensif dengan {0} untuk menyederhanakan alur debugging, sehingga berhasil {1} melalui komunikasi lintas fungsi yang efektif.',
								keywords: ['tim QA dan frontend engineer', 'memangkas waktu resolusi bug hingga 90%'],
							},
						],
						stacks: ['TypeScript', 'Express.js', 'NestJS', 'PostgreSQL', 'Swagger'],
					},
					{
						icon: 'tabler:layout',
						position: 'Frontend Development',
						duration: ['April 2023', 'Juli 2024'],
						summary: [],
						points: [
							{
								value:
									'Memimpin modernisasi frontend {0}, menyelesaikan 2 modul fungsional inti dan mengintegrasikan layanan API RESTful yang kompleks.',
								keywords: ['aplikasi CEISA 4.0 Bea Cukai'],
							},
							{
								value:
									'Meningkatkan kecepatan development UI sebesar 60% melalui implementasi strategis component library {0} pada 10+ antarmuka responsif.',
								keywords: ['React Ant Design'],
							},
							{
								value: '{0} menggunakan Git dan Jira, sehingga berhasil memangkas waktu resolusi bug sebesar 70%.',
								keywords: ['Mengoptimalkan alur issue tracking'],
							},
						],
						stacks: ['JavaScript', 'React', 'Ant Design', 'Redux'],
					},
				],
			},
			{
				company: 'Prof.Dito',
				mainPosition: 'Fullstack Web Developer',
				type: 'Freelance',
				location: 'Remote',
				duration: ['Juni 2022', 'Mei 2024'],
				link: 'https://profdito.com/',
				descriptions: [
					{
						position: 'Full-Stack Developer',
						summary: [],
						points: [
							{
								value:
									'Merancang dan men-deploy {0} komprehensif menggunakan Next.js dan MongoDB, mencakup 15+ RESTful endpoint dengan antarmuka yang intuitif dan responsif.',
								keywords: ['Platform Diagnostik Bahasa'],
							},
							{
								value:
									'Mengintegrasikan sistem automated email dan {0} yang aman, sehingga secara signifikan meningkatkan engagement dan retensi pengguna.',
								keywords: ['payment gateway'],
							},
							{
								value:
									'Mengelola pengiriman fitur secara end-to-end di lingkungan remote, memanfaatkan {0} dan {1} untuk memastikan keselarasan dengan milestone dan timeline proyek.',
								keywords: ['Git', 'Discord'],
							},
						],
						stacks: ['JavaScript', 'Next.js', 'Express.js', 'Chakra UI', 'MongoDB', 'Docker', 'Linux', 'Redux'],
					},
				],
			},
			{
				company: 'PLN UPDK Bandar Lampung',
				mainPosition: 'Staf Teknik',
				type: 'Internship',
				duration: ['Maret 2022', 'April 2022'],
				location: 'Lampung, Indonesia',
				link: null,
				descriptions: [
					{
						position: 'Staf Teknik',
						summary: [
							{
								value:
									'Memodernisasi sistem {0} bagi 500+ personel menggunakan solusi berbasis {1}, meningkatkan efisiensi pengambilan data sebesar 60%.',
								keywords: ['Pengarsipan Data Karyawan', 'MERN stack'],
							},
						],
						points: [],
						stacks: ['JavaScript', 'React', 'Chakra UI', 'PostgreSQL', 'Supabase'],
					},
				],
			},
		],
	},
};
