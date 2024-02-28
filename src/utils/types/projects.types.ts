export type Projects = {
	title: string;
	list: {
		projectName: string;
		shortDesc: string;
		descriptions: string[];
		links: Record<string, string>;
		relatedSkills: string[] | null;
		screenshots: { url: string; alt: string }[] | null;
	}[];
};
