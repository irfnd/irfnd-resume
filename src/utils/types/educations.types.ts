export type Educations = {
	title: string;
	list: {
		institution: string;
		link: string | null;
		major: string;
		location: string;
		duration: string[];
		descriptions: string[] | null;
		points: string[] | null;
	}[];
};
