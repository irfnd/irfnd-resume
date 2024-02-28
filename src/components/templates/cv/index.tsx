import { Document, Page } from '@react-pdf/renderer';
import styles from '@/components/templates/styles';
import Header from '@/components/templates/cv/Header';
import Works from '@/components/templates/cv/Works';
import Educations from '@/components/templates/cv/Educations';
import Projects from '@/components/templates/cv/Projects';
import Skills from '@/components/templates/cv/Skills';

export default function CV() {
	return (
		<Document>
			<Page size='A4' style={[styles.page, { gap: '15px' }]}>
				<Header />
				<Works />
				<Educations />
				<Projects />
				<Skills />
			</Page>
		</Document>
	);
}
