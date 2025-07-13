import { ActionIcon, Badge, Breadcrumbs } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { ResolvedSlot } from "finder/src/types/Slot";
import { memo } from "react";
import { getEnabledRentalTypes } from "../state/filters/rentalTypeFilter";
import { getPlaceById } from "../state/places";
import { isValidRate, useSlotFilter } from "../state/slotFilters";
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
  const rentalTypeFilter = useSlotFilter("rentalType");
  const priceFilter = useSlotFilter("price");

  const onCopySlot = (slot: ResolvedSlot) => {
    const place = getPlaceById(slot.placeId)!;
    const parent = getPlaceById(place.path.slice(0, -1).join(">"))!;
    
    const slotInfo = `${parent.name} > ${place.name} - ${new Date(slot.start).toLocaleString()} to ${new Date(slot.end).toLocaleString()}`;
    
    navigator.clipboard.writeText(slotInfo).catch((err) => {
      console.error('Failed to copy slot info:', err);
    });
    
    notifications.show({
      title: "Slot copied",
      message: "Slot information has been copied to clipboard",
      color: "teal",
      icon: <IconCheck size="1.25rem" />,
      autoClose: 2000,
    });
  };

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
                    <ActionIcon 
                      size="xs" 
                      onClick={() => onCopySlot(slot)}
                      title="Copy slot information"
                    >
                      <IconCopy size="1.25rem" />
                    </ActionIcon>
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
