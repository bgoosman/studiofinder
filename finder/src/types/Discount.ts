import { Conditional } from "./Conditional";
import { RateValidIf } from "./RateValidIf";
import { Rate } from "./RentalRate";

export type Discount = {
  name: string;
  description?: string;
  code?: string;
  validIf: Conditional<RateValidIf>;
  apply: (rate: Rate) => Rate;
};
