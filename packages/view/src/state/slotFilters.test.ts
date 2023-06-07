import { ResolvedSlot } from "finder/src/types/Slot";
import { A, pipe, R, S } from "../fp/fp-exports";
import { Weekday } from "./filters/weekdayFilter";
import { getSlotFilter, initSlotFilters, setSlotFilter } from "./slotFilters";
import { resolvedSlotsGroupedByDateEntity } from "./slotsGroupedByDate";

it("slots respect the filters", () => {
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

  expect(getSlotFilter("weekday")).toEqual(everyday);
  expect(getSlotFilter("hour")).toEqual(hours);
  expect(getSlotFilter("place")).toEqual(justStudioA);

  const slots = pipe(resolvedSlotsGroupedByDateEntity.get(), R.values, A.flatten);
  expect(Object.keys(slots).length).toBeGreaterThan(0);

  const uniqRooms = pipe(
    slots,
    A.map((slot) => slot.placeId),
    A.uniq(S.Eq)
  );
  expect(uniqRooms.length).toBe(1);

  const getSlotStartHour = (slot: ResolvedSlot) => new Date(slot.start).getHours();
  expect(
    pipe(
      slots,
      A.every(
        (slot) =>
          getSlotStartHour(slot) >= 0 &&
          getSlotStartHour(slot) <= getSlotFilter("hour").max
      )
    )
  ).toBe(true);

  const weekdayFilter = getSlotFilter("weekday");
  expect(
    pipe(
      slots,
      A.every((slot) => weekdayFilter[String(new Date(slot.start).getDay()) as Weekday])
    )
  ).toBe(true);
});
