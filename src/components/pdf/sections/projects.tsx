import type { IPortfolio, Language } from '@/types';
import { Link, Text, View } from '@react-pdf/renderer';
import * as React from 'react';

import { styles } from '@/components/pdf/styles';
import { resolveText } from '@/components/pdf/utils';

interface ProjectsSectionProps {
	portfolio: IPortfolio;
	language: Language;
}

export function ProjectsSection({ portfolio, language }: ProjectsSectionProps) {
	const techLabel = language === 'en' ? 'Technologies' : 'Teknologi';
	const demoLabel = language === 'en' ? 'Live Demo' : 'Lihat Demo';
	const sourceLabel = language === 'en' ? 'Source Code' : 'Lihat Source Code';

	return (
		<View style={{ gap: 10 }}>
			<View style={{ gap: 4 }}>
				<Text style={[styles.bold, { fontSize: 12 }]}>{portfolio.title.toUpperCase()}</Text>
				<View style={styles.dividerH} />
			</View>

			{portfolio.projects.map((project, i) => (
				<View key={i} style={{ gap: 2 }} wrap={false}>
					{project.demo ? (
						<Link src={project.demo} style={[styles.text, styles.bold, styles.link]}>
							{project.name.toUpperCase()}
						</Link>
					) : (
						<Text style={[styles.text, styles.bold]}>{project.name.toUpperCase()}</Text>
					)}

					{project.summary.length > 0 && (
						<Text style={[styles.text, { textAlign: 'justify' }]}>{resolveText(project.summary[0])}</Text>
					)}

					{project.stacks.length > 0 && (
						<View style={{ flexDirection: 'row', gap: 3 }}>
							<Text style={styles.text}>{techLabel}: </Text>
							<Text style={[styles.text, styles.italic]}>
								{project.stacks
									.map((s) => s.label)
									.sort((a, b) => a.localeCompare(b))
									.join(', ')}
							</Text>
						</View>
					)}

					{(project.demo || project.source) && (
						<View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
							{project.demo && (
								<React.Fragment>
									<Link src={project.demo} style={[styles.text, { color: '#000' }]}>
										{demoLabel}
									</Link>
								</React.Fragment>
							)}
							{project.demo && project.source && <View style={styles.dividerV} />}
							{project.source && (
								<Link src={project.source} style={[styles.text, { color: '#000' }]}>
									{sourceLabel}
								</Link>
							)}
						</View>
					)}
				</View>
			))}
		</View>
	);
}
