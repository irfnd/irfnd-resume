import type { IContact, IProfile } from '@/types';
import { Link, Text, View } from '@react-pdf/renderer';
import * as React from 'react';

import { styles } from '@/components/pdf/styles';

interface HeaderSectionProps {
	profile: IProfile;
	contact: IContact[];
}

function formatUrl(url: string) {
	return url.replace('mailto:', '').replace('https://www.', '').replace('https://', '');
}

export function HeaderSection({ profile, contact }: HeaderSectionProps) {
	const name = `${profile.firstName} ${profile.lastName}`;
	const location = contact.find((c) => c.type === 'location');
	const resumeLinks = contact.filter(
		(c) => c.url.includes('mailto:') || c.url.includes('linkedin.com') || c.url.includes('github.com'),
	);

	return (
		<View style={{ alignItems: 'flex-start' }}>
			<Text style={[styles.bold, { fontSize: 16 }]}>{name.toUpperCase()}</Text>
			<Text style={[styles.text, styles.italic, { marginBottom: 2 }]}>{profile.role}</Text>
			<View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
				{location && <Text style={styles.text}>{location.label}</Text>}
				{resumeLinks.map((item, i) => (
					<React.Fragment key={i}>
						<Text style={styles.text}>|</Text>
						<Link src={item.url} style={[styles.text, styles.link]}>
							{formatUrl(item.url)}
						</Link>
					</React.Fragment>
				))}
			</View>
		</View>
	);
}
