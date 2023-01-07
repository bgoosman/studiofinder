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
  return (
    <div className={classNames("card card-compact rounded-none", className)}>
      <div className="card-body p-0 md:p-4 mt-2">
        <div className="card-title">
          <h2 className="text-xl px-4" data-testid="datetime">
            {title}
          </h2>
        </div>
        <div className="overflow-x-hidden">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th className="text-left pl-4">studio</th>
                <th className="text-center">rates</th>
                <th className="text-right pr-0">time</th>
                <th className="text-left"></th>
              </tr>
            </thead>
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
                      <td className="w-full p-0 pl-4 md:min-w-[128px] md:p-2 md:w-auto">
                        <div className="breadcrumbs p-0 md:py-2">
                          <ul>
                            {parent.meta.shortName ? (
                              <li>{parent.meta.shortName}</li>
                            ) : parent.name != place.name ? (
                              <li>{parent.name}</li>
                            ) : null}
                            <li>{place.name}</li>
                          </ul>
                        </div>
                      </td>
                      <td className="text-xs p-0 md:p-2 px-2 text-left">
                        <RatesPopover rates={rates} />
                      </td>
                      <td className="text-xs p-0 md:p-2 md:min-w-[75px] text-right">
                        <TimeRange start={slot.start} end={slot.end} />
                      </td>
                      <td className="w-full p-0 md:p-2 text-left md:text-left">
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
