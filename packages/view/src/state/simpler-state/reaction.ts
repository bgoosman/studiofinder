import { Plugin } from "simpler-state";

export const reaction = <A>(fn: (newValue: A) => void): Plugin => ({
  set:
    (origSetFn, entity) =>
    (...args) => {
      origSetFn(...args);
      fn(entity.get());
    },
  init: (origInitFn, entity) => () => {
    origInitFn();
    fn(entity.get());
  },
});
