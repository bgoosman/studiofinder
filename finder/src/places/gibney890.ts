import { withPlaces, withSlots } from "../types/Place";
import { getGibneySlots, getStudioMeta } from "./gibney";

const name = "Gibney (890 Broadway)";
const getSlots = getGibneySlots(name);

export const gibney890 = withPlaces(
  name,
  {
    shortName: "G890",
  },
  [
    withSlots("Studio 1", getStudioMeta(29), getSlots("Studio 1")),
    withSlots("Studio 2", getStudioMeta(22), getSlots("Studio 2")),
    withSlots("Studio 3", getStudioMeta(26), getSlots("Studio 3")),
    withSlots("Studio 4", getStudioMeta(40), getSlots("Studio 4")),
    withSlots("Studio 5-2", getStudioMeta(30), getSlots("Studio 5-2")),
    withSlots("Studio 6", getStudioMeta(17), getSlots("Studio 6")),
    withSlots("Studio 7", getStudioMeta(9), getSlots("Studio 7")),
    withSlots("Studio 8", getStudioMeta(19), getSlots("Studio 8")),
    withSlots("Studio 9", getStudioMeta(15), getSlots("Studio 9")),
  ]
);
