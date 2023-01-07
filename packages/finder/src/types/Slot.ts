import { Ord } from "fp-ts/lib/Ord";
import * as TE from "fp-ts/TaskEither";
import { DateTime } from "luxon";
import { wrapUnknownInError } from "../fp-ts/fp-ts-functions";
import { Link } from "./Link";
import { RentalRate } from "./RentalRate";

export type Slot = {
  start: string;
  end: string;
};
export const Slot = {
  of: (start: string, end: string): Slot => ({ start, end }),
};

export type GetSlots = TE.TaskEither<Error, Slot[]>;
export const wrapLegacyGetSlots = (getSlots: () => Promise<Slot[]>): GetSlots =>
  TE.tryCatch(getSlots, wrapUnknownInError);

export type ResolvedSlot = Slot & {
  placeId: string;
  links: Link[];
  rates?: RentalRate[];
};

export const slotsOrderedByDate = {
  compare: (a, b) => {
    const aStart = DateTime.fromISO(a.start);
    const bStart = DateTime.fromISO(b.start);
    if (aStart < bStart) {
      return -1;
    } else if (aStart > bStart) {
      return 1;
    } else {
      return 0;
    }
  },
  equals: function (x: Slot, y: Slot): boolean {
    return x.start === y.start && x.end === y.end;
  },
} as Ord<Slot>;
