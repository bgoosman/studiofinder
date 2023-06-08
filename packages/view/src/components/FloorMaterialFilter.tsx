import { setSlotFilter, useSlotFilter } from "../state/slotFilters";
import { Material } from "finder/src/types/Floor";
import { setFloorMaterialEnabled } from "../state/filters/floorMaterialFilter";
import ToggleButton from "./ToggleButton";

export interface FloorMaterialFilterProps {
  material: Material;
  label: string;
}

export const FloorMaterialFilter = ({ material, label }: FloorMaterialFilterProps) => {
  const checked = useSlotFilter("floorMaterial", (filter) => filter[material]);
  return (
    <ToggleButton
      ariaLabel={label}
      checked={checked}
      off={label}
      on={label}
      onClick={(newChecked: boolean) =>
        setSlotFilter("floorMaterial", setFloorMaterialEnabled(newChecked)(material))
      }
    />
  );
};
