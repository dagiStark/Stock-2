
export type PeriodType = 'month' | 'quarter' | 'year' | 'decade';

export const getDateRange = (periodType: PeriodType, selectedYear: string, selectedMonth: string, selectedQuarter: string) => {
  const year = parseInt(selectedYear);
  let startDate: Date, endDate: Date;

  switch (periodType) {
    case 'month':
      const month = parseInt(selectedMonth);
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0);
      break;
    case 'quarter':
      const quarter = parseInt(selectedQuarter);
      startDate = new Date(year, quarter * 3, 1);
      endDate = new Date(year, (quarter + 1) * 3, 0);
      break;
    case 'year':
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31);
      break;
    case 'decade':
      startDate = new Date(year - 10, 0, 1);
      endDate = new Date(year, 11, 31);
      break;
    default:
      startDate = new Date();
      endDate = new Date();
  }

  return { startDate, endDate };
};
