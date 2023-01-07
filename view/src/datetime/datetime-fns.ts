export function toDate(date: string) {
  return new Date(date);
}

export function getTime(date: string) {
  return toDate(date).getTime();
}

export const getMeridian = (hour: number) => (hour < 12 ? "am" : "pm");
export const getHour = (hour: number) => (hour % 12 === 0 ? 12 : hour % 12);
export const formatHour = (hour: number) =>
  `${getHour(hour)}${getMeridian(hour)}`;

export type DateRange = [Date, Date];
export const dateRange = (start: Date, end: Date): DateRange => [start, end];
