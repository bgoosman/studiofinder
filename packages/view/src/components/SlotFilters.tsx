import { Box, Button, Collapse, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCalendar,
  IconChevronRight,
  IconClockHour4,
  IconCurrencyDollar,
  IconMap,
  IconRuler,
  IconWood
} from "@tabler/icons-react";
import classNames from "classnames";
import { Material, materials } from "finder/src/types/Floor";
import { setFloorMaterialEnabled } from "../state/filters/floorMaterialFilter";
import {
  FloorSize,
  floorSizes,
  setFloorSize
} from "../state/filters/floorSizeFilter";
import { setSlotFilter, useSlotFilter } from "../state/slotFilters";
import AddRemoveButton from "./AddRemoveButton";
import { FloorMaterialFilter } from "./FloorMaterialFilter";
import FloorSizeFilter from "./FloorSizeFilter";
import HourFilter from "./HourFilter";
import { PlaceFilterTree } from "./PlaceFilterTree";
import PriceFilter from "./PriceFilter";
import RentalTypeFilter from "./RentalTypeFilter";
import { WeekdayFilter } from "./WeekdayFilter";
import { HourBlockFilter } from "./HourBlockFilter";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function ({ className, style }: Props) {
  const floorMaterialFilter = useSlotFilter("floorMaterial");
  const floorSizeFilter = useSlotFilter("floorSize");
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <div style={style} className={classNames(className)}>
      <h3 className="my-2 flex items-center gap-x-1">
        <IconCalendar size="1rem" /> Day
      </h3>
      <div className="space-x-1 mb-3 flex items-center">
        <WeekdayFilter label="Sunday" weekday={"0"} />
        <WeekdayFilter label="Monday" weekday={"1"} />
        <WeekdayFilter label="Tuesday" weekday={"2"} />
        <WeekdayFilter label="Wednesday" weekday={"3"} />
        <WeekdayFilter label="Thursday" weekday={"4"} />
        <WeekdayFilter label="Friday" weekday={"5"} />
        <WeekdayFilter label="Saturday" weekday={"6"} />
      </div>
      <h3 className="mb-2 flex items-center gap-x-1">
        <IconClockHour4 size="1rem" /> Time
      </h3>
      <div className="space-x-1 mb-3 flex items-center">
        <HourBlockFilter label="Morning" hourBlock="morning" />
        <HourBlockFilter label="Afternoon" hourBlock="afternoon" />
        <HourBlockFilter label="Evening" hourBlock="evening" />
      </div>

      <h3 className="mb-2 flex items-center gap-x-1">
        <IconMap size="1rem" /> Location
      </h3>
      <PlaceFilterTree className="mb-4" />

      <Box>
        <Group mb={5}>
          <Button onClick={toggle} variant="subtle" leftIcon={<IconChevronRight size="1rem" />}>More filters...</Button>
        </Group>
        <Collapse in={opened}>

          <h3 className="mb-2 flex items-center gap-x-1">
            <IconClockHour4 size="1rem" /> Hours
          </h3>
          <HourFilter className={"mb-3 mt-9 mx-3"} />

          <h3 className="mb-2 flex items-center gap-x-1">
            <IconCurrencyDollar size="1rem" /> Price
          </h3>
          <PriceFilter className={"mb-3 mt-9 mx-3"} />

          <h3 className="mb-2 flex items-center gap-x-1">
            <IconCurrencyDollar size="1rem" /> Intended use
          </h3>
          <RentalTypeFilter className="mb-3" />

          <h3 className="mb-2 flex items-center gap-x-1">
            <IconWood size="1rem" /> Floor type
          </h3>
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

          <h3 className="mb-2 flex items-center gap-x-1">
            <IconRuler size="1rem" /> Floor size
          </h3>
          <div className="mb-3 flex items-center gap-x-1">
            <AddRemoveButton
              ariaLabel="Select all floor sizes"
              checked={floorSizes.every((size) => floorSizeFilter[size])}
              onClick={(checked) => {
                floorSizes.forEach((size) => {
                  setSlotFilter("floorSize", setFloorSize(checked)(size));
                });
              }}
            />
            {Object.values(FloorSize).map((floorSize) => (
              <FloorSizeFilter key={floorSize} floorSize={floorSize} />
            ))}
          </div>
        </Collapse>
      </Box>
    </div>
  );
}
