import { Unit } from "./Unit";

export type Metric<T extends Unit> = readonly [number, T]

export const Metric = {
  fromString: <T extends Unit>(s: string | undefined, toUnit: T): Metric<T> => {
    if (!s) {
      throw new Error(`Invalid value: ${s}`);
    }

    // 21.3 feet -> [21.3, Unit.Feet]
    const [value, unit] = s.split(" ");

    if (!value || !unit) {
      throw new Error(`Invalid value: ${s}`);
    }

    const parsedValue = parseFloat(value);

    if (isNaN(parsedValue)) {
      throw new Error(`Invalid value: ${value} from ${s}`);
    }

    if (!Unit.isValidUnit(unit)) {
      throw new Error(`Invalid unit: ${unit} from ${s}`);
    }

    if (unit !== toUnit) {
      // TODO: could convert
      throw new Error(`Invalid unit: ${unit} from ${s}`);
    }

    return [parseFloat(value), unit as T];
  }
}