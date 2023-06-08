import { ResolvedSlot } from "finder/src/types/Slot";
import { entity } from "simpler-state";
import { attach, derived, derivedAny } from "./simpler-state/derived";
import { reaction } from "./simpler-state/reaction";
import { slotGroupsByDate } from "./slotsGroupedByDate";

export const pageSize = 3;

export const totalPageCount = derived(slotGroupsByDate, (slotGroupsByDate) =>
  Math.ceil(slotGroupsByDate.length / pageSize)
);

attach(
  reaction((totalPageCount: number) => {
    if (totalPageCount < page.get()) page.set(Math.max(0, totalPageCount - 1));
  }),
  totalPageCount
);

export const page = entity(0);

export const infiniteSlotGroups = derivedAny(
  [page, slotGroupsByDate],
  ([page, slotGroupsByDate]) =>
    slotGroupsByDate.slice(0, page * pageSize + pageSize) as [string, ResolvedSlot[]][]
);

export const hasNextPage = derivedAny(
  [page, totalPageCount],
  ([page, totalPageCount]) => page < totalPageCount - 1
);

export const getNextPage = () => {
  if (hasNextPage.get()) page.set(page.get() + 1);
};
