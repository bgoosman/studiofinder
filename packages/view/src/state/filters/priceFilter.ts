import { maxRate } from "../slots";
import { SlotFilter } from "./filters";

export type PriceRange = [number, number];

export const priceFilter: SlotFilter<PriceRange> = {
  getDefault: () => [0, maxRate.get()],
};
console.log("maxRate", maxRate.get());

export const setPriceFilter = (priceRange: PriceRange) => () => priceRange;
export const setMinPrice = (min: number) => (hf: PriceRange) => [min, hf[1]];
export const setMaxPrice = (max: number) => (hf: PriceRange) => [hf[0], max];
