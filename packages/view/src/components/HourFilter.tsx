import { RangeSlider } from "@mantine/core";
import { setSlotFilter, useSlotFilter } from "../state/slotFilters";
import { setMaxHour, setMinHour } from "../state/filters/hourFilter";
import classNames from "classnames";
import { useState } from "react";

type Props = {
  className?: string;
};

const labels: Record<number, string> = {
  0: "12am",
  1: "1am",
  2: "2am",
  3: "3am",
  4: "4am",
  5: "5am",
  6: "6am",
  7: "7am",
  8: "8am",
  9: "9am",
  10: "10am",
  11: "11am",
  12: "12pm",
  13: "1pm",
  14: "2pm",
  15: "3pm",
  16: "4pm",
  17: "5pm",
  18: "6pm",
  19: "7pm",
  20: "8pm",
  21: "9pm",
  22: "10pm",
  23: "11pm",
  24: "12am",
};

const formatValue = (value: number) => labels[value];

export default function ({ className }: Props) {
  const { min, max } = useSlotFilter("hour");
  const [tempRange, setTempRange] = useState<[number, number]>([min, max]);

  return (
    <RangeSlider
      className={classNames(className)}
      labelAlwaysOn
      label={formatValue}
      min={0}
      max={24}
      step={1}
      minRange={1}
      onChange={(range) => {
        console.log(range);
        setTempRange(range);
      }}
      onChangeEnd={(range) => {
        setSlotFilter("hour", setMinHour(range[0]));
        setSlotFilter("hour", setMaxHour(range[1]));
      }}
      value={tempRange}
    />
  );
}
