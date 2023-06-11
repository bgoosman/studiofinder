import { Card, Text } from "@mantine/core";
import { DateTime } from "luxon";

import { placesById } from "../state/places";
import { useSlotFilter } from "../state/slotFilters";
import { slotsEntity } from "../state/slots";
import { slotGroupsByDate } from "../state/slotsGroupedByDate";

type Props = {
  className?: string;
};

export function Stats({ className }: Props) {
  const slots = slotsEntity.use();
  const _placesById = placesById.use();
  const _slotGroupsByDate = slotGroupsByDate.use();
  const totalFilteredSlots = _slotGroupsByDate.reduce(
    (acc, [_, slots]) => acc + slots.length,
    0
  );
  let totalSlotsDateRange;
  if (totalFilteredSlots > 0) {
    const firstDate = _slotGroupsByDate[0]![0];
    const lastDate = _slotGroupsByDate[_slotGroupsByDate.length - 1]![0];
    const format = (date: string) =>
      DateTime.fromISO(date).toLocaleString({ month: "short", day: "2-digit" });
    totalSlotsDateRange = `${format(firstDate)} - ${format(lastDate)}`;
  }

  const placesFilter = useSlotFilter("place");
  const rentablePlaces = Object.values(_placesById).filter(
    (place) => place.places.length == 0
  );
  const enabledRentablePlaces = rentablePlaces.filter((place) => placesFilter[place.id]);

  return (
    <Card
      className={className}
      withBorder
      radius="md"
      padding="xl"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      })}
    >
      <Text fz="xs" tt="uppercase" fw={700} c="dimmed"></Text>
      <Text fz="lg" fw={500}>
        Showing {totalFilteredSlots} / {slots.length} slots
        {totalSlotsDateRange && ` from ${totalSlotsDateRange}`}
      </Text>
    </Card>
  );
}
