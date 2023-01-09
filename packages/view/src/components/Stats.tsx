import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { DateTime } from "luxon";

import { placesById } from "../state/places";
import { useSlotFilter } from "../state/slotFilters";
import { slotsEntity } from "../state/slots";
import { slotGroupsByDate } from "../state/slotsGroupedByDate";

export function Stats() {
  const slots = slotsEntity.use();
  const _placesById = placesById.use();
  const _slotGroupsByDate = slotGroupsByDate.use();
  const totalFilteredSlots = _slotGroupsByDate.reduce(
    (acc, [_, slots]) => acc + slots.length,
    0
  );
  let totalSlotsDateRange;
  if (totalFilteredSlots > 0) {
    const firstDate = _slotGroupsByDate[0]![0];
    const lastDate = _slotGroupsByDate[_slotGroupsByDate.length - 1]![0];
    const format = (date: string) =>
      DateTime.fromISO(date).toLocaleString({ month: "short", day: "2-digit" });
    totalSlotsDateRange = `${format(firstDate)} - ${format(lastDate)}`;
  }

  const placesFilter = useSlotFilter("place");
  const rentablePlaces = Object.values(_placesById).filter(
    (place) => place.places.length == 0
  );
  const enabledRentablePlaces = rentablePlaces.filter((place) => placesFilter[place.id]);

  return (
    <div className="stats shadow shadow-primary">
      <div className="stat p-3 md:p-6">
        <div className="stat-figure text-secondary">
          <CalendarDaysIcon className="h-5 w-5" />
        </div>
        <div className="stat-title">Filtered Slots</div>
        <div className="stat-value">{totalFilteredSlots}</div>
        <div className="stat-desc">
          out of {slots.length}
          {totalSlotsDateRange && (
            <>
              <br />
              {totalSlotsDateRange}
            </>
          )}
        </div>
      </div>

      <div className="stat p-3 md:p-6">
        <div className="stat-figure text-secondary">
          <MapPinIcon className="h-5 w-5" />
        </div>
        <div className="stat-title">Toggled Rooms</div>
        <div className="stat-value">{enabledRentablePlaces.length}</div>
        <div className="stat-desc">out of {rentablePlaces.length}</div>
      </div>
    </div>
  );
}
