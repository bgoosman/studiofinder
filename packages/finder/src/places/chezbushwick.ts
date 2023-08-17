/**
 * Chez Bushwick is currently accepting bookings for rehearsals,
 * classes, workshops, and photo/video shoots.
 * The studio can be rented from **7am-11pm, everyday.**
 * Please check the availability calendar below for current openings.
 * We accept rental requests up to 3 months in advance of today’s date.
 * All rental requests must be emailed to
 * [studio@jonahbokaer.net](https://www.chezbushwick.net/studio@jonahbokaer.net)
 */

import * as T from "fp-ts/Task";
import { map, pipe } from "rubico";
import { dateRange, monthsFrom, now } from "../datetime/datetime-fns";
import { fetchGoogleCalendar, mapGoogleEventToSlot } from "../providers/googleCalendar";
import { invertSlots } from "../slots/invertSlots";
import { Amenity } from "../types/Amenity";
import { Conditional } from "../types/Conditional";
import { Material } from "../types/Floor";
import { Link } from "../types/Link";
import { numberRange } from "../types/NumberRange";
import { Photo } from "../types/Photo";
import { withPlaces, withSlots } from "../types/Place";
import { RateValidIf } from "../types/RateValidIf";
import { RentalType } from "../types/RentalType";

const range = dateRange(now(), monthsFrom(3));
const getSlots = pipe([
  fetchGoogleCalendar({ calendarId: "k2ag5rf4m10vmfpqv31t5mhig4", range }),
  map(mapGoogleEventToSlot),
  invertSlots({
    range,
    hours: numberRange(7, 23),
  }),
]);

// getSlots().then((slots) => console.log(slots));//?

export const chezbushwick = withPlaces("Chez Bushwick", {}, [
  withSlots(
    "Chez Bushwick",
    {
      amenities: [
        Amenity.AirConditioning,
        Amenity.Mirror,
        Amenity.ProjectionScreen,
        Amenity.WiFi,
      ],
      floor: {
        type: Material.Wood,
        size: "23 feet,48 feet",
      },
      links: [
        T.of(Link.of("How to rent", "https://www.chezbushwick.net/rentals")),
        T.of(Link.of("About Chez Bushwick", "https://www.chezbushwick.net/studio")),
      ],
      photos: [
        Photo.of(
          "Two walls, tall windows, wood floor",
          "https://images.squarespace-cdn.com/content/v1/5dc064f2e6229c77b655bce0/1623363031679-XJJ6MY5HP8N29LNMK5DH/JB11.jpg?format=500w"
        ),
        Photo.of(
          "Entrance, sound system, seating",
          "https://images.squarespace-cdn.com/content/v1/5dc064f2e6229c77b655bce0/1625067654060-XB5QZ0D0EB0926DV5HVX/IMG-5558.jpg"
        ),
        Photo.of(
          "Bathroom door, sound system, mirror",
          "https://images.squarespace-cdn.com/content/v1/5dc064f2e6229c77b655bce0/1625067658295-2DDPRYTOL557AY26CY41/IMG-5567.jpg?format=500w"
        ),
      ],
      rates: [
        {
          rate: 8,
          validIf: Conditional.some(
            RateValidIf.of({
              rentalHasTypes: Conditional.some(
                Conditional.all(RentalType.Rehearsal, RentalType.Member)
              ),
            })
          ),
        },
        {
          rate: 15,
          validIf: Conditional.some(
            RateValidIf.of({
              rentalHasTypes: Conditional.some(
                Conditional.all(RentalType.Rehearsal, RentalType.NonMember)
              ),
            })
          ),
        },
        {
          rate: 20,
          validIf: Conditional.some(
            RateValidIf.of({
              rentalHasTypes: Conditional.some(
                Conditional.all(
                  RentalType.Member,
                  Conditional.some(
                    RentalType.Class,
                    RentalType.Showing,
                    RentalType.Audition
                  )
                )
              ),
            })
          ),
        },
        {
          rate: 30,
          validIf: Conditional.some(
            RateValidIf.of({
              rentalHasTypes: Conditional.all(RentalType.Member, RentalType.PhotoShoot),
            })
          ),
        },
        {
          rate: 35,
          validIf: Conditional.some(
            RateValidIf.of({
              rentalHasTypes: Conditional.all(
                RentalType.NonMember,
                Conditional.some(
                  RentalType.Class,
                  RentalType.Showing,
                  RentalType.Audition
                )
              ),
            })
          ),
        },
        {
          rate: 40,
          validIf: Conditional.some(
            RateValidIf.of({
              rentalHasTypes: Conditional.all(
                RentalType.NonMember,
                RentalType.PhotoShoot
              ),
            })
          ),
        },
      ],
    },
    getSlots
  ),
]);
