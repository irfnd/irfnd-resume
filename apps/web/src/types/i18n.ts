export type Language = 'en' | 'id';

export interface IParagraph {
	value: string;
	keywords: string[];
}

export interface IImage {
	url: string;
	alt: string;
}

export interface ITechStack {
	label: string;
	url: string;
	icon: string;
	color?: string;
	border?: string;
	customColor?: boolean;
}

export interface IAward {
	label: string;
	description: string;
	icon: string;
}

export interface INavigation {
	label: string;
	url: string;
	icon: string;
}

export interface IContact {
	type: 'location' | 'contact';
	label: string;
	url: string;
	icon: string;
	showInStickyProfile?: boolean;
	showInContactPage?: boolean;
	showInFooter?: boolean;
}

export interface IProfile {
	firstName: string;
	lastName: string;
	role: string;
	photo: IImage;
	description: string;
}

export interface IAbout {
	title: string;
	description: IParagraph[];
	focus: {
		value: string;
		label: string;
		icon: string;
	}[];
}

export interface IExperience {
	title: string;
	jobs: {
		company: string;
		mainPosition: string;
		type: string;
		location: string;
		duration: string[];
		link: string | null;
		descriptions: {
			icon?: string;
			position: string;
			summary: IParagraph[];
			points: IParagraph[];
			stacks: ITechStack[];
		}[];
	}[];
}

export interface IPortfolio {
	header: string;
	title: string;
	subtitle: string;
	projects: {
		icon: string;
		name: string;
		summary: IParagraph[];
		image: IImage[];
		type: 'private' | 'public';
		demo: string | null;
		source: string | null;
		stacks: ITechStack[];
		category: 'frontend' | 'backend' | 'fullstack';
		isSelected?: boolean;
	}[];
}

export interface ITechnology {
	title: string;
	stacks: { [categories: string]: ITechStack[] };
}

export interface IEducation {
	title: string;
	educations: {
		institution: string;
		degree: string;
		fieldOfStudy: string;
		location: string;
		duration: string[];
		link: string | null;
		summary: IParagraph[];
		points: IParagraph[];
		award: IAward[];
	}[];
}

export interface IFormField {
	label: string;
	name: string;
	type: 'text' | 'email' | 'tel' | 'textarea';
	placeholder: string;
}

export interface IContactValidation {
	fullName: { min: string; max: string };
	email: { invalid: string };
	telephone: { min: string; max: string };
	subject: { min: string; max: string };
	message: { min: string; max: string };
}

export interface IContactMe {
	header: string;
	description: string;
	formTitle: string;
	form: IFormField[];
	submitButton: string;
	submittingButton: string;
	successMessage: string;
	sendAnotherMessage: string;
	reachMeDirectly: string;
	errors: {
		rateLimited: string;
		networkError: string;
		serverError: string;
		validationError: string;
	};
	validation: IContactValidation;
}

export interface IFooter {
	copyright: string;
	builtWith: string;
}

export interface ICommon {
	viewMore: string;
	liveDemo: string;
	source: string;
	internal: string;
	technologies: string;
	changeLanguage: string;
	changeTheme: string;
	portfolioCategories: {
		label: string;
		value: string;
	}[];
}

export interface Translations {
	navigation: INavigation[];
	contact: IContact[];
	profile: IProfile;
	about: IAbout;
	experience: IExperience;
	technology: ITechnology;
	portfolio: IPortfolio;
	education: IEducation;
	contactMe: IContactMe;
	footer: IFooter;
	common: ICommon;
}

