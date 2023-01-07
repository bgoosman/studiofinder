import { ResolvedSlot } from "@finder/Slot";
import { DateTime } from "luxon";
import { entity } from "simpler-state";
import { A, flow, NEA, Ord } from "../fp/fp-exports";
import { hourFilter, HourRange } from "./filters/hourFilter";
import { placesFilter, PlacesFilter } from "./filters/placeFilter";
import { Weekday, WeekdayFilters, weekdaysFilter } from "./filters/weekdayFilter";
import { reaction } from "./simpler-state/reaction";
import { getSlots, ResolvedSlots } from "./slots";
import {
  ResolvedSlotsGroupedByDate,
  resolvedSlotsGroupedByDateEntity,
} from "./slotsGroupedByDate";

export type SlotFilters = {
  weekday: WeekdayFilters;
  hour: HourRange;
  place: PlacesFilter;
};
export type SlotFilterKey = keyof SlotFilters;

const filterSlotsWithOptions = (options: SlotFilters) => (slot: ResolvedSlot) => {
  const { weekday, hour, place } = options;
  const start = new Date(slot.start);

  if (!weekday[start.getDay() as Weekday]) {
    return false;
  }

  const startHour = start.getHours();
  if (startHour > hour.max || startHour < hour.min) {
    return false;
  }

  if (!place[slot.placeId]) {
    return false;
  }

  return true;
};

export const ordSlotStartDate: Ord<ResolvedSlot> = {
  equals(a, b) {
    const startA = new Date(a.start).getTime();
    const startB = new Date(b.start).getTime();
    return startA === startB;
  },
  compare: (a, b) => {
    const startA = new Date(a.start).getTime();
    const startB = new Date(b.start).getTime();
    return startA > startB ? 1 : startA < startB ? -1 : 0;
  },
};

const getSlotStartDateString = (slot: ResolvedSlot) =>
  DateTime.fromISO(slot.start).toISODate();

const computeResolvedSlotsGroupedByDateWithFilters = (
  options: SlotFilters
): ((slots: ResolvedSlots) => ResolvedSlotsGroupedByDate) =>
  flow(
    A.filter(filterSlotsWithOptions(options)),
    A.match(
      () => ({}),
      // sort and groupBy require NonEmptyArray, so by using A.match, we skip calling them altogether if the array is empty.
      // I used to sort here with NEA.sort(ordSlotStartDate), but it's not necessary, since the slots are already sorted by the API.
      NEA.groupBy(getSlotStartDateString)
    )
  );

// Each filter API is defined in a separate file, in filters, but their state is merged here.
const slotFilters = entity<SlotFilters>(
  {
    weekday: weekdaysFilter.getDefault(),
    hour: hourFilter.getDefault(),
    place: placesFilter.getDefault(),
  },
  [
    reaction((filters: SlotFilters) => {
      resolvedSlotsGroupedByDateEntity.set(
        computeResolvedSlotsGroupedByDateWithFilters(filters)(getSlots())
      );
    }),
  ]
);
export const getSlotFilters = slotFilters.get;

export type SlotFilterTransformer<A, B> = (sf: A) => B;

// Can use a slot filter with or without a transforming function
export function useSlotFilter<K extends SlotFilterKey>(key: K): SlotFilters[K];
export function useSlotFilter<K extends SlotFilterKey, B>(
  key: K,
  fn: SlotFilterTransformer<SlotFilters[K], B>
): B;
export function useSlotFilter<K extends SlotFilterKey, B>(
  key: K,
  fn?: SlotFilterTransformer<SlotFilters[K], B>
) {
  return slotFilters.use((state) => (fn ? fn(state[key]) : state[key]));
}

export const getSlotFilter = <K extends SlotFilterKey>(key: K) => slotFilters.get()[key];

export const setSlotFilter = <K extends SlotFilterKey>(
  key: K,
  fn: (filter: SlotFilters[K]) => SlotFilters[K]
) => {
  const old = slotFilters.get();
  slotFilters.set({
    ...old,
    [key]: fn(old[key]),
  });
};

export const initSlotFilters = slotFilters.init;
