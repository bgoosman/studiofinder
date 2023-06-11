import { Badge, Breadcrumbs } from "@mantine/core";
import classNames from "classnames";
import { memo } from "react";
import { ResolvedSlot } from "finder/src/types/Slot";
import { getPlaceById } from "../state/places";
import { RatesPopover } from "./RatesPopover";
import { SlotActionsPopover } from "./SlotDropdown";
import { TimeRange } from "./TimeRange";
import { getEnabledRentalTypes } from "../state/filters/rentalTypeFilter";
import { isValidRate, useSlotFilter } from "../state/slotFilters";
import { priceFilter } from "../state/filters/priceFilter";

export interface SlotGroupProps {
  className?: string;
  slots: readonly ResolvedSlot[];
  title: string;
}

function truncate(s: string, limit: number = 10) {
  return s.length > limit ? s.slice(0, limit) + "..." : s;
}

export const SlotGroup = memo(({ className, slots, title }: SlotGroupProps) => {
  const rentalTypeFilter = useSlotFilter("rentalType");
  const priceFilter = useSlotFilter("price");

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
                <div className="flex-col gap-x-3 gap-y-3 inline-flex">
                  <div className="flex gap-x-1">
                    <Breadcrumbs separator=">">
                      {parent.meta.shortName ? (
                        <span>{parent.meta.shortName}</span>
                      ) : parent.name != place.name ? (
                        <span>{parent.name}</span>
                      ) : null}
                      <span>{truncate(place.name, 20)}</span>
                      <TimeRange start={slot.start} end={slot.end} />
                    </Breadcrumbs>
                  </div>
                  <div className="flex gap-x-1 items-center">
                    {rates.map((rate) => {
                      const enabledRentalTypes = getEnabledRentalTypes(rentalTypeFilter);
                      if (
                        isValidRate(
                          priceFilter,
                          enabledRentalTypes,
                          rentalTypeFilter
                        )(rate)
                      ) {
                        return <RatesPopover key={rate.rate} rate={rate} rates={rates} />;
                      }
                    })}
                    <Badge variant="outline" size="sm">
                      {place.meta.floor?.type}
                    </Badge>
                    {links.length > 0 && <SlotActionsPopover slot={slot} />}
                  </div>
                </div>
              </div>
            </div>
          )
        );
      })}
    </div>
  );
});
