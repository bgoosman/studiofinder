export enum Material {
  Wood = "wood",
  Concrete = "concrete",
  Marley = "marley",
}

export type Floor = {
  type: Material;
  size: string;
}