import type { IEducation } from '@/types';
import { Link, Text, View } from '@react-pdf/renderer';

import { styles } from '@/components/pdf/styles';
import { resolveText } from '@/components/pdf/utils';

interface EducationSectionProps {
	education: IEducation;
}

export function EducationSection({ education }: EducationSectionProps) {
	return (
		<View style={{ gap: 10 }}>
			<View style={{ gap: 4 }}>
				<Text style={[styles.bold, { fontSize: 12 }]}>{education.title.toUpperCase()}</Text>
				<View style={styles.dividerH} />
			</View>

			{education.educations.map((edu, i) => (
				<View key={i} style={{ gap: 2 }}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						{edu.link ? (
							<Link src={edu.link} style={[styles.text, styles.bold, styles.link]}>
								{edu.institution.toUpperCase()}
							</Link>
						) : (
							<Text style={[styles.text, styles.bold]}>{edu.institution.toUpperCase()}</Text>
						)}
						<Text style={[styles.text, styles.italic]}>{edu.duration.join(' – ')}</Text>
					</View>

					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text style={[styles.text, styles.bold]}>
							{edu.degree} · {edu.fieldOfStudy}
						</Text>
						<Text style={[styles.text, styles.italic]}>{edu.location}</Text>
					</View>

					{edu.summary.length > 0 && (
						<View>
							{edu.summary.map((s, j) => (
								<Text key={j} style={[styles.text, { textAlign: 'justify' }]}>
									{resolveText(s)}
								</Text>
							))}
						</View>
					)}

					{edu.points.length > 0 && (
						<View>
							{edu.points.map((point, j) => (
								<View key={j} style={{ flexDirection: 'row' }}>
									<Text style={[styles.text, { width: '2%' }]}>•</Text>
									<Text style={[styles.text, { width: '98%', textAlign: 'justify' }]}>{resolveText(point)}</Text>
								</View>
							))}
						</View>
					)}

					{edu.award.length > 0 && (
						<View>
							{edu.award.map((award, j) => (
								<Text key={j} style={[styles.text, styles.italic]}>
									{award.label} — {award.description}
								</Text>
							))}
						</View>
					)}
				</View>
			))}
		</View>
	);
}
