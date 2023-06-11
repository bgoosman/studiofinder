import { NumberRange } from "finder/src/types/NumberRange";
import { SlotFilter } from "./filters";

export enum FloorSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

export const floorSizes = Object.values(FloorSize);

export const floorSizeLabels: Record<FloorSize, string> = {
  [FloorSize.Small]: "Small",
  [FloorSize.Medium]: "Medium",
  [FloorSize.Large]: "Large",
};

export const floorSizeTooltips: Record<FloorSize, string> = {
  [FloorSize.Small]: "Less than 300 sqft",
  [FloorSize.Medium]: "300 - 600 sqft",
  [FloorSize.Large]: "More than 600 sqft",
};

export const floorSizeRange = {
  [FloorSize.Small]: [0, 300] as NumberRange,
  [FloorSize.Medium]: [300, 600] as NumberRange,
  [FloorSize.Large]: [600, Infinity] as NumberRange,
};

export type FloorSizeFilter = Record<FloorSize, boolean>;

export const floorSizeFilter: SlotFilter<FloorSizeFilter> = {
  getDefault: () =>
    floorSizes.reduce((acc, type) => ({ ...acc, [type]: true }), {}) as FloorSizeFilter,
};

export const getEnabledFloorSizes = (floorSizeFilter: FloorSizeFilter) =>
  Object.entries(floorSizeFilter)
    .filter(([_, enabled]) => enabled)
    .map(([type, _]) => type) as FloorSize[];

export const getEnabledFloorSizeRanges = (floorSizeFilter: FloorSizeFilter) =>
  Object.entries(floorSizeFilter)
    .filter(([_, enabled]) => enabled)
    .map(([type, _]) => floorSizeRange[type as FloorSize]);

export const setFloorSize =
  (enabled: boolean) =>
  (size: FloorSize) =>
  (filter: FloorSizeFilter): FloorSizeFilter => ({
    ...filter,
    [size]: enabled,
  });

export const setFloorSizes =
  (sizes: FloorSize[]) =>
  (filter: FloorSizeFilter): FloorSizeFilter => {
    Object.values(FloorSize).forEach((size) => {
      filter[size] = sizes.includes(size);
    });
    return filter;
  };
