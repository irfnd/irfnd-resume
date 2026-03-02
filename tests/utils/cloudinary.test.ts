import { cloudinaryResize } from '@/utils/cloudinary';
import { describe, expect, it } from 'vitest';

describe('cloudinaryResize utility', () => {
	it('should transform cloudinary URL with scale and width', () => {
		const url = 'https://res.cloudinary.com/example/image/upload/f_auto,q_auto/v1234567890/folder/image.jpg';
		const result = cloudinaryResize(url, 800);
		expect(result).toBe(
			'https://res.cloudinary.com/example/image/upload/c_scale,w_800,f_auto,q_auto/v1234567890/folder/image.jpg',
		);
	});

	it('should handle different widths', () => {
		const url = 'https://res.cloudinary.com/example/image/upload/f_auto,q_auto/v1234567890/image.png';

		expect(cloudinaryResize(url, 400)).toContain('c_scale,w_400');
		expect(cloudinaryResize(url, 1200)).toContain('c_scale,w_1200');
		expect(cloudinaryResize(url, 100)).toContain('c_scale,w_100');
	});

	it('should handle URLs with different transformation segments', () => {
		const url = 'https://res.cloudinary.com/example/image/upload/c_fill,w_500,h_500/v1234567890/image.jpg';
		const result = cloudinaryResize(url, 300);
		expect(result).toBe('https://res.cloudinary.com/example/image/upload/c_scale,w_300,f_auto,q_auto/v1234567890/image.jpg');
	});

	it('should preserve the rest of the URL path', () => {
		const url = 'https://res.cloudinary.com/example/image/upload/f_auto/v123/folder/subfolder/image.webp';
		const result = cloudinaryResize(url, 600);
		expect(result).toContain('/v123/folder/subfolder/image.webp');
	});

	it('should handle URLs with complex transformation strings', () => {
		const url = 'https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_crop,g_auto/v999/photo.jpg';
		const result = cloudinaryResize(url, 250);
		expect(result).toBe('https://res.cloudinary.com/demo/image/upload/c_scale,w_250,f_auto,q_auto/v999/photo.jpg');
	});
});
