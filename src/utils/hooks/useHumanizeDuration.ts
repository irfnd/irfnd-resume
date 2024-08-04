import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import * as React from 'react';

import en from 'dayjs/locale/en';
import id from 'dayjs/locale/id';

interface IUseDay {
	locale: 'id' | 'en';
	rangeDate: string[];
}

export default function useHumanizeDuration({ locale, rangeDate }: IUseDay) {
	dayjs.extend(customParseFormat);
	dayjs.extend(duration);
	dayjs.extend(relativeTime);

	const humanized = React.useMemo(() => {
		dayjs.locale(locale === 'id' ? id : en);
		const checkEndDate = ['sekarang', 'present'].includes(rangeDate[1].toLocaleLowerCase());

		const startDate = dayjs(rangeDate[0], 'MMMM YYYY');
		const endDate = checkEndDate ? dayjs() : dayjs(rangeDate[1], 'MMMM YYYY');

		const diffInYears = endDate.diff(startDate, 'year');
		const diffInMonths = endDate.diff(startDate.add(diffInYears, 'year'), 'month');

		let result = '';
		if (diffInYears > 0) {
			const years = locale === 'id' ? `${diffInYears} tahun` : `${diffInYears} year${diffInYears > 1 ? 's' : ''}`;
			const months = locale === 'id' ? `${diffInMonths} bulan` : `${diffInMonths} month${diffInMonths > 1 ? 's' : ''}`;
			result = `${years} ${months}`;
		} else {
			const months = locale === 'id' ? `${diffInMonths} bulan` : `${diffInMonths} month${diffInMonths > 1 ? 's' : ''}`;
			result = months;
		}

		return result;
	}, [locale, rangeDate]);

	return humanized;
}
