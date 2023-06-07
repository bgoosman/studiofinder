import { Material } from "finder/src/types/Floor";
import { SlotFilter } from "./filters";

export type FloorMaterialFilter = Record<Material, boolean>;

export const floorMaterialFilter: SlotFilter<FloorMaterialFilter> = {
  getDefault: () => ({
    [Material.Wood]: true,
    [Material.Concrete]: true,
    [Material.Marley]: true,
  }),
};

export const setFloorMaterialEnabled =
  (enabled: boolean) =>
  (material: Material) =>
  (filters: FloorMaterialFilter): FloorMaterialFilter => ({
    ...filters,
    [material]: enabled,
  });
