import type { ITechStack } from '@/types';
import * as logo from '@icons-pack/react-simple-icons';

const TechStackList = [
	{
		label: 'JavaScript',
		url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
		icon: logo.SiJavascript,
		color: logo.SiJavascriptHex,
	},
	{
		label: 'TypeScript',
		url: 'https://www.typescriptlang.org/',
		icon: logo.SiTypescript,
		color: logo.SiTypescriptHex,
	},
	{
		label: 'Pyhton',
		url: 'https://www.python.org/',
		icon: logo.SiPython,
		color: logo.SiPythonHex,
	},
	{
		label: 'Go',
		url: 'https://golang.org/',
		icon: logo.SiGo,
		color: logo.SiGoHex,
	},
	{
		label: 'Alpine.js',
		url: 'https://alpinejs.dev/',
		icon: logo.SiAlpinedotjs,
		color: logo.SiAlpinedotjsHex,
	},
	{
		label: 'React',
		url: 'https://reactjs.org/',
		icon: logo.SiReact,
		color: logo.SiReactHex,
	},
	{
		label: 'Vue.js',
		url: 'https://vuejs.org/',
		icon: logo.SiVuedotjs,
		color: logo.SiVuedotjsHex,
	},
	{
		label: 'Next.js',
		url: 'https://nextjs.org/',
		icon: logo.SiNextdotjs,
		color: 'fill-neutral-500 group-hover:fill-black dark:group-hover:fill-white',
		border: `hover:border-black/50 dark:hover:border-white/50`,
		customColor: true,
	},
	{
		label: 'Express.js',
		url: 'https://expressjs.com/',
		icon: logo.SiExpress,
		color: 'fill-neutral-500 group-hover:fill-black dark:group-hover:fill-white',
		border: `hover:border-black/50 dark:hover:border-white/50`,
		customColor: true,
	},
	{
		label: 'NestJS',
		url: 'https://nestjs.com/',
		icon: logo.SiNestjs,
		color: logo.SiNestjsHex,
	},
	{
		label: 'Flask',
		url: 'https://flask.palletsprojects.com/',
		icon: logo.SiFlask,
		color: logo.SiFlaskHex,
	},
	{
		label: 'Django',
		url: 'https://www.djangoproject.com/',
		icon: logo.SiDjango,
		color: logo.SiDjangoHex,
	},
	{
		label: 'Tailwind CSS',
		url: 'https://tailwindcss.com/',
		icon: logo.SiTailwindcss,
		color: logo.SiTailwindcssHex,
	},
	{
		label: 'Shadcn UI',
		url: 'https://ui.shadcn.com/',
		icon: logo.SiShadcnui,
		color: 'fill-neutral-500 group-hover:fill-black dark:group-hover:fill-white',
		border: `hover:border-black/50 dark:hover:border-white/50`,
		customColor: true,
	},
	{
		label: 'Ant Design',
		url: 'https://ant.design/',
		icon: logo.SiAntdesign,
		color: logo.SiAntdesignHex,
	},
	{
		label: 'Material UI',
		url: 'https://mui.com/',
		icon: logo.SiMui,
		color: logo.SiMuiHex,
	},
	{
		label: 'Chakra UI',
		url: 'https://chakra-ui.com/',
		icon: logo.SiChakraui,
		color: logo.SiChakrauiHex,
	},
	{
		label: 'PostgreSQL',
		url: 'https://www.postgresql.org/',
		icon: logo.SiPostgresql,
		color: logo.SiPostgresqlHex,
	},
	{
		label: 'MongoDB',
		url: 'https://www.mongodb.com/',
		icon: logo.SiMongodb,
		color: logo.SiMongodbHex,
	},
	{
		label: 'Redis',
		url: 'https://redis.io/',
		icon: logo.SiRedis,
		color: logo.SiRedisHex,
	},
	{
		label: 'Firebase',
		url: 'https://firebase.google.com/',
		icon: logo.SiFirebase,
		color: logo.SiFirebaseHex,
	},
	{
		label: 'Supabase',
		url: 'https://supabase.com/',
		icon: logo.SiSupabase,
		color: logo.SiSupabaseHex,
	},
	{
		label: 'GraphQL',
		url: 'https://graphql.org/',
		icon: logo.SiGraphql,
		color: logo.SiGraphqlHex,
	},
	{
		label: 'Docker',
		url: 'https://www.docker.com/',
		icon: logo.SiDocker,
		color: logo.SiDockerHex,
	},
	{
		label: 'Linux',
		url: 'https://www.linux.org/',
		icon: logo.SiLinux,
		color: logo.SiLinuxHex,
	},
	{
		label: 'Swagger',
		url: 'https://swagger.io/',
		icon: logo.SiSwagger,
		color: logo.SiSwaggerHex,
	},
	{
		label: 'Redux',
		url: 'https://redux.js.org/',
		icon: logo.SiRedux,
		color: logo.SiReduxHex,
	},
] as const satisfies readonly ITechStack[];

type TechStackLabel = (typeof TechStackList)[number]['label'];
type SelectedTechStack<T extends TechStackLabel> = Extract<(typeof TechStackList)[number], { label: T }>;

export function getTechStack<T extends TechStackLabel>(keys: T[]): SelectedTechStack<T>[] {
	return TechStackList.filter((tech): tech is SelectedTechStack<T> => (keys as readonly string[]).includes(tech.label));
}
