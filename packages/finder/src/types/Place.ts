import * as T from "fp-ts/Task";
import { Amenity } from "./Amenity";
import { Conditional } from "./Conditional";
import { EmailStrategy } from "./EmailStrategy";
import { Floor } from "./Floor";
import { Link } from "./Link";
import { NumberRange } from "./NumberRange";
import { Photo } from "./Photo";
import { RateValidIf } from "./RateValidIf";
import { RentalRate } from "./RentalRate";
import { GetSlots, ResolvedSlot } from "./Slot";

export type PlaceMeta = {
  amenities?: Amenity[];
  bookingStrategy?: EmailStrategy;
  floor?: Floor;
  hours?: NumberRange;
  links?: T.Task<Link>[];
  maxOccupancy?: number;
  photos?: Photo[];
  rates?: Array<RentalRate>;
  shortName?: string;
};

export type PlaceOptions = {
  places?: Place[];
  slots?: GetSlots;
  meta: PlaceMeta;
};

export type Place = {
  name: string;
} & Required<PlaceOptions>;

export type ResolvedPlaceMeta = Omit<PlaceMeta, "links"> & {
  links: Link[];
  squareFootage?: number;
};

export type ResolvedPlace = {
  id: string;
  name: string;
  path: string[];
  places: ResolvedPlace[];
  slots: ResolvedSlot[];
  meta: ResolvedPlaceMeta;
  createdAt?: string;
};

export function makePlace(
  name: string,
  { meta, slots = () => Promise.resolve([]), places = [] }: PlaceOptions
): Place {
  // Explode the conditional so it's easier to match allowed types
  meta.rates?.forEach((rate) => {
    rate.types = [];
    rate.validIf.expressions.forEach((ce) => {
      const validIf = ce as RateValidIf;
      if (validIf.rentalHasTypes) {
        const exploded = Conditional.explode(validIf.rentalHasTypes);
        validIf.rentalHasTypesExploded = exploded;
        rate.types!.push(...exploded);
      }
    });
  });

  return {
    name,
    meta,
    slots,
    places,
  };
}

export function withSlots(name: string, meta: PlaceMeta, slots: GetSlots): Place {
  return makePlace(name, { slots, meta });
}

export function withPlaces(name: string, meta: PlaceMeta, places: Place[]): Place {
  return makePlace(name, { places, meta });
}
