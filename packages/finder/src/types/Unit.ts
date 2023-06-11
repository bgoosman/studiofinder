export enum Unit {
  Feet = "feet",
  SquareFeet = "square feet",
}

export const AllUnits = Object.values(Unit) as Unit[];

export namespace Unit {
  export function isValidUnit(s: string): s is Unit {
    return AllUnits.includes(s as Unit)
  }
}