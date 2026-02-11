import { getTechStack } from '@/contents/tech-stack-list';
import type { Translations } from '@/types';
import { setHighlightText } from '@/utils/text';

import * as tabler from '@tabler/icons-react';

export const id: Translations = {
	navigation: [
		{ label: 'Beranda', url: '/', icon: tabler.IconHome },
		{ label: 'Portofolio', url: '/portfolio', icon: tabler.IconFolderStar },
		{ label: 'Kontak', url: '/contact', icon: tabler.IconSend },
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
			alt: 'Foto Profil Irfandi',
		},
		role: 'Fullstack Web Developer',
		description:
			'Pengembang Fullstack dengan spesialisasi ekosistem web skalabel. Ahli dalam arsitektur backend dan pengembangan frontend UI/UX yang presisi.',
	},

	about: {
		title: 'Profil & Fokus',
		description: [
			setHighlightText(
				'Berdedikasi untuk menciptakan aplikasi web skalabel dan API berkinerja tinggi yang mampu menangani beban kerja besar. Dengan penguasaan mendalam atas ekosistem JavaScript dan TypeScript, keahlian yang dimiliki mencakup manajemen database relasional dan NoSQL, penerapan containerization menggunakan Docker, serta strategi optimasi sistem yang komprehensif. Selalu memegang teguh prinsip clean code dan menghargai kolaborasi tim yang adaptif dalam lingkungan kerja agile.',
				['JavaScript dan TypeScript'],
			),
		],
		focus: [
			{ value: '3+ Tahun', label: 'Exp. Komersial', icon: tabler.IconCode },
			{ value: 'Full-Cycle', label: 'Development', icon: tabler.IconStack2 },
			{ value: 'Presisi', label: 'UI/UX Engineering', icon: tabler.IconViewfinder },
		],
	},

	experience: {
		title: 'Perjalanan Profesional',
		jobs: [
			{
				company: 'Nutech Integrasi',
				mainPosition: 'Fullstack Web Engineer',
				type: 'Penuh Waktu',
				location: 'Jakarta, Indonesia',
				duration: ['April 2023', 'Oktober 2024'],
				link: 'https://www.nutech-integrasi.com/',
				descriptions: [
					{
						icon: tabler.IconServer2,
						position: 'Pengembangan Backend',
						summary: [],
						points: [
							setHighlightText(
								'Merancang dan mengembangkan Dashboard Eksekutif LRT serta API Middleware Digitax untuk Direktorat Jenderal Pajak, memanfaatkan teknologi Express.js, Nest.js, dan PostgreSQL.',
								['Dashboard Eksekutif LRT', 'API Middleware Digitax'],
							),
							setHighlightText(
								'Melakukan optimasi performa pada 10+ endpoint API krusial yang menangani kueri database kompleks, menjamin kelancaran aliran data antar sistem backend dan frontend.',
								['10+ endpoint API krusial'],
							),
							setHighlightText(
								'Mengimplementasikan sistem autentikasi JWT yang aman serta layanan penggabungan dokumen PDF bervolume tinggi yang mampu memproses puluhan file secara simultan.',
								['sistem autentikasi JWT', 'dokumen PDF bervolume tinggi'],
							),
							setHighlightText(
								'Menstandarisasi dokumentasi API menggunakan Swagger, yang berhasil mempercepat integrasi frontend hingga 80%.',
								['Menstandarisasi dokumentasi API'],
							),
							setHighlightText(
								'Berkolaborasi secara intensif dengan tim QA dan frontend untuk mempersingkat waktu resolusi bug hingga 90% melalui komunikasi yang efisien.',
								['Berkolaborasi secara intensif'],
							),
						],
						stacks: getTechStack(['TypeScript', 'Express.js', 'NestJS', 'PostgreSQL', 'Swagger']),
					},
					{
						icon: tabler.IconLayout,
						position: 'Pengembangan Frontend',
						summary: [],
						points: [
							setHighlightText(
								'Berkontribusi dalam pembaruan aplikasi CEISA 4.0 Bea Cukai, dengan fokus pada pengembangan 2 modul inti dan integrasi API RESTful yang kompleks.',
								['aplikasi CEISA 4.0 Bea Cukai', 'API RESTful yang kompleks'],
							),
							setHighlightText(
								'Mempercepat pengembangan antarmuka pengguna sebesar 60% melalui implementasi library React Ant Design pada 10+ halaman responsif.',
								['React Ant Design', '10+ halaman responsif'],
							),
							setHighlightText(
								'Menyederhanakan pelacakan isu menggunakan Git dan Jira, memangkas waktu penyelesaian bug hingga 70%.',
								['Menyederhanakan pelacakan isu', 'Git', 'Jira'],
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
				duration: ['Juni 2022', 'Mei 2024'],
				link: 'https://profdito.com/',
				descriptions: [
					{
						position: 'Full-Stack Developer',
						summary: [],
						points: [
							setHighlightText(
								'Merancang arsitektur Platform Diagnostik Bahasa berbasis Next.js dan MongoDB, yang melayani lebih dari 15 endpoint API dengan antarmuka pengguna yang responsif dan intuitif.',
								['Platform Diagnostik Bahasa', 'Next.js dan MongoDB'],
							),
							setHighlightText(
								'Mengintegrasikan sistem pengiriman hasil tes otomatis via email dan gateway pembayaran aman, yang berkontribusi signifikan pada retensi pengguna.',
								['gateway pembayaran aman'],
							),
							setHighlightText(
								'Mengelola seluruh siklus pengiriman fitur secara remote menggunakan Git dan Discord, memastikan setiap milestone proyek tercapai tepat waktu.',
								['Git', 'Discord'],
							),
						],
						stacks: getTechStack(['JavaScript', 'Next.js', 'Redux', 'Chakra UI', 'Express.js', 'MongoDB', 'Docker', 'Linux']),
					},
				],
			},
			{
				company: 'PLN UPDK Bandar Lampung',
				mainPosition: 'Staf Teknik',
				type: 'Magang',
				duration: ['Maret 2022', 'April 2022'],
				location: 'Lampung, Indonesia',
				link: null,
				descriptions: [
					{
						position: 'Staf Teknik',
						summary: [
							setHighlightText(
								'Memodernisasi sistem Pengarsipan Data Karyawan untuk lebih dari 500 staf menggunakan stack MERN, yang meningkatkan efisiensi proses pengambilan data sebesar 60%.',
								['Memodernisasi sistem Pengarsipan Data Karyawan', 'stack MERN'],
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
		title: 'Arsitektur & Teknologi',
		stacks: {
			Bahasa: getTechStack(['JavaScript', 'TypeScript', 'Pyhton', 'Go']),
			'Framework & UI': getTechStack([
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
			'Database & Infrastruktur': getTechStack([
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
		header: 'Portofolio',
		title: 'Karya Terpilih',
		subtitle:
			'Koleksi terpilih dari aplikasi, API, dan eksperimen inovatif yang dibangun menggunakan teknologi web modern berstandar industri.',
		projects: [
			{
				icon: tabler.IconShieldCheck,
				name: 'CEISA 4.0 (Modul Perizinan)',
				summary: [
					setHighlightText(
						'Aplikasi web skala enterprise yang dikembangkan untuk Direktorat Jenderal Bea dan Cukai. Dirancang untuk menyederhanakan integrasi proses bisnis dan memfasilitasi kolaborasi pengguna melalui arsitektur API RESTful yang handal.',
						['skala enterprise', 'Direktorat Jenderal Bea dan Cukai', 'API RESTful'],
					),
					setHighlightText(
						'Mencakup fitur-fitur krusial seperti manajemen registrasi cukai, penerbitan Nomor NPPBKC, delegasi surat kuasa, serta sistem penjadwalan pembayaran otomatis.',
						['Nomor NPPBKC', 'surat kuasa', 'pembayaran otomatis'],
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
						alt: 'Layar Login',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039370/Portfolio/Ceisa/browse-nppbkc',
						alt: 'Lihat NPPBKC',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039370/Portfolio/Ceisa/create-nppbkc',
						alt: 'Buat NPPBKC',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039370/Portfolio/Ceisa/kuasa',
						alt: 'Surat Kuasa',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039371/Portfolio/Ceisa/kode-personalisasi',
						alt: 'Kode Personalisasi',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039370/Portfolio/Ceisa/hubungan-keterkaitan',
						alt: 'Hubungan Keterkaitan',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039370/Portfolio/Ceisa/golongan-bkc',
						alt: 'Golongan BKC',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039371/Portfolio/Ceisa/pembayaran-penundaan',
						alt: 'Pembayaran Penundaan',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039371/Portfolio/Ceisa/pembayaran-berkala',
						alt: 'Pembayaran Berkala',
					},
				],
			},
			{
				icon: tabler.IconLanguage,
				name: 'Profdito',
				summary: [
					setHighlightText(
						'Platform diagnostik komprehensif untuk mengevaluasi kemahiran bahasa. Dilengkapi dengan lingkungan ujian yang aman, sistem sertifikasi otomatis, dan manajemen bank soal premium.',
						['Platform diagnostik', 'sertifikasi otomatis', 'bank soal premium'],
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
						alt: 'Beranda',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/register',
						alt: 'Daftar',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/login',
						alt: 'Masuk',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/tentang-kami',
						alt: 'Tentang Kami',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/faq',
						alt: 'FAQ',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/daftar-soal',
						alt: 'Daftar Paket',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/detail-soal',
						alt: 'Detail Paket',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/pembayaran-soal',
						alt: 'Pembayaran',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/pengerjaan-soal',
						alt: 'Antarmuka Tes',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/hasil-pengerjaan',
						alt: 'Hasil Tes',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/dashboard-pengguna',
						alt: 'Dashboard Pengguna',
					},
				],
			},
			{
				icon: tabler.IconUsersGroup,
				name: 'StaffLab',
				summary: [
					setHighlightText(
						'Solusi platform HR modern untuk manajemen siklus hidup karyawan. Menawarkan fungsionalitas real-time untuk pembaruan data, pemrosesan mutasi jabatan, persetujuan cuti, serta visualisasi hierarki organisasi yang dinamis.',
						['platform HR modern', 'fungsionalitas real-time', 'hierarki organisasi'],
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
						alt: 'Tambah Karyawan',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629450/Portfolio/Stafflab/pegawai',
						alt: 'Daftar Karyawan',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629450/Portfolio/Stafflab/tambah-mutasi',
						alt: 'Tambah Mutasi Jabatan',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629450/Portfolio/Stafflab/proses-mutasi',
						alt: 'Proses Mutasi Jabatan',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629450/Portfolio/Stafflab/riwayat-mutasi',
						alt: 'Riwayat Mutasi Jabatan',
					},
				],
			},
		],
	},

	education: {
		title: 'Riwayat Pendidikan',
		educations: [
			{
				institution: 'Politeknik Negeri Lampung',
				degree: 'Diploma III (D3)',
				fieldOfStudy: 'Manajemen Informatika',
				location: 'Lampung, Indonesia',
				duration: ['Juli 2019', 'Mei 2023'],
				link: 'https://polinela.ac.id/',
				summary: [],
				points: [],
				award: [
					{
						label: 'IPK: 4.00 / 4.00',
						description: 'Lulus dengan Pujian Tertinggi (Summa Cum Laude)',
						icon: tabler.IconAward,
					},
				],
			},
			{
				institution: 'Pijar Camp',
				degree: 'Bootcamp Intensif',
				fieldOfStudy: 'Fullstack Web Development',
				location: 'Remote',
				duration: ['Mei 2022', 'Agustus 2022'],
				link: 'https://camp.pijarmahir.id/',
				summary: [
					setHighlightText(
						'Mengikuti program intensif full-stack selama 400+ jam, dengan fokus pendalaman pada arsitektur MERN dan penerapan metodologi agile dalam pengembangan perangkat lunak.',
						['program intensif full-stack selama 400+ jam', 'arsitektur MERN', 'penerapan metodologi agile'],
					),
				],
				points: [],
				award: [],
			},
		],
	},

	contactMe: {
		header: 'Hubungi Saya',
		description:
			'Siap bekerja sama untuk mewujudkan visi Anda. Apakah Anda memiliki pertanyaan, ide proyek, atau membutuhkan solusi teknis yang spesifik, jangan ragu untuk menghubungi. Mari kita bangun solusi digital yang hebat bersama-sama.',
		formTitle: 'Ceritakan Tentang Proyek Anda',
		form: [
			{
				label: 'Nama Lengkap',
				name: 'fullName',
				type: 'text',
				placeholder: 'Masukkan nama lengkap Anda',
			},
			{
				label: 'Alamat Email',
				name: 'email',
				type: 'email',
				placeholder: 'Masukkan email Anda',
			},
			{
				label: 'Nomor Telepon',
				name: 'telephone',
				type: 'tel',
				placeholder: 'Masukkan nomor telepon Anda',
			},
			{
				label: 'Topik',
				name: 'subject',
				type: 'text',
				placeholder: 'Apa yang ingin Anda diskusikan?',
			},
			{
				label: 'Pesan',
				name: 'message',
				type: 'textarea',
				placeholder: 'Jelaskan kebutuhan atau pertanyaan Anda',
			},
		],
		submitButton: 'Kirim Pesan',
		successMessage: 'Pesan berhasil dikirim!',
		sendAnotherMessage: 'Kirim pesan lainnya',
		reachMeDirectly: 'Hubungi saya langsung',
	},

	footer: {
		copyright: '© {year} Irfandi Iqbal Abimanyu.',
		builtWith: 'Dirancang dengan presisi.',
	},

	common: {
		viewMore: 'Selengkapnya',
		liveDemo: 'Demo Live',
		downloadResume: 'Unduh CV',
		source: 'Sumber',
		internal: 'Internal',
		portfolioCategories: [
			{ label: 'Semua', value: 'all' },
			{ label: 'Frontend', value: 'frontend' },
			{ label: 'Backend', value: 'backend' },
			{ label: 'Fullstack', value: 'fullstack' },
		],
	},
};
