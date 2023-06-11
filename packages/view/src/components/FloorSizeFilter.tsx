import { setSlotFilter, useSlotFilter } from "../state/slotFilters";
import {
  FloorSize,
  floorSizeLabels,
  floorSizeTooltips,
  setFloorSize,
} from "../state/filters/floorSizeFilter";
import ToggleButton from "./ToggleButton";
import { Tooltip } from "@mantine/core";

type Props = {
  className?: string;
  floorSize: FloorSize;
};

export default function ({ className, floorSize }: Props) {
  const checked = useSlotFilter("floorSize", (filter) => filter[floorSize]);
  const label = floorSizeLabels[floorSize];
  const tooltip = floorSizeTooltips[floorSize];

  return (
    <Tooltip label={tooltip}>
      <ToggleButton
        ariaLabel={floorSize}
        checked={checked}
        off={label}
        on={label}
        onClick={(newChecked: boolean) =>
          setSlotFilter("floorSize", setFloorSize(newChecked)(floorSize))
        }
      />
    </Tooltip>
  );
}
