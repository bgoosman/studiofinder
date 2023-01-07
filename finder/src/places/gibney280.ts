import { withPlaces, withSlots } from "../types/Place";
import { getGibneySlots, getStudioMeta } from "./gibney";

const name = "Gibney (280 Broadway)";
const getSlots = getGibneySlots(name);

export const gibney280 = withPlaces(
  name,
  {
    shortName: "G280",
  },
  [
    withSlots("Studio A", getStudioMeta(17), getSlots("Studio A")),
    withSlots("Studio B", getStudioMeta(19), getSlots("Studio B")),
    withSlots("Studio C", getStudioMeta(35), getSlots("Studio C")),
    withSlots("Studio D", getStudioMeta(22), getSlots("Studio D")),
    withSlots("Studio E", getStudioMeta(22), getSlots("Studio E")),
    withSlots("Studio F", getStudioMeta(15), getSlots("Studio F")),
    withSlots("Studio G", getStudioMeta(19), getSlots("Studio G")),
    withSlots("Studio H (Theater)", getStudioMeta(35), getSlots("Studio H (Theater)")),
  ]
);
