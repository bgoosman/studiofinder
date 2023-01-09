import { ResolvedPlace } from "finder/src/types/Place";
import { join } from "fp-ts-std/Array";
import { values } from "fp-ts-std/Record";
import { flow, pipe } from "fp-ts/lib/function";
import { groupBy } from "fp-ts/lib/NonEmptyArray";
import { map } from "fp-ts/lib/Record";
import { entity } from "simpler-state";
import universeJson from "../../slots/universe.json";

export const traversePlace =
  <T>(fn: (place: ResolvedPlace) => T) =>
  (parent: ResolvedPlace): Record<ResolvedPlace["id"], T> => {
    const result = { [parent.id]: fn(parent) };
    if (parent.places) {
      for (const child of parent.places) {
        const childResult = traversePlace(fn)(child);
        Object.assign(result, childResult);
      }
    }
    return result;
  };

const universe = entity<ResolvedPlace>(universeJson as ResolvedPlace);

export const getUniverse = universe.get;
export const useCreatedAt = () => universe.use((place) => place.createdAt);

export type ResolvedPlaceById = Record<ResolvedPlace["id"], ResolvedPlace>;
export const placesById = entity<ResolvedPlaceById>(
  traversePlace((place) => place)(getUniverse())
);

export const getPlacesById = placesById.get;
export const getPlaceById = (id: string) => getPlacesById()[id];

export const joinPath = join(">");
export const getParentPath = (place: ResolvedPlace) => place.path.slice(0, -1);
export const getJoinedParentPath = flow(getParentPath, joinPath);
export const getDepth = (place: ResolvedPlace) => String(place.path.length - 1);

export type ResolvedPlacesByParentPath = Record<string, ResolvedPlace[]>;
export type PlacesByParentPathByDepth = Array<ResolvedPlacesByParentPath>;
const placesByParentPathByDepth = entity(
  pipe(
    getPlacesById(),
    values,
    groupBy(getDepth),
    map(groupBy(getJoinedParentPath)),
    values
  )
);
export const getPlacesByParentPathByDepth = placesByParentPathByDepth.get;
export const usePlacesByParentPathByDepth = placesByParentPathByDepth.use;
