import { Badge, Breadcrumbs } from "@mantine/core";
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
    <div className="mb-3">
      <h2 className="m-0" data-testid="datetime">
        {title}
      </h2>
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
              <div className="flex-grow py-2 pl-0 gap-x-3 gap-y-2">
                <div className="flex items-center gap-x-3">
                  <Breadcrumbs separator=">">
                    {parent.meta.shortName ? (
                      <span>{parent.meta.shortName}</span>
                    ) : parent.name != place.name ? (
                      <span>{parent.name}</span>
                    ) : null}
                    <span>{truncate(place.name, 20)}</span>
                  </Breadcrumbs>
                  <TimeRange start={slot.start} end={slot.end} />
                  <RatesPopover rates={rates} />
                  <Badge variant="outline">{place.meta.floor?.type}</Badge>
                  {links.length > 0 && <SlotActionsPopover slot={slot} />}
                </div>
              </div>
            </div>
          )
        );
      })}
    </div>
  );
});
