import { HourBlock, setHourBlockEnabled } from "src/state/filters/hourBlockFilter";
import { setSlotFilter, useSlotFilter } from "../state/slotFilters";
import ToggleButton from "./ToggleButton";

export interface DayFilterProps {
  label: string;
  hourBlock: HourBlock;
}

export const HourBlockFilter = ({ label, hourBlock }: DayFilterProps) => {
  const checked = useSlotFilter("hourBlock", (filter) => filter[hourBlock]);
  return (
    <ToggleButton
      ariaLabel={label}
      checked={checked}
      off={label}
      on={label}
      onClick={(newChecked: boolean) =>
        setSlotFilter("hourBlock", setHourBlockEnabled(newChecked)(hourBlock))
      }
    />
  );
};
