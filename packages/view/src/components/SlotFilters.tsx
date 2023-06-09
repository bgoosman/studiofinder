import { IconCalendar, IconMap, IconWood } from "@tabler/icons-react";
import { setSlotFilter, useSlotFilter } from "../state/slotFilters";
import AddRemoveButton from "./AddRemoveButton";
import { setWeekdayEnabled, weekdays } from "../state/filters/weekdayFilter";
import { materials, Material } from "finder/src/types/Floor";
import { setFloorMaterialEnabled } from "../state/filters/floorMaterialFilter";
import { FloorMaterialFilter } from "./FloorMaterialFilter";
import { PlaceFilterTree } from "./PlaceFilterTree";
import { WeekdayFilter } from "./WeekdayFilter";
import { Stats } from "./Stats";
import classNames from "classnames";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function ({ className, style }: Props) {
  const weekdayFilter = useSlotFilter("weekday");
  const floorMaterialFilter = useSlotFilter("floorMaterial");

  return (
    <div style={style} className={classNames(className)}>
      <p className="my-2 flex items-center gap-x-1">
        <IconCalendar size="1rem" /> Days
      </p>
      <div className="space-x-1 mb-3 flex items-center">
        <AddRemoveButton
          ariaLabel="Select all weekdays"
          checked={weekdays.every((weekday) => weekdayFilter[weekday])}
          onClick={(checked) => {
            weekdays.forEach((weekday) => {
              setSlotFilter("weekday", setWeekdayEnabled(checked)(weekday));
            });
          }}
        />
        <WeekdayFilter label="Sunday" weekday={"0"} />
        <WeekdayFilter label="Monday" weekday={"1"} />
        <WeekdayFilter label="Tuesday" weekday={"2"} />
        <WeekdayFilter label="Wednesday" weekday={"3"} />
        <WeekdayFilter label="Thursday" weekday={"4"} />
        <WeekdayFilter label="Friday" weekday={"5"} />
        <WeekdayFilter label="Saturday" weekday={"6"} />
      </div>
      <p className="mb-2 flex items-center gap-x-1">
        <IconWood size="1rem" /> Floor
      </p>
      <div className="mb-3 flex items-center gap-x-1">
        <AddRemoveButton
          ariaLabel="Select all floor materials"
          checked={materials.every((material) => floorMaterialFilter[material])}
          onClick={(checked) => {
            materials.forEach((material) => {
              setSlotFilter("floorMaterial", setFloorMaterialEnabled(checked)(material));
            });
          }}
        />
        <FloorMaterialFilter label="Wood" material={Material.Wood} />
        {/* There are no rooms with concrete yet <FloorMaterialFilter label="Concrete" material={Material.Concrete} /> */}
        <FloorMaterialFilter label="Marley" material={Material.Marley} />
      </div>
      <p className="mb-2 flex items-center gap-x-1">
        <IconMap size="1rem" /> Place
      </p>
      <PlaceFilterTree className="mb-2" />
      <Stats />
    </div>
  );
}
