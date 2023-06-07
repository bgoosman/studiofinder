import { ResolvedSlot } from "finder/src/types/Slot";
import { DateTime } from "luxon";
import { entity } from "simpler-state";
import { A, flow, NEA, Ord } from "../fp/fp-exports";
import { floorMaterialFilter, FloorMaterialFilter } from "./filters/floorMaterialFilter";
import { hourFilter, HourRange } from "./filters/hourFilter";
import { placesFilter, PlacesFilter } from "./filters/placeFilter";
import { Weekday, WeekdayFilters, weekdaysFilter } from "./filters/weekdayFilter";
import { getPlaceById } from "./places";
import { reaction } from "./simpler-state/reaction";
import { ResolvedSlots, slotsEntity } from "./slots";
import {
  ResolvedSlotsGroupedByDate,
  resolvedSlotsGroupedByDateEntity,
} from "./slotsGroupedByDate";

export type SlotFilters = {
  weekday: WeekdayFilters;
  hour: HourRange;
  place: PlacesFilter;
  floorMaterial: FloorMaterialFilter;
};
export type SlotFilterKey = keyof SlotFilters;

const filterSlotsWithOptions = (options: SlotFilters) => (slot: ResolvedSlot) => {
  const { weekday, hour, place } = options;
  const start = new Date(slot.start);
  const {
    meta: { floor },
  } = getPlaceById(slot.placeId)!;
  if (!floor) {
    throw new Error(`No floor found for place ${slot.placeId}`);
  }

  // Don't include slots before the current time
  if (start < new Date()) {
    return false;
  }

  // Weekday filter
  if (!weekday[String(start.getDay()) as Weekday]) {
    return false;
  }

  // Hour range filter
  const startHour = start.getHours();
  if (startHour > hour.max || startHour < hour.min) {
    return false;
  }

  // Place filter
  if (!place[slot.placeId]) {
    return false;
  }

  // Floor material filter
  if (!options.floorMaterial[floor.type]) {
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
  DateTime.fromISO(slot.start).toISODate()!;

const computeResolvedSlotsGroupedByDateWithFilters = (
  options: SlotFilters
): ((slots: ResolvedSlots) => ResolvedSlotsGroupedByDate) =>
  flow(
    A.filter(filterSlotsWithOptions(options)),
    A.match(
      // sort and groupBy require NonEmptyArray, so by using A.match, we skip calling them altogether if the array is empty.
      // I used to sort here with NEA.sort(ordSlotStartDate), but it's not necessary, since the slots are already sorted by the API.
      () => ({}),
      NEA.groupBy(getSlotStartDateString)
    )
  );

// Each filter API is defined in a separate file, in filters, but their state is merged here.
const fromSessionStorage = sessionStorage.getItem("slotFilters");
const initialSlotFilters = fromSessionStorage
  ? (JSON.parse(fromSessionStorage) as SlotFilters)
  : {
      weekday: weekdaysFilter.getDefault(),
      hour: hourFilter.getDefault(),
      place: placesFilter.getDefault(),
      floorMaterial: floorMaterialFilter.getDefault(),
    };
const slotFilters = entity<SlotFilters>(initialSlotFilters, [
  reaction((filters: SlotFilters) => {
    resolvedSlotsGroupedByDateEntity.set(
      computeResolvedSlotsGroupedByDateWithFilters(filters)(slotsEntity.get())
    );
  }),
  reaction((filters: SlotFilters) => {
    // save to session storage
    const serialized = JSON.stringify(filters);
    console.log("saving slot filters to session storage", serialized);
    sessionStorage.setItem("slotFilters", serialized);
  }),
]);
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
