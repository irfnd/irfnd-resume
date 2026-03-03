export function cloudinaryResize(url: string, width: number): string {
	return url.replace(/\/image\/upload\/[^/]+\//, `/image/upload/c_scale,w_${width},f_auto,q_auto/`);
}
