import * as React from 'react';

export function useYear() {
	const [year, setYear] = React.useState(new Date().getFullYear());

	React.useEffect(() => {
		const checkYear = () => {
			const currentYear = new Date().getFullYear();
			if (currentYear !== year) setYear(currentYear);
		};

		const interval = setInterval(checkYear, 1000);

		return () => clearInterval(interval);
	}, [year]);

	return year;
}
