export type NumberRange = {
  min: number;
  max: number;
};

export interface SlotFilter<T> {
  getDefault: () => T;
}
