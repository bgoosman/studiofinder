import classNames from "classnames";
import { flatten, map, some, values } from "lodash";
import { ResolvedPlace } from "@finder/Place";
import { usePlacesByParentPathByDepth } from "../state/places";
import { useSlotFilter } from "../state/slotFilters";
import { PlaceFilterButton } from "./PlaceFilterButton";

export type PlaceFilterTreeProps = {
  className?: string;
};

export const PlaceFilterTree = ({ className }: PlaceFilterTreeProps) => {
  const allDepths = usePlacesByParentPathByDepth();
  const placeFilters = useSlotFilter("place");
  const isEnabled = (place: ResolvedPlace) => placeFilters[place.id];
  const getPlacesAtDepth = (depth: number) => flatten(values(allDepths[depth]));

  return (
    <div className={classNames(className, "")}>
      {map(
        allDepths.slice(1) /* skip Universe */,
        (placesByParentPath, depthMinusOne) => {
          const depth: number = depthMinusOne + 1;
          const placesInPreviousDepth = getPlacesAtDepth(depth - 1);
          const isThisDepthVisible: boolean = some(placesInPreviousDepth, isEnabled);
          return (
            isThisDepthVisible && (
              <div className={classNames("flex flex-wrap w-full gap-x-2")} key={depth}>
                {map(placesByParentPath, (places, parentPath) => {
                  const pathUpToThisDepth = parentPath.split(">");
                  // True if any of the places in this path are enabled, in the previous depth
                  // Except if this group has one place which has no children, and the place is enabled
                  const isThisGroupVisible =
                    some(
                      placesInPreviousDepth,
                      (place) =>
                        isEnabled(place) && place.id == pathUpToThisDepth.join(">")
                    ) &&
                    !(
                      places.length === 1 &&
                      isEnabled(places[0]) &&
                      places[0].places.length === 0
                    );
                  return (
                    isThisGroupVisible && (
                      <div className="" key={parentPath}>
                        {pathUpToThisDepth.length >= 2 && (
                          <div className="pr-2 pl-2 pb-1 text-sm breadcrumbs">
                            <ul>
                              {[pathUpToThisDepth.at(-1)].map((part) => (
                                <li key={part}>{part}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {map(places, (place) => (
                            <PlaceFilterButton key={place.id} place={place} />
                          ))}
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            )
          );
        }
      )}
    </div>
  );
};
