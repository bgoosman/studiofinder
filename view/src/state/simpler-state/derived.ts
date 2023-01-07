import { entity, Entity, Plugin } from "simpler-state";
import { reaction } from "./reaction";

export const derived = <A, B>(otherEntity: Entity<A>, initFn: (state: A) => B): Entity<B> => {
  const derivedEntity = entity(initFn(otherEntity.get()));

  const plugin = reaction((newValue: A) => {
    derivedEntity.set(initFn(newValue));
  });

  const overrideMethod = (method: keyof Plugin) => {
    const overrideFn = plugin[method]!;
    const override = overrideFn(otherEntity[method], otherEntity);
    otherEntity[method] = override;
  };
  overrideMethod("init");
  overrideMethod("set");

  return derivedEntity;
};
