import { describe, expect, it } from 'vitest';
import { cloudinaryResize } from '@/utils/cloudinary';

describe('cloudinaryResize', () => {
	it('replaces existing transform segment with new width', () => {
		const url = 'https://res.cloudinary.com/demo/image/upload/v1234/photo.jpg';
		expect(cloudinaryResize(url, 800)).toBe('https://res.cloudinary.com/demo/image/upload/c_scale,w_800,f_auto,q_auto/photo.jpg');
	});

	it('handles URL with existing transforms', () => {
		const url = 'https://res.cloudinary.com/demo/image/upload/c_fill,w_500/photo.jpg';
		expect(cloudinaryResize(url, 1200)).toBe(
			'https://res.cloudinary.com/demo/image/upload/c_scale,w_1200,f_auto,q_auto/photo.jpg',
		);
	});

	it('returns original URL if pattern does not match', () => {
		const url = 'https://example.com/photos/test.jpg';
		expect(cloudinaryResize(url, 800)).toBe('https://example.com/photos/test.jpg');
	});
});
