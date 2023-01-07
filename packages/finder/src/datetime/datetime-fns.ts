import moment from "moment";

export type SerializedDateRange = [string, string];
export type DateRange = [Date, Date];
export const dateRange = (start: Date, end: Date): DateRange => [start, end];

export const now = () => new Date();

export const daysFrom = (days: number, start: Date = now()) =>
  moment(start).add(days, "days").toDate();

export const monthsFrom = (months: number, start: Date = now()) =>
  moment(start).add(months, "months").toDate();

export const parseDate = (dateString: string, format?: string) => {
  try {
    return format ? moment(dateString, format).toDate() : moment(dateString).toDate();
  } catch (e) {
    console.error(`Error parsing date: ${dateString}`);
  }
};

export const formatDate = (date: Date, format: string) => moment(date).format(format);
