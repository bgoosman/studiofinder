import * as A from "fp-ts/Array";
import * as P from "fp-ts/Predicate";
import { Conditional, ConditionalExpression } from "./Conditional";

export interface SomeConditional<T = unknown> extends Conditional<T> {
  operator: "some";
}

const isType = <T = unknown>(any: Conditional<T>): any is SomeConditional<T> => {
  return Conditional.isType(any) && any.operator === "some";
};

const getPredicate =
  <T>(cond: SomeConditional<T>) =>
  (p: P.Predicate<ConditionalExpression<T>>) =>
    A.some(p)(cond.expressions);

const of = <T>(x: Conditional<T>): SomeConditional<T> => ({
  operator: "some",
  expressions: x.expressions,
});

export const SomeConditional = {
  getPredicate,
  isType,
  of,
};
