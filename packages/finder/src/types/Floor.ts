import { Metric } from "./Metric";
import { Unit } from "./Unit";

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

export const Floor = {
  getSquareFootage: (floor?: Floor): Metric<Unit.SquareFeet> | undefined => {
    if (!floor) return undefined;
    // 21.3 feet,43 feet -> [915.9, Unit.Feet]
    const split = floor.size.split(",").map(s => s.trim());
    if (split.length !== 2) throw new Error(`Invalid floor size: ${floor.size}`);
    const width = Metric.fromString(split[0], Unit.Feet);
    const height = Metric.fromString(split[1], Unit.Feet);
    return [width[0] * height[0], Unit.SquareFeet];
  },
}

// Quokka snippets
// console.log(Floor.getSquareFootage({ type: Material.Marley, size: "21.3 feet,43 feet" }))
