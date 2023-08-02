import * as T from "fp-ts/Task";

import { Amenity } from "../types/Amenity";
import { Conditional } from "../types/Conditional";
import { Material } from "../types/Floor";
import { Link } from "../types/Link";
import { Photo } from "../types/Photo";
import { PlaceMeta, withPlaces, withSlots } from "../types/Place";
import { RateValidIf } from "../types/RateValidIf";
import { RentalType } from "../types/RentalType";
import { fetchSlotsFromSquareSpace } from "../providers/squareSpace";

const USER_ID = process.env.MOTIVE_USER_ID;
if (!USER_ID) {
  throw new Error("Please set MOTIVE_USER_ID");
}

const API_KEY = process.env.MOTIVE_API_KEY;
if (!API_KEY) {
  throw new Error("Please set MOTIVE_API_KEY");
}

const getSlots = () =>
  fetchSlotsFromSquareSpace({
    USER_ID,
    API_KEY,
  });

const getPlaceMeta = (): PlaceMeta => ({
  amenities: [Amenity.AirConditioning, Amenity.WiFi],
  floor: {
    type: Material.Wood,
    size: "16 feet, 48 feet",
  },
  links: [T.of(Link.of("Rent", "https://www.motivebrooklyn.com/studio-rentals"))],
  photos: [
    Photo.of(
      "two windows, wood floor, two lamps, soft light",
      "https://images.squarespace-cdn.com/content/v1/61007384247d97043b13b01d/1631407764399-UKQKDYROCWLABJW1DS5S/MOtiVE_68Jay-2.jpg?format=2500w"
    ),
  ],
  rates: [
    {
      rate: 15,
      validIf: Conditional.some(
        RateValidIf.of({
          minHours: 2,
          rentalHasTypes: Conditional.all(RentalType.Rehearsal),
        })
      ),
    },
  ],
});

// getSlots().then((slots) => console.log(slots)); //?

export const motive = withPlaces("MOtiVE", {}, [
  withSlots("MOtiVE", getPlaceMeta(), () => getSlots()),
]);
