import { Font, StyleSheet } from '@react-pdf/renderer';

Font.registerHyphenationCallback((word) => [word]);

export const styles = StyleSheet.create({
	page: { flexDirection: 'column', backgroundColor: '#ffffff', paddingHorizontal: 50, paddingVertical: 36, gap: 14 },
	text: { fontFamily: 'Times-Roman', fontSize: 10 },
	bold: { fontFamily: 'Times-Bold' },
	italic: { fontFamily: 'Times-Italic' },
	link: { color: '#000', textDecoration: 'none' },
	dividerV: { borderLeft: '1px solid black' },
	dividerH: { borderTop: '1px solid black' },
});
