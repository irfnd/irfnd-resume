/**
 * Transforms a Cloudinary URL to serve a scaled variant.
 *
 * Assumes the URL has exactly one transformation segment between `/image/upload/`
 * and the version segment (e.g. `f_auto,q_auto/v1234567890/...`).
 * The existing transformation is replaced with `c_scale,w_<width>,f_auto,q_auto`.
 * If the URL has multiple transformation segments, only the first is replaced.
 */
export function cloudinaryResize(url: string, width: number): string {
	return url.replace(/\/image\/upload\/[^/]+\//, `/image/upload/c_scale,w_${width},f_auto,q_auto/`);
}
