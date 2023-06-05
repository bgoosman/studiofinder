import * as T from "fp-ts/Task";
import moment from "moment";
import { map, pipe } from "rubico";
import { dateRange, now } from "../datetime/datetime-fns";
import { fetchGoogleCalendar, mapGoogleEventToSlot } from "../providers/googleCalendar";
import { invertSlots } from "../slots/invertSlots";
import { Conditional } from "../types/Conditional";
import { Material } from "../types/Floor";
import { Link } from "../types/Link";
import { numberRange } from "../types/NumberRange";
import { withPlaces, withSlots } from "../types/Place";
import { RateValidIf } from "../types/RateValidIf";
import { RentalType } from "../types/RentalType";

const links: T.Task<Link>[] = [
  T.of(Link.of("Rental Policies", "https://www.cprnyc.org/rentals")),
  T.of(Link.of("Booking Calendar", "https://www.cprnyc.org/booking")),
];

const emailTemplate = `I'd like to rent space at CPR,

Large/small studio: $room

Intended use:

Date(s) requested (and alternate dates, if applicable): $date
Number of hours: 

My name:

Telephone:

Address:

(initiated by rehearsal.fun)
`;
const bookingStrategy = {
  type: "email",
  email: "spacerentals@cprnyc.org",
  subject: "Space Rental",
  body: emailTemplate,

  // https://github.com/moment/luxon/blob/master/docs/zones.md
  iana: "America/New_York",
};

/**
 * Rehearsal rental requests may be made by email up to 3 months in advance, each new
 * month opening on the 1st of three months prior (e.g. on January 1, the calendar is
 * open through March; on February 1, it is open through April). Requests are confirmed
 * on a first-come basis. Please consult the Booking Calendar to check availability, and
 * reach out to spacerentals@cprnyc.org with your request.
 * https://www.cprnyc.org/rentals
 */
const range = dateRange(
  now(),
  moment().startOf("month").add(2, "months").endOf("month").toDate()
);

const getSlots = (calendarId: string) =>
  pipe([
    fetchGoogleCalendar({
      calendarId,
      range,
    }),
    map(mapGoogleEventToSlot),
    invertSlots({
      range,
      hours: numberRange(9, 21),
    }),
  ]);

/**
 * Rehearsals must be booked for a minimum of 2 hours. If only a smaller increment of
 * time remains on a given day, the studio may be booked for that time.
 * Large Studio: $20/hour (artist/small company rate) / $10/hour (subsidized rate)
 * Small Studio: $12/hour (artist/small company rate) / $6/hour (subsidized rate)
 * https://www.cprnyc.org/rentals
 */

export const centerForPerformanceResearch = withPlaces(
  "Center For Performance Research",
  {
    shortName: "CPR",
  },
  [
    withSlots(
      "Large Studio",
      {
        bookingStrategy,
        floor: {
          type: Material.Marley,
          size: '41 feet,45 feet',
        },
        links,
        rates: [
          {
            rate: 10,
            validIf: Conditional.all(
              RateValidIf.of({
                minHoursIfPossible: 2,
                rentalHasTypes: Conditional.all(
                  RentalType.Subsidized,
                  RentalType.Rehearsal
                ),
              })
            ),
          },
          {
            rate: 20,
            validIf: Conditional.all(
              RateValidIf.of({
                minHoursIfPossible: 2,
                rentalHasTypes: Conditional.all(RentalType.Rehearsal),
              })
            ),
          },
          {
            rate: 35,
            validIf: Conditional.all(
              RateValidIf.of({
                minHours: 2,
                rentalHasTypes: Conditional.some(
                  RentalType.Audition,
                  RentalType.OpenRehearsal,
                  RentalType.Class,
                  RentalType.Workshop
                ),
              })
            ),
          },
          {
            rate: 165,
            validIf: Conditional.all(
              RateValidIf.of({
                minHours: 4,
                rentalHasTypes: Conditional.all(RentalType.Performance),
              })
            ),
          },
        ],
      },
      getSlots("cprnyc.org_j0jrsna2vngn9ddioc0550v5a0")
    ),
    withSlots(
      "Small Studio",
      {
        bookingStrategy,
        floor: {
          type: Material.Marley,
          size: '15 feet,45 feet',
        },
        links,
        rates: [
          {
            rate: 6,
            validIf: Conditional.all(
              RateValidIf.of({
                minHoursIfPossible: 2,
                rentalHasTypes: Conditional.all(
                  RentalType.Subsidized,
                  RentalType.Rehearsal
                ),
              })
            ),
          },
          {
            rate: 12,
            validIf: Conditional.all(
              RateValidIf.of({
                minHoursIfPossible: 2,
                rentalHasTypes: Conditional.all(RentalType.Rehearsal),
              })
            ),
          },
          {
            rate: 20,
            validIf: Conditional.all(
              RateValidIf.of({
                minHours: 2,
                rentalHasTypes: Conditional.some(
                  RentalType.Audition,
                  RentalType.OpenRehearsal,
                  RentalType.Class,
                  RentalType.Workshop
                ),
              })
            ),
          },
        ],
      },
      getSlots("cprnyc.org_pufdgvcalkdr3gl44e13vn0dgs")
    ),
  ]
);
