import * as React from 'react';
import { useTranslation } from 'react-i18next';

import type { About } from '@/utils/types';

import { Link, Text, View } from '@react-pdf/renderer';
import styles from '@/components/templates/styles';

export default function Header() {
	const { t } = useTranslation();

	const name: About['name'] = t('portfolio.about.name');
	const location: About['location'] = t('portfolio.about.location');
	const socialMedia: About['socialMedia'] = t('portfolio.about.socialMedia', { returnObjects: true });

	const formatContact = (name: string, contact: string) => {
		if (name === 'email') return contact.replace('mailto:', '');
		if (name === 'linkedIn') return contact.replace('https://www.', '');
		if (name === 'github') return contact.replace('https://', '');
		return contact;
	};

	return (
		<View style={{ alignItems: 'flex-start' }}>
			<Text style={[styles.bold, { fontSize: '16px' }]}>{name.toUpperCase()}</Text>
			<View style={{ flexDirection: 'row', gap: '5px' }}>
				<Text style={styles.text}>{location}</Text>
				{Object.keys(socialMedia).map((name, i) =>
					['email', 'linkedIn', 'github'].includes(name) ? (
						<React.Fragment key={i}>
							<View style={styles.verticalDivider} />
							<Link src={socialMedia[name]} style={[styles.text, styles.link]}>
								{formatContact(name, socialMedia[name])}
							</Link>
						</React.Fragment>
					) : null
				)}
			</View>
		</View>
	);
}
