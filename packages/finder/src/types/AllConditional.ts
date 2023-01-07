import * as A from "fp-ts/Array";
import * as P from "fp-ts/Predicate";
import { Conditional, ConditionalExpression } from "./Conditional";

export interface AllConditional<T = unknown> extends Conditional<T> {
  operator: "all";
}

const isType = <T = unknown>(any: Conditional<T>): any is AllConditional<T> => {
  return Conditional.isType(any) && any.operator === "all";
};

const getPredicate =
  <T>(cond: AllConditional<T>) =>
  (p: P.Predicate<ConditionalExpression<T>>) =>
    A.every(p)(cond.expressions);

const of = (x: AllConditional) => x;

export const AllConditional = {
  getPredicate,
  isType,
  of,
};
