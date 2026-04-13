import type { I18nData } from '../helpers';
import type { ProfileData } from '../schemas/profile';

export const profile: I18nData<ProfileData> = {
	en: {
		firstName: 'Irfandi',
		lastName: 'Iqbal Abimanyu',
		photo: {
			url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1722509145/Portfolio/Profile/irfnd-inovative',
			alt: 'Irfandi Photo Profile',
		},
		role: 'Fullstack Web Developer',
		description: 'Results-driven Fullstack Developer specializing in scalable web architectures. Proven expertise in building robust backend systems and crafting high-fidelity, user-centric frontend interfaces.',
	},
	id: {
		firstName: 'Irfandi',
		lastName: 'Iqbal Abimanyu',
		photo: {
			url: 'https://res.cloudinary.com/dhghodtvv/image/upload/f_auto,q_auto/v1722509145/Portfolio/Profile/irfnd-inovative',
			alt: 'Foto Profil Irfandi',
		},
		role: 'Fullstack Web Developer',
		description: 'Fullstack Developer berorientasi hasil dengan spesialisasi pada arsitektur web skalabel. Berpengalaman membangun sistem backend yang robust serta merancang antarmuka frontend presisi tinggi yang mengutamakan pengalaman pengguna.',
	},
};