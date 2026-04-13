import { z } from 'zod';

export const technologySchema = z.object({
	title: z.string(),
	stacks: z.record(z.string(), z.array(z.string())),
});

export type TechnologyData = z.infer<typeof technologySchema>;
