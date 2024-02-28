import { Font, StyleSheet } from '@react-pdf/renderer';

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
	page: { flexDirection: 'column', backgroundColor: '#fff', paddingHorizontal: 55, paddingVertical: 40 },
	text: { fontFamily: 'Times-Roman', fontSize: 10 },
	bold: { fontFamily: 'Times-Bold' },
	italic: { fontFamily: 'Times-Italic' },
	link: { color: '#000', textDecoration: 'none' },
	verticalDivider: { borderLeft: '1px solid black' },
	horizontalDivider: { borderTop: '1px solid black' },
});

export default styles;
