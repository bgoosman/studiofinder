import * as T from "fp-ts/Task";
import { map, pipe } from "rubico";
import { dateRange, daysFrom, now } from "../datetime/datetime-fns";
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

const range = dateRange(now(), daysFrom(60));
const hours = numberRange(8, 23);
const getSlots = (calendarId: string) =>
  pipe([
    fetchGoogleCalendar({ calendarId, range }),
    map(mapGoogleEventToSlot),
    invertSlots({ range, hours }),
  ]);

const commonLinks = [
  T.of(Link.of("About Triskelion Arts", "https://www.triskelionarts.org/about-us")),
  T.of(Link.of("How to rent", "https://www.triskelionarts.org/new-renters")),
];

export const triskelion = withPlaces(
  "Triskelion Arts",
  {
    shortName: "Trisk",
  },
  [
    withSlots(
      "Theater",
      {
        floor: {
          type: Material.Marley,
          size: "28 feet,43 feet",
        },
        maxOccupancy: 15,
        links: [
          T.of(Link.of("About Theater", "https://www.triskelionarts.org/our-theater")),
          ...commonLinks,
        ],
        photos: [
          Photo.of(
            "black marley floor, theater lights, black walls",
            "https://images.squarespace-cdn.com/content/v1/5d310a1b0b0f72000101da97/dd7aefb4-62dd-4899-9b14-e840fcd6f573/Theater+from+downstage+right.jpg?format=1000w"
          ),
          Photo.of(
            "black marley floor, red chairs",
            "https://images.squarespace-cdn.com/content/v1/5d310a1b0b0f72000101da97/2631746e-5fb8-4d5b-bcc7-6704c971d1e0/Theater+from+stage.jpg?format=1000w"
          ),
        ],
        rates: [
          {
            rate: 17,
            validIf: Conditional.some(
              RateValidIf.of({
                minHours: 1,
                rentalHasTypes: Conditional.some(RentalType.Dance, RentalType.Rehearsal),
              })
            ),
          },
          {
            rate: 50,
            validIf: Conditional.some(
              RateValidIf.of({
                minHours: 2,
                rentalHasTypes: Conditional.some(
                  Conditional.all(RentalType.Class, RentalType.Virtual),
                  Conditional.all(RentalType.Audition, RentalType.Virtual),
                  Conditional.all(RentalType.Class, RentalType.InPerson),
                  Conditional.all(RentalType.Audition, RentalType.InPerson),
                  RentalType.SelfTapeAudition,
                  RentalType.TableRead
                ),
              })
            ),
          },
          {
            rate: 75,
            validIf: Conditional.some(
              RateValidIf.of({
                minHours: 3,
                rentalHasTypes: Conditional.all(RentalType.MediaProduction),
              })
            ),
          },
        ],
      },
      getSlots("6gogas57f0oddon1esnp4la7uc")
    ),
    withSlots(
      "Doug",
      {
        amenities: [Amenity.Mirror],
        floor: {
          type: Material.Wood,
          size: "27 feet, 30 feet",
        },
        maxOccupancy: 10,
        photos: [
          Photo.of(
            "wood floor, 5 windows, white wall, mirror",
            "https://images.squarespace-cdn.com/content/v1/5d310a1b0b0f72000101da97/1616171650550-LZAQD3THAGHYJ9VTWVB3/Image+of+Doug+studio.+A+large+studio+with+wood+floors%2C+white+walls%2C+a+mirror+with+curtain+and+five+sunlit+windows.?format=2500w"
          ),
        ],
        links: [
          T.of(Link.of("About Doug", "https://www.triskelionarts.org/doug-rates")),
          ...commonLinks,
        ],
        rates: [
          {
            rate: 17,
            validIf: Conditional.some(
              RateValidIf.of({
                minHours: 1,
                rentalHasTypes: Conditional.some(RentalType.Rehearsal),
              })
            ),
          },
          {
            rate: 35,
            validIf: Conditional.some(
              RateValidIf.of({
                minHours: 0,
                rentalHasTypes: Conditional.some(
                  Conditional.all(RentalType.Class, RentalType.Virtual),
                  Conditional.all(RentalType.Audition, RentalType.Virtual),
                  Conditional.all(RentalType.Class, RentalType.InPerson),
                  Conditional.all(RentalType.Audition, RentalType.InPerson),
                  RentalType.SelfTapeAudition,
                  RentalType.TableRead
                ),
              })
            ),
          },
          {
            rate: 50,
            validIf: Conditional.some(
              RateValidIf.of({
                minHours: 2,
                rentalHasTypes: Conditional.all(RentalType.SmallMediaProduction),
              }),
              RateValidIf.of({
                minHours: 4,
                rentalHasTypes: Conditional.all(RentalType.LargeMediaProduction),
              })
            ),
          },
        ],
      },
      getSlots("uceogoama2cd43fj0pojieafas")
    ),
    withSlots(
      "Stu",
      {
        amenities: [Amenity.Mirror],
        floor: {
          type: Material.Wood,
          size: "19 feet, 17 feet",
        },
        maxOccupancy: 6,
        links: [
          T.of(Link.of("About Stu", "https://www.triskelionarts.org/stuart-rates")),
          ...commonLinks,
        ],
        photos: [
          Photo.of(
            "wood floor, 5 windows",
            "https://images.squarespace-cdn.com/content/v1/5d310a1b0b0f72000101da97/a16f2f8f-116c-438d-aa54-f8a2a0443668/STU+STUDIO+1.png?format=2500w"
          ),
        ],
        rates: [
          {
            rate: 11,
            validIf: Conditional.some(
              RateValidIf.of({
                minHours: 1,
                rentalHasTypes: Conditional.all(RentalType.Rehearsal),
              })
            ),
          },
          {
            rate: 30,
            validIf: Conditional.some(
              RateValidIf.of({
                minHours: 2,
                rentalHasTypes: Conditional.some(
                  Conditional.all(
                    RentalType.Class,
                    Conditional.some(RentalType.Virtual, RentalType.InPerson)
                  ),
                  Conditional.all(
                    RentalType.Audition,
                    Conditional.some(RentalType.Virtual, RentalType.InPerson)
                  ),
                  RentalType.SelfTapeAudition,
                  RentalType.TableRead
                ),
              })
            ),
          },
          {
            rate: 40,
            validIf: Conditional.some(
              RateValidIf.of({
                minHours: 2,
                rentalHasTypes: Conditional.all(RentalType.SmallMediaProduction),
              }),
              RateValidIf.of({
                minHours: 4,
                rentalHasTypes: Conditional.all(RentalType.LargeMediaProduction),
              })
            ),
          },
        ],
      },
      getSlots("dche191t1jdue3ueh0aucfivgg")
    ),
    withSlots(
      "Lillian",
      {
        amenities: [Amenity.Mirror],
        floor: {
          type: Material.Wood,
          size: "19 feet, 11 feet",
        },
        maxOccupancy: 4,
        photos: [
          Photo.of(
            "wood floor, 2 windows, white wall, mirror",
            "https://images.squarespace-cdn.com/content/v1/5d310a1b0b0f72000101da97/a702542a-187b-4214-8816-38002b18c119/Lillian.jpg?format=2500w"
          ),
        ],
        links: [
          T.of(Link.of("About Lillian", "https://www.triskelionarts.org/lillian-rates")),
          ...commonLinks,
        ],
        rates: [
          {
            rate: 8,
            validIf: Conditional.some(
              RateValidIf.of({
                minHours: 1,
                rentalHasTypes: Conditional.all(RentalType.Rehearsal),
              })
            ),
          },
          {
            rate: 25,
            validIf: Conditional.some(
              RateValidIf.of({
                minHours: 2,
                rentalHasTypes: Conditional.some(
                  Conditional.all(RentalType.Class, RentalType.Virtual),
                  Conditional.all(RentalType.Audition, RentalType.Virtual),
                  Conditional.all(RentalType.Class, RentalType.InPerson),
                  RentalType.SelfTapeAudition,
                  RentalType.TableRead
                ),
              })
            ),
          },
          {
            rate: 40,
            validIf: Conditional.some(
              RateValidIf.of({
                minHours: 2,
                rentalHasTypes: Conditional.all(RentalType.SmallMediaProduction),
              }),
              RateValidIf.of({
                minHours: 4,
                rentalHasTypes: Conditional.all(RentalType.LargeMediaProduction),
              })
            ),
          },
        ],
      },
      getSlots("ij9qrqv3ibncpghtpgtp25r2ng")
    ),
  ]
);
