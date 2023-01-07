import * as T from "fp-ts/Task";
import { map, pipe } from "rubico";
import { dateRange, daysFrom, now } from "../datetime/datetime-fns";
import { fetchGoogleCalendar, mapGoogleEventToSlot } from "../providers/googleCalendar";
import { invertSlots } from "../slots/invertSlots";
import { Conditional } from "../types/Conditional";
import { Link } from "../types/Link";
import { numberRange } from "../types/NumberRange";
import { withPlaces, withSlots } from "../types/Place";
import { RateValidIf } from "../types/RateValidIf";
import { RentalType } from "../types/RentalType";
import { wrapLegacyGetSlots } from "../types/Slot";

const range = dateRange(now(), daysFrom(60));
const hours = numberRange(8, 23);
const getSlots = (calendarId: string) =>
  wrapLegacyGetSlots(
    pipe([
      fetchGoogleCalendar({ calendarId, range }),
      map(mapGoogleEventToSlot),
      invertSlots({ range, hours }),
    ])
  );

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
        maxOccupancy: 15,
        links: [
          T.of(Link.of("About Theater", "https://www.triskelionarts.org/our-theater")),
          ...commonLinks,
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
        maxOccupancy: 10,
        links: [
          T.of(Link.of("About Doug", "https://www.triskelionarts.org/doug-rates")),
          ...commonLinks,
        ],
        rates: [
          {
            rate: 15,
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
        maxOccupancy: 6,
        links: [
          T.of(Link.of("About Stu", "https://www.triskelionarts.org/stuart-rates")),
          ...commonLinks,
        ],
        rates: [
          {
            rate: 10,
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
        maxOccupancy: 4,
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
