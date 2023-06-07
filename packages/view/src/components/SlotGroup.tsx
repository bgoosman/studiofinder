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

export const SlotGroup = memo(({ className, slots, title }: SlotGroupProps) => {
  console.log("SlotGroup", { title, slots });
  return (
    <div className={classNames("card card-compact rounded-none", className)}>
      <div className="card-body p-0 md:p-4 mt-2">
        <div className="card-title">
          <h2 className="text-xl px-4" data-testid="datetime">
            {title}
          </h2>
        </div>
        <div className="overflow-x-hidden">
          <table className="table table-auto w-full">
            <tbody>
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
                    <tr key={`${placeId + start + end}`}>
                      <td className="p-4 pl-4 md:min-w-[128px] md:p-2 md:w-auto grid grid-cols-1">
                        <div className="breadcrumbs p-0 flex gap-x-3">
                          <ul>
                            {parent.meta.shortName ? (
                              <li>{parent.meta.shortName}</li>
                            ) : parent.name != place.name ? (
                              <li>{parent.name}</li>
                            ) : null}
                            <li>{place.name}</li>
                          </ul>
                          <TimeRange start={slot.start} end={slot.end} />
                          <RatesPopover rates={rates} />
                        </div>
                        <div>
                          <div className="badge badge-ghost">
                            {place.meta.floor?.type}
                          </div>
                        </div>
                      </td>
                      <td className="p-0 md:p-2 text-left md:text-left">
                        {links.length > 0 && <SlotActionsPopover slot={slot} />}
                      </td>
                    </tr>
                  )
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});
