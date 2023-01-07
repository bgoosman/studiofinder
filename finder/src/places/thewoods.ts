/**
 * The Woods
 * Dance Rehearsals:  $10/hr (minimum 2hrs)
 * Dance Classes & Auditions/Theater Rehearsals: $15/hr (minimum 2hrs)
 * Yoga, Pilates/Music Rehearsals: $20/hr (minimum 1.5 hrs)
 * Photo/Video Shoot: $30/hr
 * Dance/Performance events: $50/hr (minimum 4 hours)
 */

import * as cheerio from "cheerio";
import { pipe } from "fp-ts/function";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import { DateTime } from "luxon";
import { safeFetch, safeJson } from "../fp-ts/fp-ts-functions";

import { dateRange, DateRange, monthsFrom, now } from "../datetime/datetime-fns";
import { invertSlots } from "../slots/invertSlots";
import { Conditional } from "../types/Conditional";
import { Link } from "../types/Link";
import { PlaceMeta, withPlaces, withSlots } from "../types/Place";
import { RateValidIf } from "../types/RateValidIf";
import { RentalType } from "../types/RentalType";
import { Slot } from "../types/Slot";

type FetchSlotsOptions = {
  rvc: string;
  rvt: string;
  range: DateRange;
};

type BookingsJson = {
  bookings: {
    start: string;
    end: string;
  }[];
};

const tokensUrl = "https://thewoods.skedda.com/booking?viewtype=2";
const zone = "America/New_York";
const range = dateRange(now(), monthsFrom(3));

const bookingsUrl = ([start, end]: DateRange) =>
  `https://thewoods.skedda.com/bookingslists?end=${encodeURIComponent(
    DateTime.fromJSDate(end).toISODate() + "T23:59:59"
  )}&start=${encodeURIComponent(DateTime.fromJSDate(start).toISODate() + "T00:00:00")}`;

const getRVC = (response: Response) =>
  response.headers.get("set-cookie")!.split(";")[0].split("=")[1];

const getRVT = async (response: Response) => {
  const html = await response.text();
  const $ = cheerio.load(html);
  const vals = $('input[name="__RequestVerificationToken"]').val();
  return Array.isArray(vals) ? vals[0] : vals;
};

const getOptionsWithTokens = (response: Response) =>
  TE.tryCatch(
    async (): Promise<FetchSlotsOptions> => {
      const rvc = getRVC(response);
      const rvt = await getRVT(response);
      return { rvc, rvt, range } as FetchSlotsOptions;
    },
    () => new Error("Could not get options")
  );

const getBookingsResponseWithOptions = (options: FetchSlotsOptions) =>
  safeFetch(bookingsUrl(options.range), {
    headers: {
      authority: "thewoods.skedda.com",
      cookie: `X-Skedda-RequestVerificationCookie=${options.rvc}`,
      dnt: "1",
      referrer: tokensUrl,
      "x-skedda-requestverificationtoken": options.rvt,
    },
  });

const verifyBookingsJson = (json: unknown): TE.TaskEither<Error, BookingsJson> => {
  const invalidJson = TE.left(new Error("Invalid JSON"));

  if (typeof json !== "object" || json === null) {
    return invalidJson;
  }

  const { bookings } = json as BookingsJson;
  if (!Array.isArray(bookings)) {
    return invalidJson;
  }

  return TE.right(json as BookingsJson);
};

const getSlotsFromBookingsJson = (json: BookingsJson) => {
  const unavailability = json.bookings.map((booking) =>
    Slot.of(booking.start, booking.end)
  );
  const slots = invertSlots({ range, hours: [0, 23] })(unavailability);
  return slots;
};

const getSlots = pipe(
  safeFetch(tokensUrl),
  // chain is crucial to unwrap nested TE
  TE.chain(getOptionsWithTokens),
  TE.chain(getBookingsResponseWithOptions),
  TE.chain(safeJson),
  TE.chain(verifyBookingsJson),
  TE.map(getSlotsFromBookingsJson)
);

const getPlaceMeta = (): PlaceMeta => ({
  links: [
    T.of(Link.of("About The Woods", "https://www.thewoodsuniverse.com/the-space.html")),
    T.of(Link.of("How to rent", "https://www.thewoodsuniverse.com/")),
  ],
  rates: [
    {
      rate: 10,
      validIf: Conditional.some(
        RateValidIf.of({
          minHoursIfPossible: 2,
          rentalHasTypes: Conditional.all(RentalType.Dance, RentalType.Rehearsal),
        })
      ),
    },
    {
      rate: 15,
      validIf: Conditional.some(
        RateValidIf.of({
          minHoursIfPossible: 2,
          rentalHasTypes: Conditional.some(
            Conditional.all(RentalType.Dance, RentalType.Class),
            Conditional.all(RentalType.Dance, RentalType.Audition),
            Conditional.all(RentalType.Theater, RentalType.Rehearsal)
          ),
        })
      ),
    },
    {
      rate: 20,
      validIf: Conditional.some(
        RateValidIf.of({
          minHoursIfPossible: 1.5,
          rentalHasTypes: Conditional.some(
            RentalType.Yoga,
            RentalType.Pilates,
            Conditional.all(RentalType.Music, RentalType.Rehearsal)
          ),
        })
      ),
    },
    {
      rate: 30,
      validIf: Conditional.some(
        RateValidIf.of({
          rentalHasTypes: Conditional.some(RentalType.PhotoShoot, RentalType.VideoShoot),
        })
      ),
    },
    {
      rate: 50,
      validIf: Conditional.some(
        RateValidIf.of({
          minHoursIfPossible: 4,
          rentalHasTypes: Conditional.some(
            Conditional.all(RentalType.Dance, RentalType.Event),
            Conditional.all(RentalType.Performance, RentalType.Event)
          ),
        })
      ),
    },
  ],
});

export const thewoods = withPlaces("The Woods", {}, [
  withSlots("The Woods", getPlaceMeta(), getSlots),
]);
