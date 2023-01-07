import moment from "moment";
import { DateRange } from "../datetime/datetime-fns";
import { NumberRange } from "../types/NumberRange";
import { Slot } from "../types/Slot";

export type InvertSlotsOptions = {
  range: DateRange;
  hours: NumberRange;
};
export const invertSlots =
  ({ range: [dateMin, dateMax], hours: [hourMin, hourMax] }: InvertSlotsOptions) =>
  (unavailability: Slot[]): Slot[] => {
    const unavailableMoments = unavailability.map(({ start, end }) => ({
      start: moment(start),
      end: moment(end),
    }));
    const momentMin = moment(dateMin);
    const momentMax = moment(dateMax);
    // Add an unavailability block for each day
    const currentDate = momentMin.clone();
    while (currentDate.isBefore(momentMax)) {
      const start = currentDate.clone().hour(hourMax).minute(0).second(0).millisecond(0);
      const end = currentDate
        .clone()
        .add(1, "day")
        .hour(hourMin)
        .minute(0)
        .second(0)
        .millisecond(0);
      unavailableMoments.push({ start, end });
      currentDate.add(1, "day");
    }

    // If dateMin is before hourMin, add an unavailability block for the previous day
    if (momentMin.hour() < hourMin) {
      const start = momentMin
        .clone()
        .subtract(1, "day")
        .hour(hourMax)
        .minute(0)
        .second(0)
        .millisecond(0);
      const end = momentMin.clone().hour(hourMin).minute(0).second(0).millisecond(0);
      unavailableMoments.push({ start, end });
    }

    // Sort in ascending order
    unavailableMoments.sort((a, b) => (a.start.isBefore(b.start) ? -1 : 1));

    // Starting from the current moment, find all available blocks of time.
    // The available blocks are the gaps between the unavailability blocks.
    // The gaps are the start of the next block minus the end of the current block.
    const slots = [] as Slot[];
    for (let i = 0; i < unavailableMoments.length - 1; i++) {
      const current = unavailableMoments[i];
      const next = unavailableMoments[i + 1];
      const gap = next.start.diff(current.end);
      if (gap > 0) {
        // There is a gap, so there is availability!
        slots.push({ start: current.end.toISOString(), end: next.start.toISOString() });
      }
    }
    return slots;
  };
