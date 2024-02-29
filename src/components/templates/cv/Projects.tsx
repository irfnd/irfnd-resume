import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from '@/utils/string.utils';

import type { Projects } from '@/utils/types';

import { Link, Text, View } from '@react-pdf/renderer';
import styles from '@/components/templates/styles';

export default function Projects() {
	const { t, i18n } = useTranslation();

	const title: Projects['title'] = t('portfolio.projects.title');
	const projects: Projects['list'] = t('portfolio.projects.list', { returnObjects: true });
	const techText = i18n.language === 'en' ? 'Technologies' : 'Teknologi';
	const isDemo = i18n.language === 'en' ? 'See Demo' : 'Lihat Demo';
	const notDemo = i18n.language === 'en' ? 'Source Code' : 'Lihat Source Code';

	return (
		<View style={{ gap: '10px' }} break>
			<View style={{ gap: '5px' }}>
				<Text style={[styles.bold, { fontSize: '12px' }]}>{title.toUpperCase()}</Text>
				<View style={styles.horizontalDivider} />
			</View>
			{projects.map((project, i) => (
				<View key={i} style={{ flexDirection: 'row', gap: '5px' }} wrap={false}>
					<View>
						<View style={{ flexDirection: 'row' }}>
							{project.links?.demo ? (
								<Link src={project.links.demo} style={[styles.text, styles.bold, styles.link]}>
									{project.projectName.toUpperCase()}
								</Link>
							) : (
								<Text style={[styles.text, styles.bold, styles.link]}>{project.projectName.toUpperCase()}</Text>
							)}
						</View>
						{project.descriptions ? (
							<View>
								{project.descriptions.map((desc, i) =>
									i === 0 ? (
										<Text key={i} style={[styles.text, { textAlign: 'justify' }]}>
											{desc}
										</Text>
									) : null
								)}
							</View>
						) : null}
						{project.relatedSkills ? (
							<View style={{ flexDirection: 'row' }}>
								<Text style={styles.text}>{techText}: </Text>
								<Text style={[styles.text, styles.italic]}>
									{project.relatedSkills
										.sort((a, b) => a.localeCompare(b))
										.map((skill, i, arr) => `${capitalize(skill)}${arr.length - 1 !== i ? ', ' : ''}`)}
								</Text>
							</View>
						) : null}
						{project.links ? (
							<View style={{ flexDirection: 'row', gap: '5px' }}>
								{Object.keys(project.links).map((linkKey, i, arr) => (
									<React.Fragment key={i}>
										<Link src={project.links[linkKey]} style={[styles.text, { color: '#000' }]}>
											{linkKey === 'demo' ? isDemo : notDemo}
										</Link>
										{arr.length - 1 !== i ? <View style={styles.verticalDivider} /> : null}
									</React.Fragment>
								))}
							</View>
						) : null}
					</View>
				</View>
			))}
		</View>
	);
}
