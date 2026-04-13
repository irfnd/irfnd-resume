import type { I18nData } from '../helpers';
import type { PortfolioData } from '../schemas/portfolio';

export const portfolio: I18nData<PortfolioData> = {
	en: {
		header: 'Portfolio',
		title: 'Selected Works',
		subtitle: 'A curated selection of production-grade applications, robust APIs, and innovative experiments engineered with modern web technologies.',
		projects: [
			{
				icon: 'tabler:shield-check',
				isSelected: true,
				name: 'CEISA 4.0 (Licensing Module)',
				summary: [
					{
						value: 'An enterprise-grade web application developed for the {0}. Designed to streamline complex {1} and facilitate seamless user collaboration via robust {2} architecture.',
						keywords: ['Directorate General of Customs and Excise', 'business integrations', 'RESTful API'],
					},
					{
						value: 'Key capabilities include comprehensive management of excise registrations, {0}, {1} delegations, and {2} workflows.',
						keywords: ['NPPBKC issuance', 'power of attorney', 'automated payment scheduling'],
					},
				],
				type: 'private',
				category: 'frontend',
				demo: null,
				source: null,
				stacks: ['JavaScript', 'React', 'Ant Design', 'Redux'],
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
				icon: 'tabler:language',
				name: 'Profdito',
				summary: [
					{
						value: 'A comprehensive {0} designed to assess multi-language proficiency. Engineered with secure testing environments, {1} systems, and {2}.',
						keywords: ['diagnostic platform', 'automated certification', 'premium assessment modules'],
					},
				],
				type: 'private',
				category: 'fullstack',
				demo: null,
				source: null,
				stacks: ['JavaScript', 'Next.js', 'Express.js', 'Chakra UI', 'MongoDB', 'Redux'],
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
				icon: 'tabler:users-group',
				name: 'StaffLab',
				summary: [
					{
						value: 'A scalable {0} for optimizing employee lifecycle operations. Features {1}, automated transfer processing, leave management, and {2} of organizational hierarchies (Branches, Divisions, Positions).',
						keywords: ['HR management platform', 'real-time data synchronization', 'dynamic visualization'],
					},
					{
						value: 'Demo Account:',
						keywords: [],
					},
					{
						value: '- Admin ({0}, {1})',
						keywords: ['admin@mail.com', 'Admin123.'],
					},
					{
						value: '- Manager ({0}, {1})',
						keywords: ['manager@mail.com', 'Manager123.'],
					},
				],
				type: 'public',
				category: 'frontend',
				demo: 'https://stafflab.irfnd.id',
				source: 'https://github.com/irfnd/fe-stafflab',
				stacks: ['JavaScript', 'React', 'Chakra UI', 'PostgreSQL', 'Supabase'],
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
			{
				icon: 'tabler:chart-bar',
				isSelected: true,
				name: 'Yellow Taxi Dashboard',
				summary: [
					{
						value: 'A data-driven {0} engineered to visualize 2014 Yellow Taxi trip records across New York City, powered by {1}. Delivers {2} encompassing trip volume, trip classifications, aggregate payments, average fare calculations, peak distance metrics, and additional KPIs.',
						keywords: ['analytics dashboard', 'NYC OpenData', '12 months of actionable insights'],
					},
					{
						value: 'Features include an interactive trip data table and {0} via {1} for granular route exploration. Supports {2} for enhanced visual comfort.',
						keywords: ['geospatial trip mapping', 'Mapbox', 'dark mode'],
					},
					{
						value: 'Demo Account:',
						keywords: [],
					},
					{
						value: '- Admin ({0}, {1})',
						keywords: ['admin@mail.com', 'YellowTaxi@2014'],
					},
				],
				type: 'public',
				category: 'fullstack',
				demo: 'https://yellow-taxi.irfnd.id',
				source: 'https://github.com/irfnd/yellow-taxi-irfnd',
				stacks: ['TypeScript', 'React', 'NestJS', 'Shadcn UI', 'Turborepo', 'Mapbox'],
				image: [
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1733300933/Portfolio/Yellow-taxi/sign-in',
						alt: 'Sign In',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1733300934/Portfolio/Yellow-taxi/dashboard',
						alt: 'Dashboard',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1733300934/Portfolio/Yellow-taxi/list-trip',
						alt: 'Trip List',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1733300934/Portfolio/Yellow-taxi/detail-trip',
						alt: 'Trip Detail',
					},
				],
			},
			{
				icon: 'tabler:box',
				name: 'Warehouse',
				summary: [
					{
						value: 'A streamlined {0} platform with comprehensive {1}, {2}, and adaptive dark mode interface. Built for efficient inventory oversight with intuitive search and filtering capabilities.',
						keywords: ['product catalog management', 'CRUD operations', 'Google OAuth authentication'],
					},
				],
				type: 'public',
				category: 'frontend',
				demo: 'https://warehouse.irfnd.id',
				source: 'https://github.com/irfnd/fe-warehouse',
				stacks: ['JavaScript', 'React', 'Chakra UI', 'Firebase'],
				image: [
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Warehouse/dashboard',
						alt: 'Dashboard',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Warehouse/login',
						alt: 'Login',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Warehouse/tambah',
						alt: 'Add Product',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Warehouse/pencarian',
						alt: 'Search Product',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Warehouse/perbarui',
						alt: 'Update Product',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Warehouse/hapus',
						alt: 'Delete Product',
					},
				],
			},
			{
				icon: 'tabler:gavel',
				isSelected: true,
				name: 'Silegal',
				summary: [
					{
						value: 'A corporate website built for Silegal, a {0} firm that helps businesses handle {1} in Indonesia. Supports the {2} — from establishing PT, PT PMA, CV, and sole proprietorships to NIB registration, health permits (BPOM), SBU/SKK certifications, and trademark protection via DJKI.',
						keywords: ['legal consultant', 'entity formation and licensing', 'full legality lifecycle'],
					},
					{
						value: 'Delivers a conversion-focused layout featuring {0}, a clear {1} section, free consultation call-to-actions, and smooth {2} across a fully responsive interface.',
						keywords: ['10+ structured service offerings', 'step-by-step workflow', 'scroll-driven animations'],
					},
				],
				type: 'public',
				category: 'frontend',
				demo: 'https://silegal.id',
				source: null,
				stacks: ['TypeScript', 'React', 'Tailwind CSS', 'Framer Motion'],
				image: [
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Silegal/home',
						alt: 'Home',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Silegal/tentang',
						alt: 'About Us',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Silegal/layanan',
						alt: 'Services',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Silegal/harga',
						alt: 'Pricing',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Silegal/kontak',
						alt: 'Contact Us',
					},
				],
			},
			{
				icon: 'tabler:book',
				name: 'Go-buks (API)',
				summary: [
					{
						value: 'A high-performance {0} engineered for book catalog management, leveraging the {1} and PostgreSQL for optimal throughput. Utilizes GORM for streamlined database operations and ships with {2} for rapid deployment.',
						keywords: ['RESTful API', 'Go Fiber framework', 'Docker containerization'],
					},
				],
				type: 'public',
				category: 'backend',
				demo: 'https://go-buks-api.irfnd.id/docs/',
				source: 'https://github.com/irfnd/go-buks',
				stacks: ['Go', 'PostgreSQL'],
				image: [
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724344677/Portfolio/Go-buks/swagger',
						alt: 'Swagger',
					},
				],
			},
		],
	},
	id: {
		header: 'Portofolio',
		title: 'Karya Terpilih',
		subtitle: 'Koleksi aplikasi skala produksi, API yang andal, dan eksperimen inovatif yang dibangun menggunakan teknologi web modern.',
		projects: [
			{
				icon: 'tabler:shield-check',
				isSelected: true,
				name: 'CEISA 4.0 (Modul Perizinan)',
				summary: [
					{
						value: 'Aplikasi web enterprise-grade untuk {0}. Dirancang untuk menyederhanakan {1} yang kompleks dan memfasilitasi kolaborasi pengguna melalui arsitektur {2} yang solid.',
						keywords: ['Direktorat Jenderal Bea dan Cukai', 'integrasi bisnis', 'API RESTful'],
					},
					{
						value: 'Kapabilitas utama mencakup manajemen registrasi cukai, {0}, {1}, serta {2}.',
						keywords: ['penerbitan NPPBKC', 'delegasi surat kuasa', 'otomatisasi alur penjadwalan pembayaran'],
					},
				],
				type: 'private',
				category: 'frontend',
				demo: null,
				source: null,
				stacks: ['JavaScript', 'React', 'Ant Design', 'Redux'],
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
						alt: 'Hubungan Entitas',
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
				icon: 'tabler:language',
				name: 'Profdito',
				summary: [
					{
						value: '{0} komprehensif untuk mengukur kemampuan multibahasa. Dilengkapi secure testing environment, sistem {1}, dan {2}.',
						keywords: ['Platform diagnostik', 'sertifikasi otomatis', 'modul asesmen premium'],
					},
				],
				type: 'private',
				category: 'fullstack',
				demo: null,
				source: null,
				stacks: ['JavaScript', 'Next.js', 'Express.js', 'Chakra UI', 'MongoDB', 'Redux'],
				image: [
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/beranda',
						alt: 'Beranda',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/register',
						alt: 'Registrasi',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/login',
						alt: 'Login',
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
						alt: 'Katalog Paket',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/detail-soal',
						alt: 'Detail Paket',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/pembayaran-soal',
						alt: 'Halaman Pembayaran',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709090789/Portfolio/Profdito/pengerjaan-soal',
						alt: 'Antarmuka Ujian',
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
				icon: 'tabler:users-group',
				name: 'StaffLab',
				summary: [
					{
						value: '{0} yang skalabel untuk mengoptimalkan siklus kerja karyawan. Fitur mencakup {1}, pemrosesan mutasi otomatis, manajemen cuti, serta {2} (Cabang, Divisi, Jabatan).',
						keywords: ['Platform manajemen SDM', 'sinkronisasi data real-time', 'visualisasi hierarki organisasi'],
					},
					{
						value: 'Akun Demo:',
						keywords: [],
					},
					{
						value: '- Admin ({0}, {1})',
						keywords: ['admin@mail.com', 'Admin123.'],
					},
					{
						value: '- Manager ({0}, {1})',
						keywords: ['manager@mail.com', 'Manager123.'],
					},
				],
				type: 'public',
				category: 'frontend',
				demo: 'https://stafflab.irfnd.id',
				source: 'https://github.com/irfnd/fe-stafflab',
				stacks: ['JavaScript', 'React', 'Chakra UI', 'PostgreSQL', 'Supabase'],
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
						alt: 'Direktori Karyawan',
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
			{
				icon: 'tabler:chart-bar',
				isSelected: true,
				name: 'Yellow Taxi Dashboard',
				summary: [
					{
						value: '{0} berbasis data yang dirancang untuk memvisualisasikan rekaman perjalanan Yellow Taxi tahun 2014 di New York City, didukung oleh {1}. Menyajikan {2} yang actionable meliputi volume perjalanan, klasifikasi trip, agregat pembayaran, kalkulasi tarif rata-rata, metrik jarak tertinggi, dan KPI tambahan.',
						keywords: ['Dashboard analitik', 'NYC OpenData', '12 bulan insight'],
					},
					{
						value: 'Dilengkapi tabel data perjalanan interaktif dan {0} rute melalui {1} untuk eksplorasi rute yang granular. Mendukung {2} untuk kenyamanan visual.',
						keywords: ['pemetaan geospasial', 'Mapbox', 'mode gelap'],
					},
					{
						value: 'Akun Demo:',
						keywords: [],
					},
					{
						value: '- Admin ({0}, {1})',
						keywords: ['admin@mail.com', 'YellowTaxi@2014'],
					},
				],
				type: 'public',
				category: 'fullstack',
				demo: 'https://yellow-taxi.irfnd.id',
				source: 'https://github.com/irfnd/yellow-taxi-irfnd',
				stacks: ['TypeScript', 'React', 'NestJS', 'Shadcn UI', 'Turborepo', 'Mapbox'],
				image: [
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1733300933/Portfolio/Yellow-taxi/sign-in',
						alt: 'Halaman Login',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1733300934/Portfolio/Yellow-taxi/dashboard',
						alt: 'Dashboard',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1733300934/Portfolio/Yellow-taxi/list-trip',
						alt: 'Daftar Perjalanan',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1733300934/Portfolio/Yellow-taxi/detail-trip',
						alt: 'Detail Perjalanan',
					},
				],
			},
			{
				icon: 'tabler:box',
				name: 'Warehouse',
				summary: [
					{
						value: 'Platform {0} yang efisien dengan {1} komprehensif, {2}, dan antarmuka mode gelap yang adaptif. Dibangun untuk pengelolaan inventaris yang optimal dengan fitur pencarian dan filtering yang intuitif.',
						keywords: ['manajemen katalog produk', 'operasi CRUD', 'autentikasi Google OAuth'],
					},
				],
				type: 'public',
				category: 'frontend',
				demo: 'https://warehouse.irfnd.id',
				source: 'https://github.com/irfnd/fe-warehouse',
				stacks: ['JavaScript', 'React', 'Chakra UI', 'Firebase'],
				image: [
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Warehouse/dashboard',
						alt: 'Dashboard',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Warehouse/login',
						alt: 'Halaman Login',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Warehouse/tambah',
						alt: 'Tambah Produk',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Warehouse/pencarian',
						alt: 'Cari Produk',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Warehouse/perbarui',
						alt: 'Perbarui Produk',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Warehouse/hapus',
						alt: 'Hapus Produk',
					},
				],
			},
			{
				icon: 'tabler:gavel',
				isSelected: true,
				name: 'Silegal',
				summary: [
					{
						value: 'Website korporat untuk Silegal, firma {0} yang membantu pelaku usaha mengurus {1} di Indonesia. Mencakup {2} — mulai dari pendirian PT, PT PMA, CV, dan usaha perseorangan hingga pengurusan NIB, perizinan kesehatan (BPOM), sertifikasi SBU/SKK, serta perlindungan merek dagang melalui DJKI.',
						keywords: ['konsultan legal', 'pendirian badan usaha dan perizinan', 'seluruh siklus legalitas'],
					},
					{
						value: 'Menghadirkan layout yang berfokus pada konversi dengan {0}, section {1} yang jelas, call-to-action konsultasi gratis, serta {2} yang halus di seluruh antarmuka responsif.',
						keywords: ['10+ katalog layanan terstruktur', 'alur kerja bertahap', 'animasi scroll-driven'],
					},
				],
				type: 'public',
				category: 'frontend',
				demo: 'https://silegal.id',
				source: null,
				stacks: ['TypeScript', 'React', 'Tailwind CSS', 'Framer Motion'],
				image: [
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Silegal/home',
						alt: 'Beranda',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Silegal/tentang',
						alt: 'Tentang Kami',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Silegal/layanan',
						alt: 'Layanan',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Silegal/harga',
						alt: 'Harga',
					},
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1709132339/Portfolio/Silegal/kontak',
						alt: 'Kontak Kami',
					},
				],
			},
			{
				icon: 'tabler:book',
				name: 'Go-buks (API)',
				summary: [
					{
						value: '{0} berperforma tinggi yang direkayasa untuk manajemen katalog buku, memanfaatkan {1} dan PostgreSQL untuk throughput optimal. Menggunakan GORM untuk operasi database yang efisien serta dilengkapi {2} untuk deployment yang cepat.',
						keywords: ['RESTful API', 'framework Go Fiber', 'containerisasi Docker'],
					},
				],
				type: 'public',
				category: 'backend',
				demo: 'https://go-buks-api.irfnd.id/docs/',
				source: 'https://github.com/irfnd/go-buks',
				stacks: ['Go', 'PostgreSQL'],
				image: [
					{
						url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1724344677/Portfolio/Go-buks/swagger',
						alt: 'Swagger',
					},
				],
			},
		],
	},
};
