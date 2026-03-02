import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-pdf/renderer', () => ({
	Font: { registerHyphenationCallback: vi.fn() },
	StyleSheet: {
		create: <T extends Record<string, unknown>>(styles: T): T => styles,
	},
}));

import { styles } from '@/components/pdf/styles';

describe('PDF Styles', () => {
	it('should define page styles', () => {
		expect(styles.page).toBeDefined();
		expect(styles.page.flexDirection).toBe('column');
		expect(styles.page.backgroundColor).toBe('#ffffff');
		expect(styles.page.paddingHorizontal).toBe(50);
		expect(styles.page.paddingVertical).toBe(36);
		expect(styles.page.gap).toBe(14);
	});

	it('should define text styles', () => {
		expect(styles.text).toBeDefined();
		expect(styles.text.fontFamily).toBe('Times-Roman');
		expect(styles.text.fontSize).toBe(10);
	});

	it('should define bold styles', () => {
		expect(styles.bold).toBeDefined();
		expect(styles.bold.fontFamily).toBe('Times-Bold');
	});

	it('should define italic styles', () => {
		expect(styles.italic).toBeDefined();
		expect(styles.italic.fontFamily).toBe('Times-Italic');
	});

	it('should define link styles', () => {
		expect(styles.link).toBeDefined();
		expect(styles.link.color).toBe('#000');
		expect(styles.link.textDecoration).toBe('none');
	});

	it('should define vertical divider styles', () => {
		expect(styles.dividerV).toBeDefined();
		expect(styles.dividerV.borderLeft).toBe('1px solid black');
	});

	it('should define horizontal divider styles', () => {
		expect(styles.dividerH).toBeDefined();
		expect(styles.dividerH.borderTop).toBe('1px solid black');
	});
});
