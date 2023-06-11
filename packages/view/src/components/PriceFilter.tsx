import { RangeSlider } from "@mantine/core";
import { setSlotFilter, useSlotFilter } from "../state/slotFilters";
import classNames from "classnames";
import { useState } from "react";
import { useMaxRate } from "../state/slots";
import { setPriceFilter } from "../state/filters/priceFilter";

type Props = {
  className?: string;
};

export default function ({ className }: Props) {
  const [min, max] = useSlotFilter("price");
  const maxRate = useMaxRate();
  const [tempRange, setTempRange] = useState<[number, number]>([min, max]);

  return (
    <RangeSlider
      className={classNames(className)}
      labelAlwaysOn
      label={(value) => `$${value}`}
      min={0}
      max={maxRate}
      step={1}
      minRange={0}
      onChange={(range) => {
        setTempRange(range);
      }}
      onChangeEnd={(range) => {
        setSlotFilter("price", setPriceFilter(range));
      }}
      value={tempRange}
    />
  );
}
