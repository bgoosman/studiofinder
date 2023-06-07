import classNames from "classnames";
import { setSlotFilter, useSlotFilter } from "../state/slotFilters";
import { Switch } from "@headlessui/react";
import { Fragment } from "react";
import { Material } from "finder/src/types/Floor";
import { setFloorMaterialEnabled } from "../state/filters/floorMaterialFilter";

export interface FloorMaterialFilterProps {
  material: Material;
  label: string;
}

function capitalizeEveryWord(str: string) {
  return str
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const FloorMaterialFilter = ({ material, label }: FloorMaterialFilterProps) => {
  const checked = useSlotFilter("floorMaterial", (filter) => filter[material]);
  return (
    <Switch
      as={Fragment}
      checked={checked}
      onChange={(newChecked: boolean) =>
        setSlotFilter("floorMaterial", setFloorMaterialEnabled(newChecked)(material))
      }
    >
      {({ checked }) => (
        <button
          aria-label={label}
          className={classNames(
            "btn btn-xs md:btn-sm flex-nowrap",
            "px-4 py-2",
            {
              "btn-outline": !checked,
              "btn-primary": checked,
            },
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
            "normal-case"
          )}
          style={{ textTransform: "none" }}
        >
          {capitalizeEveryWord(label)}
        </button>
      )}
    </Switch>
  );
};
