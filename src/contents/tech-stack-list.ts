import type { ITechStack } from '@/types';
import * as TechIcons from '@icons-pack/react-simple-icons';

const TechStackList = [
	{
		label: 'JavaScript',
		url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
		icon: TechIcons.SiJavascript,
		color: TechIcons.SiJavascriptHex,
	},
	{
		label: 'TypeScript',
		url: 'https://www.typescriptlang.org/',
		icon: TechIcons.SiTypescript,
		color: TechIcons.SiTypescriptHex,
	},
	{
		label: 'Python',
		url: 'https://www.python.org/',
		icon: TechIcons.SiPython,
		color: TechIcons.SiPythonHex,
	},
	{
		label: 'Go',
		url: 'https://golang.org/',
		icon: TechIcons.SiGo,
		color: TechIcons.SiGoHex,
	},
	{
		label: 'Alpine.js',
		url: 'https://alpinejs.dev/',
		icon: TechIcons.SiAlpinedotjs,
		color: TechIcons.SiAlpinedotjsHex,
	},
	{
		label: 'React',
		url: 'https://reactjs.org/',
		icon: TechIcons.SiReact,
		color: TechIcons.SiReactHex,
	},
	{
		label: 'Vue.js',
		url: 'https://vuejs.org/',
		icon: TechIcons.SiVuedotjs,
		color: TechIcons.SiVuedotjsHex,
	},
	{
		label: 'Next.js',
		url: 'https://nextjs.org/',
		icon: TechIcons.SiNextdotjs,
		color:
			'fill-neutral-500 group-hover:fill-black group-data-active:fill-black dark:group-hover:fill-white dark:group-data-active:fill-white',
		border: `hover:border-black/50 dark:hover:border-white/50`,
		customColor: true,
	},
	{
		label: 'Express.js',
		url: 'https://expressjs.com/',
		icon: TechIcons.SiExpress,
		color:
			'fill-neutral-500 group-hover:fill-black group-data-active:fill-black dark:group-hover:fill-white dark:group-data-active:fill-white',
		border: `hover:border-black/50 dark:hover:border-white/50`,
		customColor: true,
	},
	{
		label: 'NestJS',
		url: 'https://nestjs.com/',
		icon: TechIcons.SiNestjs,
		color: TechIcons.SiNestjsHex,
	},
	{
		label: 'Flask',
		url: 'https://flask.palletsprojects.com/',
		icon: TechIcons.SiFlask,
		color: TechIcons.SiFlaskHex,
	},
	{
		label: 'Django',
		url: 'https://www.djangoproject.com/',
		icon: TechIcons.SiDjango,
		color: TechIcons.SiDjangoHex,
	},
	{
		label: 'Tailwind CSS',
		url: 'https://tailwindcss.com/',
		icon: TechIcons.SiTailwindcss,
		color: TechIcons.SiTailwindcssHex,
	},
	{
		label: 'Shadcn UI',
		url: 'https://ui.shadcn.com/',
		icon: TechIcons.SiShadcnui,
		color:
			'fill-neutral-500 group-hover:fill-black group-data-active:fill-black dark:group-hover:fill-white dark:group-data-active:fill-white',
		border: `hover:border-black/50 dark:hover:border-white/50`,
		customColor: true,
	},
	{
		label: 'Ant Design',
		url: 'https://ant.design/',
		icon: TechIcons.SiAntdesign,
		color: TechIcons.SiAntdesignHex,
	},
	{
		label: 'Material UI',
		url: 'https://mui.com/',
		icon: TechIcons.SiMui,
		color: TechIcons.SiMuiHex,
	},
	{
		label: 'Chakra UI',
		url: 'https://chakra-ui.com/',
		icon: TechIcons.SiChakraui,
		color: TechIcons.SiChakrauiHex,
	},
	{
		label: 'PostgreSQL',
		url: 'https://www.postgresql.org/',
		icon: TechIcons.SiPostgresql,
		color: TechIcons.SiPostgresqlHex,
	},
	{
		label: 'MongoDB',
		url: 'https://www.mongodb.com/',
		icon: TechIcons.SiMongodb,
		color: TechIcons.SiMongodbHex,
	},
	{
		label: 'Redis',
		url: 'https://redis.io/',
		icon: TechIcons.SiRedis,
		color: TechIcons.SiRedisHex,
	},
	{
		label: 'Firebase',
		url: 'https://firebase.google.com/',
		icon: TechIcons.SiFirebase,
		color: TechIcons.SiFirebaseHex,
	},
	{
		label: 'Supabase',
		url: 'https://supabase.com/',
		icon: TechIcons.SiSupabase,
		color: TechIcons.SiSupabaseHex,
	},
	{
		label: 'GraphQL',
		url: 'https://graphql.org/',
		icon: TechIcons.SiGraphql,
		color: TechIcons.SiGraphqlHex,
	},
	{
		label: 'Docker',
		url: 'https://www.docker.com/',
		icon: TechIcons.SiDocker,
		color: TechIcons.SiDockerHex,
	},
	{
		label: 'Linux',
		url: 'https://www.linux.org/',
		icon: TechIcons.SiLinux,
		color: TechIcons.SiLinuxHex,
	},
	{
		label: 'Swagger',
		url: 'https://swagger.io/',
		icon: TechIcons.SiSwagger,
		color: TechIcons.SiSwaggerHex,
	},
	{
		label: 'Redux',
		url: 'https://redux.js.org/',
		icon: TechIcons.SiRedux,
		color: TechIcons.SiReduxHex,
	},
] as const satisfies readonly ITechStack[];

type TechStackLabel = (typeof TechStackList)[number]['label'];
type SelectedTechStack<T extends TechStackLabel> = Extract<(typeof TechStackList)[number], { label: T }>;

export function getTechStack<T extends TechStackLabel>(keys: T[]): SelectedTechStack<T>[] {
	return TechStackList.filter((tech): tech is SelectedTechStack<T> => (keys as readonly string[]).includes(tech.label));
}
