export function capitalize(str: string) {
	return str.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
}

export function parseDate(date: number, locale?: string) {
	const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
	if (locale === 'id') return Intl.DateTimeFormat('id-ID', options).format(new Date(date));
	return Intl.DateTimeFormat('en-EN', options).format(new Date(date));
}
