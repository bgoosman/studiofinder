import { Conditional } from "./Conditional";
import { Discount } from "./Discount";
import { RateValidIf } from "./RateValidIf";
import { CompositeRentalType, RentalType } from "./RentalType";
import { Slot } from "./Slot";

export type Rate = number;

export type RentalRate = {
  name?: string;
  description?: string;
  rate: Rate;
  types?: CompositeRentalType[];
  validIf: Conditional<RateValidIf>;
};

export type DiscountedRentalRate = RentalRate & {
  baseRate: Rate;
  discount: Discount;
};

const isDiscounted = (rate: RentalRate): rate is DiscountedRentalRate =>
  "discount" in rate;

export const DiscountedRentalRate = {
  isDiscounted,
};

const applyDiscount =
  (discount: Discount) =>
  (base: RentalRate): DiscountedRentalRate => ({
    ...base,
    discount,
    rate: discount.apply(base.rate),
    baseRate: base.rate,
    validIf: Conditional.some(base.validIf, discount.validIf),
  });

const isValid =
  (rate: RentalRate) =>
  (slot: Slot, now: Date, allTypes: Array<RentalType>): boolean => {
    return Conditional.walk(RateValidIf.isValid(slot, now, allTypes))(rate.validIf);
  };

const of = (o: RentalRate) => o;

export const RentalRate = {
  applyDiscount,
  isValid,
  of,
};
