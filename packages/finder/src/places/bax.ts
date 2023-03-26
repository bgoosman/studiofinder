/**
 * Brooklyn Arts Exchange
 * $10/hour (off-peak) Monday-Friday before 6:00 pm*
 * $16/hour  (peak) Weekdays (M-F) after 6:00 pm
 * $16/hour Saturdays and Sundays All Day
 * $8/hr rush space to contracted renters in good financial standing. Rush space rates are available for any space booked less than 24 hours in advance.
 */

import * as NEA from "fp-ts/NonEmptyArray";
import * as T from "fp-ts/Task";
import { groupBy } from "lodash";
import { map, pipe } from "rubico";
import { parseString } from "xml2js";
import {
  dateRange,
  DateRange,
  formatDate,
  monthsFrom,
  now,
  parseDate
} from "../datetime/datetime-fns";
import { invertSlots } from "../slots/invertSlots";
import { mergeOverlappingSlots } from "../slots/mergeOverlappingSlots";
import { Conditional } from "../types/Conditional";
import { Link } from "../types/Link";
import { numberRange } from "../types/NumberRange";
import { withPlaces, withSlots } from "../types/Place";
import { RateValidIf } from "../types/RateValidIf";
import { RentalRate } from "../types/RentalRate";
import { RentalType } from "../types/RentalType";
import { Slot, slotsOrderedByDate } from "../types/Slot";

const BAX_EMAIL_TEMPLATE = `Hello, 

Please review my request for Studio Space from rehearsal.fun.

Contact Information
Full Name:
Mailing Address:
Phone Number:
Email:

Rental Information
Room: $room
Rental Purpose: [Rehearsal, Class/Workshop, Audition, Performance]
Date: $date
Start Time: 
End Time:

As a friendly reminder, BAX is located on the 2nd and 3rd floors, accessible by stairs with no lift or elevator. However, we make every effort to help folks with mobility challenges reach our space. If you have a specific request or need, please reach out to us!

Space is only confirmed if you receive a confirmation email from BAX. Please do not assume otherwise.
`;

const fetchXml = (range: DateRange) => async () => {
  const url = makeUrl(range);
  const response = await fetch(url);
  const xml = await response.text();
  return xml;
};

const makeUrl = ([from, to]: DateRange) => {
  const secondsSinceEpoch = Math.round(Date.now() / 1000);
  const dateFormat = "MM/DD/YYYY";
  return `https://ewr-61.proof-cloud.com/sosimple/sosimple_cal.php?template=1-2-063755228081-0000000-04380_018544354098357&uid=${secondsSinceEpoch}&calendar=1-2-063755227965-0000000-04380_018544354098357&i=0&no_r=1&timeshift=300&from=${formatDate(
    from,
    dateFormat
  )}&to=${formatDate(to, dateFormat)}`;
};

type BaxEvent = {
  unit: string[];
  start_date: NEA.NonEmptyArray<string>;
  end_date: NEA.NonEmptyArray<string>;
};
type EventsJson = {
  data: {
    event: Array<BaxEvent>;
  };
};
const xmlToEvents = async (xml: string) => {
  return new Promise((resolve, reject) => {
    parseString(xml, (err: unknown, result: EventsJson) => {
      if (err) {
        reject("Error parsing XML string");
      } else {
        resolve(result.data.event);
      }
    });
  });
};

const DATE_FORMAT = "MM/DD/YYYY HH:mm:ss";
const eventToSlot = (event: BaxEvent) => {
  return {
    room: event.unit[0],
    // Let parsing errors bubble up to the top
    start: parseDate(event.start_date[0], DATE_FORMAT)!.toISOString(),
    end: parseDate(event.end_date[0], DATE_FORMAT)!.toISOString(),
  };
};

const range = dateRange(now(), monthsFrom(1));
const hours = numberRange(9, 22)

const getSlotsByRoom = pipe([
  fetchXml(range),
  xmlToEvents,
  map(eventToSlot),
  (slots: Slot[]) => groupBy(slots, "room"),
]);

const getSlots = (room: string) => async () => {
  const slotsByRoom = await getSlotsByRoom();
  const sorted = slotsByRoom[room].sort(slotsOrderedByDate.compare)
  const merged = mergeOverlappingSlots(sorted)
  const inverted = invertSlots({
    range,
    hours,
  })(merged)
  return inverted
}

getSlots("Studio C")().then((slots) => slots);

const bookingStrategy = {
  type: "email",
  email: "rentals@bax.org",
  subject: "rehearsal.fun Booking",
  body: BAX_EMAIL_TEMPLATE,

  // https://github.com/moment/luxon/blob/master/docs/zones.md
  iana: "America/New_York",
};

const links = [
  T.of(Link.of("About BAX", "https://www.bax.org/about/")),
  T.of(Link.of("How to rent", "https://www.bax.org/space/rentals/")),
];

const rates: Array<RentalRate> = [
  {
    name: "Off-peak",
    rate: 10,
    validIf: Conditional.some(
      RateValidIf.of({
        rentalHasTypes: Conditional.some(RentalType.Rehearsal),
        betweenHours: numberRange(9, 18),
        weekdays: [1, 2, 3, 4, 5],
      })
    ),
  },
  {
    name: "Peak",
    rate: 16,
    validIf: Conditional.some(
      RateValidIf.of({
        rentalHasTypes: Conditional.some(RentalType.Rehearsal),
        betweenHours: numberRange(18, 22),
        weekdays: [1, 2, 3, 4, 5],
      })
    ),
  },
  {
    name: "Weekends",
    rate: 16,
    validIf: Conditional.some(
      RateValidIf.of({
        rentalHasTypes: Conditional.some(RentalType.Rehearsal),
        weekdays: [6, 7],
      })
    ),
  },
  {
    name: "Member Rush",
    rate: 8,
    validIf: Conditional.some(
      RateValidIf.of({
        rentalHasTypes: Conditional.some(RentalType.Rehearsal),
        startHoursWithin: 24,
      })
    ),
  },
];

export const brooklynArtsExchange = withPlaces(
  "Brooklyn Arts Exchange",
  {
    shortName: "BAX",
    hours,
  },
  [
    withSlots("Studio A", { bookingStrategy, links, rates }, getSlots("Studio A")),
    withSlots("Studio B", { bookingStrategy, links, rates }, getSlots("Studio B")),
    withSlots("Studio C", { bookingStrategy, links, rates }, getSlots("Studio C")),
    withSlots("Studio D", { bookingStrategy, links, rates }, getSlots("Studio D")),
  ]
);
