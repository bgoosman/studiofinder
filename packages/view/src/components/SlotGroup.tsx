import classNames from "classnames";
import { memo } from "react";
import { ResolvedSlot } from "finder/src/types/Slot";
import { getPlaceById } from "../state/places";
import { RatesPopover } from "./RatesPopover";
import { SlotActionsPopover } from "./SlotDropdown";
import { TimeRange } from "./TimeRange";

export interface SlotGroupProps {
  className?: string;
  slots: readonly ResolvedSlot[];
  title: string;
}

function truncate(s: string, limit: number = 10) {
  return s.length > limit ? s.slice(0, limit) + "..." : s;
}

export const SlotGroup = memo(({ className, slots, title }: SlotGroupProps) => {
  return (
    <div className={classNames("card card-compact rounded-none", className)}>
      <div className="card-body p-0 md:p-4 mt-2">
        <div className="card-title">
          <h2 className="text-xl px-4" data-testid="datetime">
            {title}
          </h2>
        </div>
        <div className="overflow-x-hidden divide-y">
          {slots.map((slot) => {
            const { placeId, start, end, links, rates } = slot;
            const place = getPlaceById(placeId)!;
            if (!place) {
              console.error(`Place with id ${placeId} not found`);
            }

            const parent = getPlaceById(place.path.slice(0, -1).join(">"))!;
            if (!parent) {
              console.error(`Parent of place with id ${placeId} not found`);
            }

            return (
              rates &&
              rates.length > 0 && (
                <div key={`${placeId + start + end}`} className="flex items-center">
                  <div className="flex-grow p-4 pl-4 md:min-w-[128px] md:p-2 md:w-auto grid grid-cols-1 gap-x-3">
                    <div className="flex items-center gap-x-3">
                      <div className="breadcrumbs">
                        <ul>
                          {parent.meta.shortName ? (
                            <li>{parent.meta.shortName}</li>
                          ) : parent.name != place.name ? (
                            <li>{parent.name}</li>
                          ) : null}
                          <li>{truncate(place.name, 20)}</li>
                        </ul>
                      </div>
                      <TimeRange start={slot.start} end={slot.end} />
                    </div>
                    <div className="flex gap-x-3">
                      <RatesPopover rates={rates} />
                      <div className="badge badge-ghost">{place.meta.floor?.type}</div>
                    </div>
                  </div>
                  <div className="flex-shrink p-0 md:p-2 text-left md:text-left">
                    {links.length > 0 && <SlotActionsPopover slot={slot} />}
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
});
