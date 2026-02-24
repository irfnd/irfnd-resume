import { useState } from 'react';

export function useYear() {
	const [year] = useState(() => new Date().getFullYear());
	return year;
}
