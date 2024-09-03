import { Document, Page } from '@react-pdf/renderer';

import Educations from '@/components/templates/cv/Educations';
import Header from '@/components/templates/cv/Header';
import Projects from '@/components/templates/cv/Projects';
import Skills from '@/components/templates/cv/Skills';
import Works from '@/components/templates/cv/Works';
import styles from '@/components/templates/styles';

export default function CV() {
	return (
		<Document>
			<Page size='A4' style={[styles.page, { gap: '15px' }]}>
				<Header />
				<Works />
				<Educations />
				<Skills />
				<Projects />
			</Page>
		</Document>
	);
}
