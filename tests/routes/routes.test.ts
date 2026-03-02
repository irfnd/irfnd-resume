import { Route as RootRoute } from '@/routes/__root';
import { Route as ContactRoute } from '@/routes/contact';
import { Route as IndexRoute } from '@/routes/index';
import { Route as PortfolioRoute } from '@/routes/portfolio';
import { describe, expect, it } from 'vitest';

describe('Route exports', () => {
	it('should export RootRoute', () => {
		expect(RootRoute).toBeDefined();
	});

	it('should export IndexRoute', () => {
		expect(IndexRoute).toBeDefined();
	});

	it('should export PortfolioRoute', () => {
		expect(PortfolioRoute).toBeDefined();
	});

	it('should export ContactRoute', () => {
		expect(ContactRoute).toBeDefined();
	});
});
