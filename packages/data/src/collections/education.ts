import type { I18nData } from '../helpers';
import type { EducationData } from '../schemas/education';

export const education: I18nData<EducationData> = {
	en: {
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
						icon: 'tabler:award',
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
					{
						value: 'Completed a rigorous 400+ hour immersive program centered on the {0} and {1} methodologies.',
						keywords: ['MERN stack architecture', 'Agile software development'],
					},
				],
				points: [],
				award: [],
			},
		],
	},
	id: {
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
						description: 'Lulus dengan Predikat Summa Cum Laude',
						icon: 'tabler:award',
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
					{
						value: 'Menyelesaikan program immersif 400+ jam yang berfokus pada {0} dan {1} dalam pengembangan software.',
						keywords: ['arsitektur MERN stack', 'metodologi Agile'],
					},
				],
				points: [],
				award: [],
			},
		],
	},
};
