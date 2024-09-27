export type Works = {
	title: string;
	list: {
		company: string;
		location: string;
		link: string | null;
		descriptions: {
			position: string;
			duration: string[];
			shortDesc: string[] | null;
			points: string[] | null;
		}[];
	}[];
};
