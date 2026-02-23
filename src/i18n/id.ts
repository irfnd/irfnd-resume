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
			'Fullstack Developer yang berfokus pada solusi dan arsitektur web skalabel. Berpengalaman membangun backend yang handal serta merancang antarmuka frontend presisi yang berpusat pada pengalaman pengguna.',
	},

	about: {
		title: 'Profil & Fokus',
		description: [
			setHighlightText(
				'Saya berfokus pada pengembangan arsitektur aplikasi web skalabel dan API berkinerja tinggi dalam ekosistem JavaScript/TypeScript. Memiliki keahlian mendalam dalam manajemen database relasional dan NoSQL, deployment dengan container Docker, serta optimasi performa sistem. Saya berkomitmen menerapkan standar "clean code", menjaga kualitas teknis, dan mengedepankan kolaborasi tim yang adaptif.',
				['JavaScript/TypeScript'],
			),
		],
		focus: [
			{ value: '3+ Tahun', label: 'Pengalaman', icon: tabler.IconCode },
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
						position: 'Backend Development',
						summary: [],
						points: [
							setHighlightText(
								'Mengembangkan Dashboard Eksekutif LRT dan Middleware API Digitax yang krusial bagi Direktorat Jenderal Pajak, menggunakan stack Express.js, Nest.js, dan PostgreSQL untuk menjamin stabilitas dan integritas data.',
								['Dashboard Eksekutif LRT', 'Middleware API Digitax'],
							),
							setHighlightText(
								'Mengoptimalkan lebih dari 10 endpoint API kritis dengan agregasi data kompleks, memastikan sinkronisasi data yang lancar dan cepat antara layanan backend dan aplikasi klien.',
								['lebih dari 10 endpoint API kritis'],
							),
							setHighlightText(
								'Mengimplementasikan sistem autentikasi JWT yang aman serta layanan pemrosesan PDF berkapasitas tinggi yang mampu menangani operasi simultan untuk 90+ fail.',
								['autentikasi JWT'],
							),
							setHighlightText(
								'Menetapkan standar dokumentasi API menggunakan Swagger, yang berhasil mempercepat proses integrasi frontend hingga 80%.',
								['Menetapkan standar dokumentasi API'],
							),
							setHighlightText(
								'Berkolaborasi erat dengan tim QA dan engineer frontend untuk mengefisienkan proses debugging, mengurangi waktu perbaikan bug hingga 90% melalui komunikasi yang efektif.',
								['tim QA dan engineer frontend', 'mengurangi waktu perbaikan bug hingga 90%'],
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
								'Memimpin pembaruan frontend aplikasi CEISA 4.0 Bea Cukai, menghadirkan 2 modul fungsional inti dan mengintegrasikan layanan API RESTful yang kompleks.',
								['aplikasi CEISA 4.0 Bea Cukai'],
							),
							setHighlightText(
								'Meningkatkan kecepatan pengembangan UI sebesar 60% melalui penerapan strategis library komponen React Ant Design pada lebih dari 10 halaman responsif.',
								['React Ant Design'],
							),
							setHighlightText(
								'Mengoptimalkan alur kerja pelacakan isu menggunakan Git dan Jira, yang mengurangi waktu tunggu penyelesaian bug sebesar 70%.',
								['Mengoptimalkan alur kerja pelacakan isu'],
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
								'Merancang dan men-deploy Platform Diagnostik Bahasa yang komprehensif berbasis Next.js dan MongoDB, mendukung 15+ endpoint RESTful dengan antarmuka yang intuitif dan responsif.',
								['Platform Diagnostik Bahasa'],
							),
							setHighlightText(
								'Mengintegrasikan sistem email otomatis dan gerbang pembayaran aman, yang secara signifikan meningkatkan keterlibatan dan retensi pengguna.',
								['gerbang pembayaran aman'],
							),
							setHighlightText(
								'Mengelola pengembangan fitur secara end-to-end dalam lingkungan kerja remote, memanfaatkan Git dan Discord untuk memastikan kesesuaian dengan milestone dan timeline proyek.',
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
								'Memodernisasi sistem Pengarsipan Data Karyawan untuk 500+ staf dengan solusi MERN stack, meningkatkan efisiensi pencarian data sebesar 60%.',
								['Pengarsipan Data Karyawan', 'MERN stack'],
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
		title: 'Teknologi & Stack',
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
		header: 'Portofolio',
		title: 'Karya Terpilih',
		subtitle: 'Koleksi aplikasi skala produksi, API handal, dan eksperimen inovatif yang dibangun dengan teknologi web modern.',
		projects: [
			{
				icon: tabler.IconShieldCheck,
				name: 'CEISA 4.0 (Modul Perizinan)',
				summary: [
					setHighlightText(
						'Aplikasi web skala enterprise untuk Direktorat Jenderal Bea dan Cukai. Dirancang untuk menyederhanakan integrasi bisnis yang kompleks dan memfasilitasi kolaborasi pengguna melalui arsitektur API RESTful yang kokoh.',
						['Direktorat Jenderal Bea dan Cukai', 'integrasi bisnis', 'API RESTful'],
					),
					setHighlightText(
						'Fitur utama mencakup manajemen registrasi cukai, penerbitan NPPBKC, pelimpahan kuasa, serta alur kerja penjadwalan pembayaran otomatis.',
						['penerbitan NPPBKC', 'pelimpahan kuasa', 'penjadwalan pembayaran otomatis'],
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
						alt: 'Halaman Login',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039370/Portfolio/Ceisa/browse-nppbkc',
						alt: 'Direktori NPPBKC',
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
						alt: 'Golongan Cukai',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724039371/Portfolio/Ceisa/pembayaran-penundaan',
						alt: 'Pembayaran Ditangguhkan',
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
						'Platform diagnostik komprehensif untuk mengukur kemampuan bahasa. Dilengkapi lingkungan tes yang aman, sistem sertifikasi otomatis, dan modul penilaian premium.',
						['Platform diagnostik', 'sertifikasi otomatis', 'modul penilaian premium'],
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
						alt: 'Halaman Ujian',
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
						'Platform manajemen SDM yang skalabel untuk optimalisasi siklus kerja karyawan. Fitur mencakup sinkronisasi data real-time, pemrosesan mutasi otomatis, manajemen cuti, serta visualisasi struktur organisasi (Cabang, Divisi, Jabatan).',
						['Platform manajemen SDM', 'sinkronisasi data real-time', 'visualisasi struktur organisasi'],
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
						alt: 'Dashboard Utama',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629449/Portfolio/Stafflab/tambah-pegawai',
						alt: 'Tambah Karyawan',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629450/Portfolio/Stafflab/pegawai',
						alt: 'Data Karyawan',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629450/Portfolio/Stafflab/tambah-mutasi',
						alt: 'Buat Mutasi',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629450/Portfolio/Stafflab/proses-mutasi',
						alt: 'Proses Mutasi',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1723629450/Portfolio/Stafflab/riwayat-mutasi',
						alt: 'Riwayat Mutasi',
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
						description: 'Lulus dengan Pujian (Summa Cum Laude)',
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
						'Menyelesaikan program intensif 400+ jam yang berfokus pada arsitektur MERN stack dan metodologi pengembangan software Agile.',
						['arsitektur MERN stack', 'metodologi pengembangan software Agile'],
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
			'Terbuka untuk diskusi proyek, tantangan teknis, atau peluang kolaborasi. Jangan ragu untuk menghubungi saya guna mengeksplorasi solusi digital yang dapat kita bangun bersama.',
		formTitle: 'Mulai Percakapan',
		form: [
			{
				label: 'Nama Lengkap',
				name: 'fullName',
				type: 'text',
				placeholder: 'Nama lengkap Anda',
			},
			{
				label: 'Alamat Email',
				name: 'email',
				type: 'email',
				placeholder: 'Alamat email aktif',
			},
			{
				label: 'Nomor Telepon',
				name: 'telephone',
				type: 'tel',
				placeholder: 'Nomor yang dapat dihubungi',
			},
			{
				label: 'Subjek',
				name: 'subject',
				type: 'text',
				placeholder: 'Topik diskusi',
			},
			{
				label: 'Pesan',
				name: 'message',
				type: 'textarea',
				placeholder: 'Bagaimana saya bisa membantu?',
			},
		],
		submitButton: 'Kirim Pesan',
		successMessage: 'Pesan berhasil dikirim!',
		sendAnotherMessage: 'Kirim pesan lain',
		reachMeDirectly: 'Hubungi secara langsung',
	},

	footer: {
		copyright: '© {year} Irfandi Iqbal Abimanyu.',
		builtWith: 'Dibuat dengan presisi.',
	},

	common: {
		viewMore: 'Lihat Detail',
		liveDemo: 'Demo Langsung',
		downloadResume: 'Unduh Resume',
		source: 'Kode Sumber',
		internal: 'Proyek Internal',
		portfolioCategories: [
			{ label: 'Semua', value: 'all' },
			{ label: 'Frontend', value: 'frontend' },
			{ label: 'Backend', value: 'backend' },
			{ label: 'Fullstack', value: 'fullstack' },
		],
	},
};
