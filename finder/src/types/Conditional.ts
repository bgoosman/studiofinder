import * as A from "fp-ts/Array";
import * as P from "fp-ts/Predicate";
import { AllConditional } from "./AllConditional";
import { SomeConditional } from "./SomeConditional";

export type ConditionalExpression<T> = Conditional<T> | T;
export type ConditionalExpressions<T> = Array<ConditionalExpression<T>>;

export interface Conditional<T = unknown> {
  operator: string;
  expressions: ConditionalExpressions<T>;
}

const all = <T>(...expressions: ConditionalExpressions<T>): AllConditional<T> => ({
  operator: "all",
  expressions,
});

const some = <T>(...expressions: ConditionalExpressions<T>): SomeConditional<T> => ({
  operator: "some",
  expressions,
});

const getPredicate = <T>(cond: Conditional<T>) => {
  if (AllConditional.isType(cond)) {
    return AllConditional.getPredicate(cond);
  }

  if (SomeConditional.isType(cond)) {
    return SomeConditional.getPredicate(cond);
  }

  throw new Error("Unexpected conditional type!");
};

const walk =
  <T>(matches: P.Predicate<T>) =>
  (any: ConditionalExpression<T>): boolean => {
    if (Conditional.isType(any)) {
      const check = getPredicate(any);
      return check(walk(matches));
    } else {
      return matches(any);
    }
  };

const isType = (any: unknown): any is Conditional => {
  return (
    any !== null && typeof any === "object" && "operator" in any && "expressions" in any
  );
};

const explode = <T>(c: Conditional<T>) => {
  const recurse = (c: Conditional<T>, paths: T[][], basePath: T[]) => {
    const part = A.partition((ce: ConditionalExpression<T>) => Conditional.isType(ce))(
      c.expressions
    );
    const vs = part.left as T[];
    const cs = part.right as Conditional<T>[];
    if (c.operator == "some") {
      vs.forEach((v) => paths.push([...basePath, v]));
      cs.forEach((cc) => recurse(cc, paths, basePath));
    } else if (c.operator == "all") {
      const nextPath = [...basePath, ...vs];
      cs.forEach((cc) => recurse(cc, paths, nextPath));
      if (!cs.length) {
        paths.push(nextPath);
      }
    }
  };
  const paths: T[][] = [];
  recurse(c, paths, []);
  return paths;
};

export const Conditional = {
  all,
  isType,
  explode,
  some,
  walk,
};
