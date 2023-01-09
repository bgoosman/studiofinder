import {
  getNextPage,
  hasNextPage,
  infiniteSlotGroups,
  page,
  pageSize,
  totalPageCount,
} from "./infiniteSlotGroups";
import { initSlotFilters, setSlotFilter } from "./slotFilters";
import { slotGroupsByDate } from "./slotsGroupedByDate";

it("infinite slot groups", () => {
  initSlotFilters();

  const everyday = {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
  };
  const hours = { min: 0, max: 24 };
  const justStudioA = { "Universe>Brooklyn>Triskelion Arts>Theater": true };

  setSlotFilter("weekday", () => everyday);
  setSlotFilter("hour", () => hours);
  setSlotFilter("place", () => justStudioA);

  expect(slotGroupsByDate.get().length).toBeGreaterThan(0);
  expect(totalPageCount.get()).toBe(Math.ceil(slotGroupsByDate.get().length / pageSize));
  expect(page.get()).toBe(0);
  expect(infiniteSlotGroups.get().length).toBe(pageSize);
  expect(hasNextPage.get()).toBe(true);
  while (hasNextPage.get()) getNextPage();
  expect(page.get()).toBe(totalPageCount.get() - 1);
  getNextPage();
  expect(page.get()).toBe(totalPageCount.get() - 1);

  // Page should reset to 0 if there are no slot groups
  initSlotFilters();
  expect(page.get()).toBe(0);
});
