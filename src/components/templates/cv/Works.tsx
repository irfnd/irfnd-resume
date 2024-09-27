import { useTranslation } from 'react-i18next';

import type { Works } from '@/utils/types';

import styles from '@/components/templates/styles';
import { Link, Text, View } from '@react-pdf/renderer';

export default function Works() {
	const { t } = useTranslation();

	const title: Works['title'] = t('portfolio.works.title');
	const works: Works['list'] = t('portfolio.works.list', { returnObjects: true });

	return (
		<View style={{ gap: '10px' }}>
			<View style={{ gap: '4px' }}>
				<Text style={[styles.bold, { fontSize: '12px' }]}>{title.toUpperCase()}</Text>
				<View style={styles.horizontalDivider} />
			</View>

			{works.map((work, index) => (
				<View key={index}>
					{work.descriptions.map((item, i) => (
						<View key={i} style={{ marginBottom: i === 0 ? '4px' : 0 }}>
							<View style={{ marginBottom: '4px' }}>
								{i === 0 ? (
									<View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
										{work.link ? (
											<Link src={work.link} style={[styles.text, styles.bold, styles.link]}>
												{work.company.toUpperCase()}
											</Link>
										) : (
											<Text style={[styles.text, styles.bold, styles.link]}>{work.company.toUpperCase()}</Text>
										)}
										<Text style={[styles.text, styles.italic]}>{item.duration.join(' - ')}</Text>
									</View>
								) : null}
								<View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
									<Text style={[styles.text, styles.bold]}>{item.position}</Text>
									{i === 0 ? (
										<Text style={[styles.text, styles.italic]}>{work.location}</Text>
									) : (
										<Text style={[styles.text, styles.italic]}>{item.duration.join(' - ')}</Text>
									)}
								</View>
							</View>

							{item.shortDesc ? (
								<View style={{ width: '100%' }}>
									{item.shortDesc.map((desc, i) => (
										<Text key={i} style={[styles.text, { textAlign: 'justify' }]}>
											{desc}
										</Text>
									))}
								</View>
							) : null}

							{item.points ? (
								<View style={{ width: '100%' }}>
									{item.points.map((point, i) => (
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
			))}
		</View>
	);
}
