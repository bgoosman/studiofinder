import * as A from "fp-ts/Array";
import * as T from "fp-ts/Task";
import { pipe } from "fp-ts/lib/function";
import { cloneDeep, omit } from "lodash";
import { map } from "rubico";
import { resolveEmailStrategy } from "./resolvers/emailStrategy";
import { Floor } from "./types/Floor";
import { Link } from "./types/Link";
import { Place, ResolvedPlace, ResolvedPlaceMeta } from "./types/Place";
import { ResolvedSlot, Slot, resolvedSlotsOrderedByDate } from "./types/Slot";

// https://levelup.gitconnected.com/how-to-run-sequential-tasks-in-fp-ts-8aa3be991f33
const resolveLinks = async (links: T.Task<Link>[]) =>
  (await T.sequenceArray(links)()) as Array<Link>;

const resolveSlot =
  (placeId: string, place: Place) =>
  async (slot: Slot): Promise<ResolvedSlot> => {
    const { bookingStrategy } = place.meta;
    let bookingStrategyLinks: T.Task<Link>[] = [];
    if (bookingStrategy) {
      switch (bookingStrategy.type) {
        case "email": {
          bookingStrategyLinks.push(
            T.of(resolveEmailStrategy(bookingStrategy, slot, place))
          );
        }
      }
    }

    const { links = [] } = place.meta;
    const resolvedLinks = await resolveLinks([...links, ...bookingStrategyLinks]);

    return { ...slot, placeId, links: resolvedLinks };
  };

export const resolvePlaceMeta = async (place: Place): Promise<ResolvedPlaceMeta> => {
  // links are tasks and shouldn't be cloned directly
  const { meta } = place;
  return {
    ...omit(cloneDeep(meta), ["links"]),
    links: meta.links ? await resolveLinks(meta.links) : [],
    squareFootage: Floor.getSquareFootage(meta?.floor)?.[0],
  };
};

export const resolvePlace = async (
  place: Place,
  path: string[]
): Promise<ResolvedPlace> => {
  const { name, places } = place;
  path.push(name);
  const id = path.join(">");
  // console.log(`Resolving ${id}`);
  const slotsPre = await place.slots();
  let slots: ResolvedSlot[] = [];
  try {
    slots = await pipe(
      await map(resolveSlot(id, place))(slotsPre),
      A.filter((slot: ResolvedSlot) => new Date(slot.start) > new Date()),
      A.sort(resolvedSlotsOrderedByDate)
    );
  } catch (error) {
    console.error(`Failed to resolve ${path}`);
  }
  const meta = await resolvePlaceMeta(place);
  return {
    id,
    name,
    path,
    slots,
    meta,
    places: (await map((place: Place) => resolvePlace(place, [...path]))(places)).filter(
      Boolean
    ),
  };
};
