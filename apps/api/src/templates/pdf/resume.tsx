import type {
	ContactData,
	EducationData,
	ExperienceData,
	LangCode,
	PortfolioData,
	ProfileData,
	TechnologyData,
} from '@irfnd/data';
import { Document, Page } from '@react-pdf/renderer';

import { EducationSection } from '@/templates/pdf/sections/education';
import { ExperienceSection } from '@/templates/pdf/sections/experience';
import { HeaderSection } from '@/templates/pdf/sections/header';
import { ProjectsSection } from '@/templates/pdf/sections/projects';
import { SkillsSection } from '@/templates/pdf/sections/skills';
import { styles } from '@/templates/pdf/styles';

export interface ResumePDFProps {
	profile: ProfileData;
	contact: ContactData;
	experience: ExperienceData;
	education: EducationData;
	technology: TechnologyData;
	portfolio: PortfolioData;
	language: LangCode;
}

export function ResumePDF(props: ResumePDFProps) {
	return (
		<Document>
			<Page size='A4' style={styles.page}>
				<HeaderSection profile={props.profile} contact={props.contact} />
				<ExperienceSection experience={props.experience} />
				<EducationSection education={props.education} />
				<SkillsSection technology={props.technology} />
				<ProjectsSection portfolio={props.portfolio} language={props.language} />
			</Page>
		</Document>
	);
}
