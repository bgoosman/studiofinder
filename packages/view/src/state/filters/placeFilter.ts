import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/function";
import { getPlaceById, getPlacesById } from "../places";
import { SlotFilter } from "./filters";

export type PlacesFilter = Record<string, boolean>;

export const placesFilter: SlotFilter<PlacesFilter> = {
  getDefault: () =>
    pipe(
      getPlacesById(),
      R.map((place) => place.name === "Universe")
    ),
};

export const setPlaceFilter =
  (value: boolean) =>
  (placeId: string) =>
  (oldFilter: PlacesFilter): PlacesFilter => {
    if (!value) {
      // If unchecking the place, uncheck all children
      // 1. Find all the places in the subtree rooted at placeId
      const isChild: Record<string, boolean> = pipe(
        getPlacesById(),
        R.map((place) => place.id.startsWith(placeId))
      );

      // 2. Set all of them to false
      return pipe(
        oldFilter,
        R.mapWithIndex((id, oldValue) => (!isChild[id] ? oldValue : false))
      );
    } else {
      // Enable any children of this place which have no children themselves.
      const thisPlace = getPlaceById(placeId)!;
      const newLeafNodes = R.fromEntries(
        thisPlace.places
          .filter((place) => place.places.length === 0)
          .map((place) => [place.id, true])
      );

      // Otherwise, just enable this place.
      return {
        ...oldFilter,
        ...newLeafNodes,
        [placeId]: value,
      };
    }
  };
