import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';

import * as Home from '@/components/page/home';

export const Route = createFileRoute('/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<React.Fragment>
			<Home.ProfileFocus />
			<Home.ProfessionalJurney />
			<Home.SelectedWork />
			<Home.TechnicalStack />
			<Home.EducationHistory />
		</React.Fragment>
	);
}
