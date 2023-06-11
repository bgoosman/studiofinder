import { MultiSelect } from "@mantine/core";
import { setSlotFilter, useSlotFilter } from "../state/slotFilters";
import { AllRentalTypes, RentalType } from "finder/src/types/RentalType";
import { getEnabledRentalTypes, setRentalTypes } from "../state/filters/rentalTypeFilter";

const data = AllRentalTypes.map((type) => ({
  value: type,
  label: type,
}));

type Props = {
  className?: string;
};

export default function ({ className }: Props) {
  const enabledRentalTypes = useSlotFilter("rentalType", getEnabledRentalTypes);

  return (
    <MultiSelect
      className={className}
      data={data}
      onChange={(values: RentalType[]) => {
        setSlotFilter("rentalType", setRentalTypes(true)(values));
      }}
      placeholder="Filter by intended use"
      value={enabledRentalTypes}
    />
  );
}
