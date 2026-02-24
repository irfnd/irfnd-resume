import type { ITechnology } from '@/types';
import { Text, View } from '@react-pdf/renderer';

import { styles } from '@/components/pdf/styles';

interface SkillsSectionProps {
	technology: ITechnology;
}

export function SkillsSection({ technology }: SkillsSectionProps) {
	return (
		<View style={{ gap: 10 }} break>
			<View style={{ gap: 4 }}>
				<Text style={[styles.bold, { fontSize: 12 }]}>{technology.title.toUpperCase()}</Text>
				<View style={styles.dividerH} />
			</View>

			<View style={{ gap: 3 }}>
				{Object.entries(technology.stacks).map(([category, stacks]) => (
					<View key={category} style={{ flexDirection: 'row', gap: 5 }}>
						<Text style={[styles.text, styles.bold, { width: 130 }]}>{category}</Text>
						<Text style={[styles.text, { width: 8 }]}>:</Text>
						<Text style={[styles.text, styles.italic, { flex: 1 }]}>
							{stacks
								.map((s) => s.label)
								.sort((a, b) => a.localeCompare(b))
								.join(', ')}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
}
