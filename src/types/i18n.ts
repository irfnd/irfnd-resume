import type { IconType } from '@icons-pack/react-simple-icons';
import type { TablerIcon } from '@tabler/icons-react';
import type { HTMLInputTypeAttribute } from 'react';

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
	icon: IconType;
	color?: string;
	border?: string;
	customColor?: boolean;
}

export interface IAward {
	label: string;
	description: string;
	icon: TablerIcon;
}

export interface INavigation {
	label: string;
	url: string;
	icon: TablerIcon;
}

export interface IContact {
	type: 'location' | 'contact';
	label: string;
	url: string;
	icon: TablerIcon;
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
		icon: TablerIcon;
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
			icon?: TablerIcon;
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
		icon: TablerIcon;
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

interface IFormField {
	label: string;
	name: string;
	type: HTMLInputTypeAttribute;
	placeholder: string;
}

export interface IContactMe {
	header: string;
	description: string;
	formTitle: string;
	form: IFormField[];
	submitButton: string;
	successMessage: string;
	sendAnotherMessage: string;
	reachMeDirectly: string;
}

export interface IFooter {
	copyright: string;
	builtWith: string;
}

export interface ICommon {
	viewMore: string;
	liveDemo: string;
	downloadResume: string;
	source: string;
	internal: string;
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

export interface I18nContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: Translations;
}
