import * as A from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";
import * as T from "fp-ts/Task";
import { cloneDeep, omit } from "lodash";
import { map } from "rubico";
import { resolveEmailStrategy } from "./resolvers/emailStrategy";
import { Link } from "./types/Link";
import { Place, ResolvedPlace, ResolvedPlaceMeta } from "./types/Place";
import { ResolvedSlot, resolvedSlotsOrderedByDate, Slot } from "./types/Slot";

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
  };
};

export const resolvePlace = async (
  place: Place,
  path: string[]
): Promise<ResolvedPlace> => {
  const { name, meta, places } = place;
  path.push(name);
  const id = path.join(">");
  const slots = await place.slots();
  return {
    id,
    name,
    path,
    slots: await pipe(
      await map(resolveSlot(id, place))(slots),
      A.filter((slot: ResolvedSlot) => new Date(slot.start) > new Date()),
      A.sort(resolvedSlotsOrderedByDate)
    ),
    meta: await resolvePlaceMeta(place),
    places: await map((place: Place) => resolvePlace(place, [...path]))(places),
  };
};
