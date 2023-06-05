import * as A from "fp-ts/Array";
import * as T from "fp-ts/Task";
import path from "path";
import { fromJsonFiles } from "../providers/jsonFiles";
import { Conditional } from "../types/Conditional";
import { Discount } from "../types/Discount";
import { Link } from "../types/Link";
import { numberRange } from "../types/NumberRange";
import { PlaceMeta } from "../types/Place";
import { RateValidIf } from "../types/RateValidIf";
import { Rate, RentalRate } from "../types/RentalRate";
import { RentalType } from "../types/RentalType";

export const gibneyLinks = [
  T.of(Link.of("Rental form", "https://gibney.force.com/")),
  T.of(
    Link.of(
      "Rental FAQ",
      "https://gibneydance.org/space-rental-frequently-asked-questions/"
    )
  ),
];

const earlyBirdSpecial: Discount = {
  name: "Early-bird special",
  description:
    "Gibney offers half-price rentals in all studios for rentals that begin between 8am-10am Monday-Friday.",
  validIf: Conditional.all(
    RateValidIf.of({
      betweenHours: numberRange(8, 10),
      weekdays: [1, 2, 3, 4, 5],
    })
  ),
  apply: (rate) => rate * 0.5,
};

const twentyFourHourSpecial: Discount = {
  name: "24-hour Special",
  description: `Gibney offers half-price rentals in all studios for rentals requested 24 hours or less in advance of the rental start time.`,
  validIf: Conditional.all(
    RateValidIf.of({
      startHoursWithin: 24,
    })
  ),
  apply: (rate) => rate * 0.5,
};

export const nonProfitDanceRehearsalDiscounts = [earlyBirdSpecial, twentyFourHourSpecial];

export const getGibneySlots = (name: string) => (child: string) =>
  fromJsonFiles(path.join(__dirname, "../../../gibney/dist"), `${name}/${child}`)

export const getStudioMeta = (meta: Partial<PlaceMeta> & {nonProfitDanceRehearsalRate: Rate}): PlaceMeta => {
  const baseRate: RentalRate = {
    rate: meta.nonProfitDanceRehearsalRate,
    validIf: Conditional.some(
      RateValidIf.of({
        rentalHasTypes: Conditional.all(
          RentalType.NonProfit,
          RentalType.Dance,
          RentalType.Rehearsal
        ),
      })
    ),
  };
  return {
    floor: meta.floor,
    links: [...gibneyLinks],
    rates: [
      baseRate,
      ...A.map((discount: Discount) => RentalRate.applyDiscount(discount)(baseRate))(
        nonProfitDanceRehearsalDiscounts
      ),
    ],
  };
};
