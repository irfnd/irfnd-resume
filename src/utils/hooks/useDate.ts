import * as React from 'react';

export default function useDate() {
	const [date, setDate] = React.useState(new Date());

	React.useEffect(() => {
		const getDate = setInterval(() => setDate(new Date()), 1000);
		return () => clearInterval(getDate);
	});

	return date;
}
