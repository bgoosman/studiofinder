import { entity } from "simpler-state";
import { derived } from "./simpler-state/derived";
import { ResolvedSlots } from "./slots";

/**
 * Depends on
 * - weekday
 * - hour
 * - place
 */
export type ResolvedSlotsGroupedByDate = Record<string, ResolvedSlots>;
export const resolvedSlotsGroupedByDateEntity = entity<ResolvedSlotsGroupedByDate>({});

const slotGroupsByDate = derived(resolvedSlotsGroupedByDateEntity, (x) => Object.entries(x));
export const useSlotGroupsByDate = slotGroupsByDate.use;
