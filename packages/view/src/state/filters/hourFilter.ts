import { NumberRange, SlotFilter } from "./filters";

export type HourRange = NumberRange;

export const hourFilter: SlotFilter<HourRange> = {
  getDefault: () => ({
    min: 0,
    max: 24,
  }),
};

export const setMinHour = (min: number) => (hf: HourRange) => ({ ...hf, min });
export const setMaxHour = (max: number) => (hf: HourRange) => ({ ...hf, max });
