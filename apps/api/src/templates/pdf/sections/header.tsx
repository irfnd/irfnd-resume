import type { ContactData, ProfileData } from '@irfnd/data';
import { Link, Text, View } from '@react-pdf/renderer';
import * as React from 'react';

import { styles } from '@/templates/pdf/styles';

interface HeaderSectionProps {
	profile: ProfileData;
	contact: ContactData;
}

function formatUrl(url: string) {
	return url.replace('mailto:', '').replace('https://www.', '').replace('https://', '').replace(/\/$/, '');
}

export function HeaderSection({ profile, contact }: HeaderSectionProps) {
	const name = `${profile.firstName} ${profile.lastName}`;
	const resumeItems = contact.items.filter((c) => c.showInResume);
	const location = resumeItems.find((c) => c.type === 'location');
	const resumeLinks = resumeItems.filter((c) => c.type !== 'location');

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
