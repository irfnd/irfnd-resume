import { useTranslation } from 'react-i18next';

import type { Educations } from '@/utils/types';

import styles from '@/components/templates/styles';
import { Link, Text, View } from '@react-pdf/renderer';

export default function Educations() {
	const { t } = useTranslation();

	const title: Educations['title'] = t('portfolio.educations.title');
	const educations: Educations['list'] = t('portfolio.educations.list', { returnObjects: true });

	return (
		<View style={{ gap: '10px' }}>
			<View style={{ gap: '4px' }}>
				<Text style={[styles.bold, { fontSize: '12px' }]}>{title.toUpperCase()}</Text>
				<View style={styles.horizontalDivider} />
			</View>

			{educations.map((education, i) => (
				<View key={i}>
					<View style={{ marginBottom: '4px' }}>
						<View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
							{education.link ? (
								<Link src={education.link} style={[styles.text, styles.bold, styles.link]}>
									{education.institution.toUpperCase()}
								</Link>
							) : (
								<Text style={[styles.text, styles.bold, styles.link]}>{education.institution.toUpperCase()}</Text>
							)}
							<Text style={[styles.text, styles.italic]}>{education.duration.join(' - ')}</Text>
						</View>
						<View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
							<Text style={[styles.text, styles.bold]}>{education.major}</Text>
							<Text style={[styles.text, styles.italic]}>{education.location}</Text>
						</View>
					</View>

					{education.descriptions ? (
						<View style={{ width: '100%' }}>
							{education.descriptions.map((desc, i) => (
								<Text key={i} style={[styles.text, { textAlign: 'justify' }]}>
									{desc}
								</Text>
							))}
						</View>
					) : null}

					{education.points ? (
						<View style={{ width: '100%' }}>
							{education.points.map((point, i) => (
								<View key={i} style={[styles.text, { flexDirection: 'row', width: '100%' }]}>
									<Text style={{ width: '2%' }}>•</Text>
									<Text style={{ textAlign: 'justify', width: '98%' }}>{point}</Text>
								</View>
							))}
						</View>
					) : null}
				</View>
			))}
		</View>
	);
}
