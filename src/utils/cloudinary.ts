/**
 * Transforms a Cloudinary URL to serve a width-scaled version.
 * Replaces any existing transformation params with c_scale,w_<width>,f_auto,q_auto.
 */
export function cloudinaryResize(url: string, width: number): string {
	return url.replace(/\/image\/upload\/[^/]+\//, `/image/upload/c_scale,w_${width},f_auto,q_auto/`);
}
