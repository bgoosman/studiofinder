import { SlotFilter } from "./filters";

export type HourBlock = "morning" | "afternoon" | "evening";
export type HourBlockFilter = Record<HourBlock, boolean>;
export const hourBlocks: HourBlock[] = ["morning", "afternoon", "evening"];

export const hourBlocksFilter: SlotFilter<HourBlockFilter> = {
  getDefault: () => ({
    "morning": true,
    "afternoon": true,
    "evening": true,
  }),
};

export const setHourBlockEnabled =
  (enabled: boolean) =>
    (hourBlock: HourBlock) =>
      (hourBlocks: HourBlockFilter): HourBlockFilter => ({
        ...hourBlocks,
        [hourBlock]: enabled,
      });
