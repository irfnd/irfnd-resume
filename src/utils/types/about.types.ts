export type About = {
	title: string;
	profile: { url: string; alt: string };
	name: string;
	aboutMe: string[];
	headline: string;
	location: string;
	socialMedia: Record<string, string>;
};
