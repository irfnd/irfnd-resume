import type { IExperience } from '@/types';
import { Link, Text, View } from '@react-pdf/renderer';

import { styles } from '@/components/pdf/styles';
import { resolveText } from '@/components/pdf/utils';

interface ExperienceSectionProps {
	experience: IExperience;
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
	return (
		<View style={{ gap: 10 }}>
			<View style={{ gap: 4 }}>
				<Text style={[styles.bold, { fontSize: 12 }]}>{experience.title.toUpperCase()}</Text>
				<View style={styles.dividerH} />
			</View>

			{experience.jobs.map((job, i) => (
				<View key={i} style={{ gap: 3 }}>
					{job.descriptions.map((desc, j) => (
						<View key={j}>
							{j === 0 && (
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
									{job.link ? (
										<Link src={job.link} style={[styles.text, styles.bold, styles.link]}>
											{job.company.toUpperCase()}
										</Link>
									) : (
										<Text style={[styles.text, styles.bold]}>{job.company.toUpperCase()}</Text>
									)}
									<Text style={[styles.text, styles.italic]}>{job.duration.join(' – ')}</Text>
								</View>
							)}
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
								<Text style={[styles.text, styles.bold]}>{desc.position}</Text>
								{j === 0 ? (
									<Text style={[styles.text, styles.italic]}>
										{job.location} · {job.type}
									</Text>
								) : (
									<Text style={[styles.text, styles.italic]}>{job.duration.join(' – ')}</Text>
								)}
							</View>

							{desc.summary.length > 0 && (
								<View>
									{desc.summary.map((s, k) => (
										<Text key={k} style={[styles.text, { textAlign: 'justify' }]}>
											{resolveText(s)}
										</Text>
									))}
								</View>
							)}

							{desc.points.length > 0 && (
								<View>
									{desc.points.map((point, k) => (
										<View key={k} style={{ flexDirection: 'row' }}>
											<Text style={[styles.text, { width: '2%' }]}>•</Text>
											<Text style={[styles.text, { width: '98%', textAlign: 'justify' }]}>{resolveText(point)}</Text>
										</View>
									))}
								</View>
							)}
						</View>
					))}
				</View>
			))}
		</View>
	);
}
