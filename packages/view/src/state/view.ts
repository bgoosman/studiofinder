import { entity } from "simpler-state";

const currentView = entity<"list" | "calendar">("calendar");
export const useCurrentView = currentView.use;
export const setCurrentView = currentView.set;

const currentViewDays = entity<number>(120);
export const useCurrentViewDays = currentViewDays.use;
export const setCurrentViewDays = currentViewDays.set;
