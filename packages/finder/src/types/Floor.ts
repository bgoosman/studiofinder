export enum Material {
  Wood = "wood",
  Concrete = "concrete",
  Marley = "marley",
}
export const materials = Object.values(Material) as Material[];

export type Floor = {
  type: Material;
  size: string;
};
