/**
 * The Woods
 * Dance Rehearsals:  $10/hr (minimum 2hrs)
 * Dance Classes & Auditions/Theater Rehearsals: $15/hr (minimum 2hrs)
 * Yoga, Pilates/Music Rehearsals: $20/hr (minimum 1.5 hrs)
 * Photo/Video Shoot: $30/hr
 * Dance/Performance events: $50/hr (minimum 4 hours)
 */

import * as cheerio from "cheerio";
import * as T from "fp-ts/Task";
import { DateTime } from "luxon";

import { dateRange, DateRange, monthsFrom, now } from "../datetime/datetime-fns";
import { invertSlots } from "../slots/invertSlots";
import { Amenity } from "../types/Amenity";
import { Conditional } from "../types/Conditional";
import { Material } from "../types/Floor";
import { Link } from "../types/Link";
import { Photo } from "../types/Photo";
import { PlaceMeta, withPlaces, withSlots } from "../types/Place";
import { RateValidIf } from "../types/RateValidIf";
import { RentalType } from "../types/RentalType";
import { Slot } from "../types/Slot";

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

const getSlots = async () => {
  const response = await fetch(tokensUrl);
  const rvc = getRVC(response);
  const rvt = await getRVT(response);
  const bookingsResponse = await fetch(bookingsUrl(range), {
    headers: {
      authority: "thewoods.skedda.com",
      cookie: `X-Skedda-RequestVerificationCookie=${rvc}`,
      dnt: "1",
      referrer: tokensUrl,
      "x-skedda-requestverificationtoken": rvt,
    },
  } as RequestInit);
  const json = await bookingsResponse.json();
  const unavailability = json.bookings.map((booking: Slot) =>
    Slot.of(booking.start, booking.end)
  );
  const inverted = invertSlots({ range, hours: [0, 23] })(unavailability);
  return inverted;
};

const getPlaceMeta = (): PlaceMeta => ({
  amenities: [Amenity.Mirror],
  floor: {
    type: Material.Wood,
    size: "30 feet, 30 feet",
  },
  links: [
    T.of(Link.of("About The Woods", "https://www.thewoodsuniverse.com/the-space.html")),
    T.of(Link.of("How to rent", "https://www.thewoodsuniverse.com/")),
  ],
  photos: [
    Photo.of(
      "column, wood floor, front door",
      "https://www.thewoodsuniverse.com/uploads/1/2/4/0/124068959/img-0066_orig.jpg"
    ),
    Photo.of(
      "back of room, windows, column",
      "https://www.thewoodsuniverse.com/uploads/1/2/4/0/124068959/img-0126_orig.jpg"
    ),
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
  withSlots("The Woods", getPlaceMeta(), () => getSlots()),
]);
