import { AllRentalTypes, RentalType } from "finder/src/types/RentalType";
import { SlotFilter } from "./filters";

export type RentalTypeFilter = Record<RentalType, boolean>;

export const rentalTypeFilter: SlotFilter<RentalTypeFilter> = {
  getDefault: () =>
    AllRentalTypes.reduce(
      (acc, type) => ({ ...acc, [type]: false }),
      {}
    ) as RentalTypeFilter,
};

export const getEnabledRentalTypes = (rentalTypeFilter: RentalTypeFilter) =>
  Object.entries(rentalTypeFilter)
    .filter(([_, enabled]) => enabled)
    .map(([type, _]) => type) as RentalType[];

export const setRentalTypes =
  (enabled: boolean) =>
  (types: RentalType[]) =>
  (filters: RentalTypeFilter): RentalTypeFilter => {
    AllRentalTypes.forEach((type) => {
      filters[type] = types.includes(type);
    });
    return filters;
  };
