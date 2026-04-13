import type { TechnologyData } from '@irfnd/data';
import { Text, View } from '@react-pdf/renderer';

import { styles } from '@/templates/pdf/styles';

interface SkillsSectionProps {
	technology: TechnologyData;
}

export function SkillsSection({ technology }: SkillsSectionProps) {
	return (
		<View style={{ gap: 10 }} break>
			<View style={{ gap: 4 }}>
				<Text style={[styles.bold, { fontSize: 12 }]}>{technology.title.toUpperCase()}</Text>
				<View style={styles.dividerH} />
			</View>

			<View style={{ gap: 3 }}>
				{Object.entries(technology.stacks).map(([category, skills]) => (
					<View key={category} style={{ flexDirection: 'row', gap: 5 }}>
						<Text style={[styles.text, styles.bold, { width: 130 }]}>{category}</Text>
						<Text style={[styles.text, { width: 8 }]}>:</Text>
						<Text style={[styles.text, styles.italic, { flex: 1 }]}>
							{[...skills].sort((a, b) => a.localeCompare(b)).join(', ')}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
}
