import { DateTime } from "luxon";
import {
  getNextPage,
  hasNextPage,
  infiniteSlotGroups,
  totalPageCount,
} from "../state/infiniteSlotGroups";
import { SlotGroup } from "./SlotGroup";
import { Button } from "@mantine/core";
import { useEffect } from "react";
import { Stats } from "./Stats";

type Props = {
  className?: string;
};

export default function ({ className }: Props) {
  const _infiniteSlotGroups = infiniteSlotGroups.use();
  const _hasNextPage = hasNextPage.use();
  const _totalPageCount = totalPageCount.use();

  const onScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      getNextPage();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [_infiniteSlotGroups]);

  return (
    <div className={className}>
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
      <p className="" id="pageBottom">
        {_hasNextPage ? (
          <Button onClick={() => getNextPage()}>Load more</Button>
        ) : (
          "That's all for now! Try different filters."
        )}
      </p>
    </div>
  );
}
