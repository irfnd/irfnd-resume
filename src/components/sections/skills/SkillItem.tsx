import type { MergeUnion } from '@/utils/types';
import type { Skills } from '@/utils/types';

import Draggable from '@/components/core/Draggable';
import { Badge } from '@/components/ui/badge';

interface ISkillItem {
	skills: Omit<MergeUnion<Skills>, 'title'>;
	skill: keyof Omit<MergeUnion<Skills>, 'title'>;
}

export default function SkillItem({ skills, skill }: ISkillItem) {
	return (
		<Draggable className='flex w-full overflow-auto scrollbar-hide gap-1'>
			{skills[skill]
				.sort((a, b) => a.localeCompare(b))
				.map((item, i) => (
					<Badge key={i}>{item}</Badge>
				))}
		</Draggable>
	);
}
