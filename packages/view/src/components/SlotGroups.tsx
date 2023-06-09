import { DateTime } from "luxon";
import {
  hasNextPage,
  infiniteSlotGroups,
  totalPageCount,
} from "../state/infiniteSlotGroups";
import { SlotGroup } from "./SlotGroup";

export default function () {
  const _infiniteSlotGroups = infiniteSlotGroups.use();
  const _hasNextPage = hasNextPage.use();
  const _totalPageCount = totalPageCount.use();

  if (_totalPageCount === 0) {
    return null;
  }

  return (
    <>
      {_infiniteSlotGroups.length > 0 &&
        _infiniteSlotGroups.map(
          ([date, slots]) =>
            slots.length > 0 && (
              <SlotGroup
                key={date}
                slots={slots}
                title={DateTime.fromISO(date).toLocaleString({
                  weekday: "short",
                  month: "long",
                  day: "2-digit",
                })}
              />
            )
        )}
      <p className="p-4" id="pageBottom">
        {_hasNextPage
          ? "There are more slots. Keep scrolling!"
          : "That's all for now! Try different filters."}
      </p>
    </>
  );
}
