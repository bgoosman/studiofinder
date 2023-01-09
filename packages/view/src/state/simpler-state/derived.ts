import { entity, Entity, Plugin } from "simpler-state";
import { reaction } from "./reaction";

export function attach(plugin: Plugin, otherEntity: Entity<any>) {
  const overrideMethod = (method: keyof Plugin) => {
    const overrideFn = plugin[method]!;
    const override = overrideFn(otherEntity[method], otherEntity);
    otherEntity[method] = override;
  };
  overrideMethod("init");
  overrideMethod("set");
}

export const derived = <A, B>(
  otherEntity: Entity<A>,
  updateFn: (state: A) => B
): Entity<B> => {
  const derivedEntity = entity(updateFn(otherEntity.get()));

  attach(
    reaction((newValue: A) => {
      derivedEntity.set(updateFn(newValue));
    }),
    otherEntity
  );

  return derivedEntity;
};

export const derivedAny = <C>(
  otherEntities: Entity<any>[],
  updateFn: (vs: any[]) => C
): Entity<C> => {
  const getAll = () => otherEntities.map((e) => e.get());
  const derivedEntity = entity(updateFn(getAll()));
  const plugin = reaction(() => {
    derivedEntity.set(updateFn(getAll()));
  });

  otherEntities.forEach((otherEntity) => {
    attach(plugin, otherEntity);
  });

  return derivedEntity;
};
