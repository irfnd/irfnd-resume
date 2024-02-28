export type Works = {
	title: string;
	list: {
		company: string;
		link: string | null;
		position: string;
		location: string;
		duration: string[];
		descriptions: string[] | null;
		points: string[] | null;
	}[];
};
