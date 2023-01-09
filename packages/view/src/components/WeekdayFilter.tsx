import classNames from "classnames";
import { setWeekdayEnabled, Weekday } from "../state/filters/weekdayFilter";
import { setSlotFilter, useSlotFilter } from "../state/slotFilters";
import { Switch } from "@headlessui/react";
import { Fragment } from "react";

export interface DayFilterProps {
  label: string;
  weekday: Weekday;
}

export const WeekdayFilter = ({ label, weekday }: DayFilterProps) => {
  const checked = useSlotFilter("weekday", (filter) => filter[weekday]);
  return (
    <Switch
      as={Fragment}
      checked={checked}
      onChange={(newChecked: boolean) =>
        setSlotFilter("weekday", setWeekdayEnabled(newChecked)(weekday))
      }
    >
      {({ checked }) => (
        <button
          aria-label={label}
          className={classNames(
            "btn btn-sm",
            "px-4 py-2",
            {
              "btn-ghost": !checked,
              "btn-primary": checked,
            },
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          )}
        >
          {label.slice(0, 1)}
        </button>
      )}
    </Switch>
  );
};
