import { setWeekdayEnabled, Weekday } from "../state/filters/weekdayFilter";
import { setSlotFilter, useSlotFilter } from "../state/slotFilters";
import ToggleButton from "./ToggleButton";

export interface DayFilterProps {
  label: string;
  weekday: Weekday;
}

export const WeekdayFilter = ({ label, weekday }: DayFilterProps) => {
  const checked = useSlotFilter("weekday", (filter) => filter[weekday]);
  const truncatedLabel = label.slice(0, 1);
  return (
    <ToggleButton
      ariaLabel={label}
      checked={checked}
      off={truncatedLabel}
      on={truncatedLabel}
      onClick={(newChecked: boolean) =>
        setSlotFilter("weekday", setWeekdayEnabled(newChecked)(weekday))
      }
    />
  );
};
