import type { IContact, IEducation, IExperience, IPortfolio, IProfile, ITechnology, Language } from '@/types';
import { Document, Page } from '@react-pdf/renderer';

import { EducationSection } from '@/components/pdf/sections/education';
import { ExperienceSection } from '@/components/pdf/sections/experience';
import { HeaderSection } from '@/components/pdf/sections/header';
import { ProjectsSection } from '@/components/pdf/sections/projects';
import { SkillsSection } from '@/components/pdf/sections/skills';
import { styles } from '@/components/pdf/styles';

export interface ResumePDFProps {
	profile: IProfile;
	contact: IContact[];
	experience: IExperience;
	education: IEducation;
	technology: ITechnology;
	portfolio: IPortfolio;
	language: Language;
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
