import { SlotFilter } from "./filters";

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type WeekdayFilters = Record<Weekday, boolean>;

export const weekdaysFilter: SlotFilter<WeekdayFilters> = {
  getDefault: () => ({
    "0": true,
    "1": true,
    "2": true,
    "3": true,
    "4": true,
    "5": true,
    "6": true,
    "7": true,
  }),
};

export const setWeekdayEnabled =
  (enabled: boolean) =>
  (weekday: Weekday) =>
  (weekdays: WeekdayFilters): WeekdayFilters => ({
    ...weekdays,
    [weekday]: enabled,
  });
