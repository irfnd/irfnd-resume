import { EducationSection } from '@/components/pdf/sections/education';
import { ExperienceSection } from '@/components/pdf/sections/experience';
import { HeaderSection } from '@/components/pdf/sections/header';
import { ProjectsSection } from '@/components/pdf/sections/projects';
import { SkillsSection } from '@/components/pdf/sections/skills';
import { describe, expect, it } from 'vitest';

describe('PDF Section Exports', () => {
	it('should export HeaderSection', () => {
		expect(HeaderSection).toBeDefined();
		expect(typeof HeaderSection).toBe('function');
	});

	it('should export ExperienceSection', () => {
		expect(ExperienceSection).toBeDefined();
		expect(typeof ExperienceSection).toBe('function');
	});

	it('should export EducationSection', () => {
		expect(EducationSection).toBeDefined();
		expect(typeof EducationSection).toBe('function');
	});

	it('should export SkillsSection', () => {
		expect(SkillsSection).toBeDefined();
		expect(typeof SkillsSection).toBe('function');
	});

	it('should export ProjectsSection', () => {
		expect(ProjectsSection).toBeDefined();
		expect(typeof ProjectsSection).toBe('function');
	});
});
