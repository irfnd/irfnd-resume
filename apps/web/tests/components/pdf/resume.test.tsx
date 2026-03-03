import { ResumePDF } from '@/components/pdf/resume';
import { styles } from '@/components/pdf/styles';
import { describe, expect, it } from 'vitest';

describe('ResumePDF', () => {
	it('should export ResumePDF component', () => {
		expect(ResumePDF).toBeDefined();
		expect(typeof ResumePDF).toBe('function');
	});
});

describe('PDF styles', () => {
	it('should export styles object', () => {
		expect(styles).toBeDefined();
		expect(typeof styles).toBe('object');
	});

	it('should have page styles', () => {
		expect(styles.page).toBeDefined();
	});

	it('should have text styles', () => {
		expect(styles.text).toBeDefined();
	});

	it('should have link styles', () => {
		expect(styles.link).toBeDefined();
	});

	it('should have divider styles', () => {
		expect(styles.dividerV).toBeDefined();
		expect(styles.dividerH).toBeDefined();
	});
});
