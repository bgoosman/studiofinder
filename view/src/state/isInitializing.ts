import { entity } from "simpler-state";

const isInitializingEntity = entity(true);
export const useInitializingEntity = isInitializingEntity.use;
export const setIsInitializing = isInitializingEntity.set;
