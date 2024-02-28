import { useTranslation } from 'react-i18next';

import type { Works } from '@/utils/types';

import { Link, Text, View } from '@react-pdf/renderer';
import styles from '@/components/templates/styles';

export default function Works() {
	const { t } = useTranslation();

	const title: Works['title'] = t('portfolio.works.title');
	const works: Works['list'] = t('portfolio.works.list', { returnObjects: true });

	return (
		<View style={{ gap: '10px' }}>
			<View style={{ gap: '5px' }}>
				<Text style={[styles.bold, { fontSize: '12px' }]}>{title.toUpperCase()}</Text>
				<View style={styles.horizontalDivider} />
			</View>
			{works.map((work, i) => (
				<View key={i} style={{ flexDirection: 'row' }}>
					<View style={{ width: '75%' }}>
						<View>
							<View style={{ flexDirection: 'row' }}>
								{work.link ? (
									<Link src={work.link} style={[styles.text, styles.bold, styles.link]}>
										{work.company.toUpperCase()}
									</Link>
								) : (
									<Text style={[styles.text, styles.bold, styles.link]}>{work.company.toUpperCase()}</Text>
								)}
							</View>
							<Text style={[styles.text, styles.italic]}>{work.position}</Text>
						</View>
						{work.descriptions ? (
							<View style={{ width: '100%' }}>
								{work.descriptions.map((desc, i) => (
									<Text key={i} style={[styles.text, { textAlign: 'justify' }]}>
										{desc}
									</Text>
								))}
							</View>
						) : null}
						{work.points ? (
							<View style={{ width: '100%' }}>
								{work.points.map((point, i) => (
									<View key={i} style={[styles.text, { flexDirection: 'row', width: '100%' }]}>
										<Text style={{ width: '3%' }}>•</Text>
										<Text style={{ textAlign: 'justify', width: '97%' }}>{point}</Text>
									</View>
								))}
							</View>
						) : null}
					</View>
					<View style={{ alignItems: 'flex-end', width: '25%' }}>
						<Text style={[styles.text, styles.italic]}>{work.location}</Text>
						<Text style={[styles.text, styles.italic]}>{work.duration.join(' - ')}</Text>
					</View>
				</View>
			))}
		</View>
	);
}
