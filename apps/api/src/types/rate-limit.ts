export interface RateLimitEntry {
	count: number;
	resetAt: number;
}

export interface RateLimitConfig {
	max: number;
	windowMs: number;
	store?: Map<string, RateLimitEntry>;
}
