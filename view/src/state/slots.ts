import { RentalRate } from "@finder/RentalRate";
import { ResolvedSlot } from "@finder/Slot";
import { values } from "fp-ts-std/Record";
import * as A from "fp-ts/Array";
import { pipe, unsafeCoerce } from "fp-ts/function";
import * as NEA from "fp-ts/NonEmptyArray";
import { entity } from "simpler-state";
import { getUniverse, traversePlace } from "./places";

export type ResolvedSlots = NEA.NonEmptyArray<ResolvedSlot>;
const slotsEntity = entity<ResolvedSlots>(
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

export const getSlots = slotsEntity.get;
