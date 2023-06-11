import { RentalRate } from "finder/src/types/RentalRate";
import { ResolvedSlot } from "finder/src/types/Slot";
import { values } from "fp-ts-std/Record";
import * as A from "fp-ts/Array";
import * as NEA from "fp-ts/NonEmptyArray";
import { pipe, unsafeCoerce } from "fp-ts/function";
import { entity } from "simpler-state";
import { getUniverse, traversePlace } from "./places";
import { derived } from "./simpler-state/derived";

export type ResolvedSlots = NEA.NonEmptyArray<ResolvedSlot>;
export const slotsEntity = entity<ResolvedSlots>(
  pipe(
    getUniverse(),
    traversePlace((place) => {
      const {
        meta: { rates },
      } = place;
      if (rates) {
        const now = new Date();
        place.slots.forEach((slot) => {
          slot.rates = rates
            .filter((rate) => RentalRate.isValid(rate)(slot, now, []))
            .sort((a, b) => a.rate - b.rate);
        });
      }
      return place.slots;
    }),
    values,
    A.flatten,
    (slots: ResolvedSlot[]): ResolvedSlots => {
      if (slots.length === 0) {
        throw new Error("No slots found in universe");
      }
      return unsafeCoerce(slots);
    }
  )
);

export const maxRate = derived(slotsEntity, (slots) => {
  let max = 0;
  slots.forEach((slot) => {
    slot.rates?.forEach((rate) => {
      if (rate.rate > max) {
        max = rate.rate;
      }
    });
  });
  return max;
});
export const useMaxRate = maxRate.use;
