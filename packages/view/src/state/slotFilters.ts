import defaults from "defaults";
import { RentalRate } from "finder/src/types/RentalRate";
import { RentalType } from "finder/src/types/RentalType";
import { ResolvedSlot } from "finder/src/types/Slot";
import { DateTime } from "luxon";
import { entity } from "simpler-state";
import { A, flow, NEA, Ord, pipe } from "../fp/fp-exports";
import { floorMaterialFilter, FloorMaterialFilter } from "./filters/floorMaterialFilter";
import {
  floorSizeFilter,
  FloorSizeFilter,
  getEnabledFloorSizeRanges,
} from "./filters/floorSizeFilter";
import { hourFilter, HourRange } from "./filters/hourFilter";
import { placesFilter, PlacesFilter } from "./filters/placeFilter";
import { priceFilter, PriceRange } from "./filters/priceFilter";
import {
  getEnabledRentalTypes,
  rentalTypeFilter,
  RentalTypeFilter,
} from "./filters/rentalTypeFilter";
import { Weekday, WeekdayFilters, weekdaysFilter } from "./filters/weekdayFilter";
import { getPlaceById } from "./places";
import { reaction } from "./simpler-state/reaction";
import { slotsEntity } from "./slots";
import { resolvedSlotsGroupedByDateEntity } from "./slotsGroupedByDate";

/**
 * How to add a new filter:
 *
 * 1. Create a new file in filters/ with the filter logic.
 * 2. Add the filter to the SlotFilters type.
 * 3. Check filter in filterSlotsWithOptions.
 * 4. Add the filter to the defaultFilters object.
 * 5. Add a component in the components/ folder.
 * 6. Add the component to the SlotFilters component.
 */

export type SlotFilters = {
  weekday: WeekdayFilters;
  hour: HourRange;
  price: PriceRange;
  place: PlacesFilter;
  floorMaterial: FloorMaterialFilter;
  floorSize: FloorSizeFilter;
  rentalType: RentalTypeFilter;
};

export type SlotFilterKey = keyof SlotFilters;

export const isValidRate =
  (
    [minPrice, maxPrice]: PriceRange,
    enabledRentalTypes: RentalType[],
    rentalTypeFilter: RentalTypeFilter
  ) =>
    ({ rate, types }: RentalRate) =>
      minPrice < rate &&
      rate < maxPrice &&
      (enabledRentalTypes.length === 0 ||
        types?.some((compositeType) =>
          compositeType.some((type) => rentalTypeFilter[type])
        ));

const filterSlotsWithOptions = (options: SlotFilters) => (slot: ResolvedSlot) => {
  const { weekday, hour, price, place } = options;
  const start = new Date(slot.start);
  const {
    meta: { floor, squareFootage },
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
  // Universe is always selected
  const anyPlacesSelected = Object.entries(place).some(
    ([locationId, selected]) => locationId != "Universe" && selected
  );
  const path = slot.placeId.split(">");
  const getParentPlace = (placeId: string) => placeId.split(">").slice(0, -1).join(">");
  const anySiblingPlaceSelected = (path: string) => Object.entries(place).some(
    ([locationId, selected]) => getParentPlace(locationId) == getParentPlace(path) && selected
  );
  if (!place[slot.placeId]) {
    for (let i = path.length - 1; i >= 0; i--) {
      const locationId = path.slice(0, i + 1).join(">");
      if (!place[locationId] && anySiblingPlaceSelected(locationId)) {
        return false;
      }
    }
  }

  // Floor material filter
  if (!options.floorMaterial[floor.type]) {
    return false;
  }

  // Rental price and type filter
  // If there are no enabled rental types, we don't filter by rental type
  const enabledRentalTypes = getEnabledRentalTypes(options.rentalType);
  const validRateFilter = isValidRate(price, enabledRentalTypes, options.rentalType);
  const hasValidRate = slot.rates?.some(validRateFilter);
  if (!hasValidRate) {
    return false;
  }

  // Floor size filter
  if (squareFootage) {
    const enabledFloorSizeRanges = getEnabledFloorSizeRanges(options.floorSize);
    const hasValidFloorSize = enabledFloorSizeRanges.some(
      (range) => range[0] <= squareFootage && squareFootage <= range[1]
    );
    if (!hasValidFloorSize) {
      return false;
    }
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

export const filteredSlots = entity<ResolvedSlot[]>([]);

// Each filter API is defined in a separate file, in filters, but their state is merged here.
const fromSessionStorage = sessionStorage.getItem("slotFilters");
const defaultFilters: SlotFilters = {
  weekday: weekdaysFilter.getDefault(),
  hour: hourFilter.getDefault(),
  place: placesFilter.getDefault(),
  price: priceFilter.getDefault(),
  floorMaterial: floorMaterialFilter.getDefault(),
  floorSize: floorSizeFilter.getDefault(),
  rentalType: rentalTypeFilter.getDefault(),
};
const initialSlotFilters = fromSessionStorage
  ? defaults(JSON.parse(fromSessionStorage) as SlotFilters, defaultFilters)
  : defaultFilters;
export const slotFilters = entity<SlotFilters>(initialSlotFilters, [
  reaction((filters: SlotFilters) => {
    filteredSlots.set(pipe(slotsEntity.get(), A.filter(filterSlotsWithOptions(filters))));
    resolvedSlotsGroupedByDateEntity.set(
      pipe(
        slotsEntity.get(),
        flow(
          A.filter(filterSlotsWithOptions(filters)),
          A.match(
            // sort and groupBy require NonEmptyArray, so by using A.match, we skip calling them altogether if the array is empty.
            // I used to sort here with NEA.sort(ordSlotStartDate), but it's not necessary, since the slots are already sorted by the API.
            () => ({}),
            NEA.groupBy(getSlotStartDateString)
          ),
          (slotsGroupedByDate) => {
            // Sort each slot group
            Object.entries(slotsGroupedByDate).forEach(([date, slots]) => {
              slotsGroupedByDate[date] = slots.sort((a, b) => {
                const startA = new Date(a.start).getTime();
                const startB = new Date(b.start).getTime();
                return startA > startB ? 1 : startA < startB ? -1 : 0;
              });
            });
            console.log("slotsGroupedByDate", slotsGroupedByDate);
            return slotsGroupedByDate;
          }
        )
      )
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
