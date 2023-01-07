import { DateTime } from "luxon";
import { SerializedDateRange } from "../datetime/datetime-fns";
import { Conditional } from "./Conditional";
import { NumberRange } from "./NumberRange";
import { CompositeRentalType, RentalType } from "./RentalType";
import { Slot } from "./Slot";

export type TimeIsRight = {
  betweenDates?: SerializedDateRange;
  betweenHours?: NumberRange;
  weekdays?: number[];
  startHoursWithin?: number;
  /**
   * The suggested minimum number of hours to book.
   */
  minHoursIfPossible?: number;
  /**
   * A required minimum number of hours to book.
   */
  minHours?: number;
};

export type RentalHasTypes = {
  rentalHasTypes?: Conditional<RentalType>;
  // See Conditional.explode
  rentalHasTypesExploded?: CompositeRentalType[];
};

export type RateValidIf = TimeIsRight & RentalHasTypes;
export const RateValidIf = {
  isType: (any: unknown): any is RateValidIf => {
    return (
      any !== null &&
      typeof any === "object" &&
      [
        "betweenDates",
        "betweenHours",
        "weekdays",
        "startHoursWithin",
        "minHoursIfPossible",
        "minHours",
        "rentalHasTypes",
      ].some((key) => key in any)
    );
  },

  isValid:
    (slot: Slot, now: Date, allTypes: Array<RentalType>) =>
    (rateValidIf: RateValidIf): boolean => {
      const slotStart = DateTime.fromISO(slot.start);
      const slotEnd = DateTime.fromISO(slot.end);
      const {
        betweenDates,
        betweenHours,
        weekdays,
        startHoursWithin,
        minHours,
        rentalHasTypesExploded,
      } = rateValidIf;

      if (betweenDates) {
        if (
          slotStart < DateTime.fromISO(betweenDates[0]) ||
          slotStart > DateTime.fromISO(betweenDates[1])
        ) {
          return false;
        }
      }

      if (betweenHours) {
        if (slotStart.hour < betweenHours[0] || slotStart.hour > betweenHours[1]) {
          return false;
        }
      }

      if (weekdays) {
        if (!weekdays.includes(slotStart.weekday)) {
          return false;
        }
      }

      if (startHoursWithin) {
        if (slotStart.diff(DateTime.fromJSDate(now)).as("hours") > startHoursWithin) {
          return false;
        }
      }

      if (minHours) {
        if (slotEnd.diff(slotStart, "hours").hours < minHours) {
          return false;
        }
      }

      if (allTypes.length > 0 && rentalHasTypesExploded) {
        if (!rentalHasTypesExploded.some((ts) => allTypes.every((t) => ts.includes(t)))) {
          return false;
        }
      }

      return true;
    },

  of(any: RateValidIf): RateValidIf {
    return any;
  },
};
