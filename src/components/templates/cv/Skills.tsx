import { useTranslation } from 'react-i18next';
import { capitalize } from '@/utils/string.utils';

import type { MergeUnion } from '@/utils/types';
import type { Skills } from '@/utils/types';

import { Text, View } from '@react-pdf/renderer';
import styles from '@/components/templates/styles';

export default function Skills() {
	const { t } = useTranslation();

	const { title, ...skills }: MergeUnion<Skills> = t('portfolio.skills', { returnObjects: true });

	return (
		<View style={{ gap: '10px' }}>
			<View style={{ gap: '5px' }}>
				<Text style={[styles.bold, { fontSize: '12px' }]}>{title.toUpperCase()}</Text>
				<View style={styles.horizontalDivider} />
			</View>
			<View>
				{Object.keys(skills).map((skill) => (
					<View key={skill} style={{ flexDirection: 'row', gap: '5px' }}>
						<Text style={[styles.text, styles.bold, { width: '50px' }]}>{capitalize(skill)}</Text>
						<Text style={[styles.text, { width: '2px' }]}>:</Text>
						<View style={{ flexDirection: 'row', width: '100%' }}>
							<Text style={[styles.text, styles.italic]}>
								{skills[skill as keyof Omit<MergeUnion<Skills>, 'title'>]
									.sort((a, b) => a.localeCompare(b))
									.map((skill, i, arr) => `${capitalize(skill)}${arr.length - 1 !== i ? ', ' : ''}`)}
							</Text>
						</View>
					</View>
				))}
			</View>
		</View>
	);
}
