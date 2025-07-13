import { useMemo } from "react";
import { slotGroupsForXDays } from "../state/infiniteSlotGroups";
import MyCalendar from "./MyCalendar";

type Props = {
  className?: string;
  days: number;
};

export default function ({ className, days = 90 }: Props) {
  const slotGroups = slotGroupsForXDays(days).use();
  const events = useMemo(() => {
    return slotGroups.flatMap(([_, slots]) =>
      slots.map((slot) => {
        const path = slot.placeId.split(">");
        return {
          start: new Date(slot.start),
          end: new Date(slot.end),
          title: path.slice(-2).join(" > "),
        };
      })
    );
  }, [slotGroups]);

  return (
    <div className={className}>
      <MyCalendar events={events} />
    </div>
  );
}
