import { Amenity } from "../types/Amenity";
import { Material } from "../types/Floor";
import { Photo } from "../types/Photo";
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
    withSlots(
      "Studio A",
      getStudioMeta({
        amenities: [Amenity.Mirror],
        nonProfitDanceRehearsalRate: 17,
        floor: {
          type: Material.Wood,
          size: "15 feet,27 feet",
        },
      }),
      getSlots("Studio A")
    ),
    withSlots(
      "Studio B",
      getStudioMeta({
        amenities: [Amenity.Mirror],
        floor: {
          type: Material.Wood,
          size: "25 feet,27 feet",
        },
        nonProfitDanceRehearsalRate: 19,
        photos: [
          Photo.of(
            "Floor, window, mirror, pillar",
            "https://gibneydance.org/wp-content/uploads/2018/03/StudioB-1-1200x675.jpg"
          ),
        ],
      }),
      getSlots("Studio B")
    ),
    withSlots(
      "Studio C",
      getStudioMeta({
        amenities: [Amenity.Mirror],
        floor: {
          type: Material.Marley,
          size: "48 feet,49 feet",
        },
        nonProfitDanceRehearsalRate: 35,
        photos: [
          Photo.of(
            "Floor, doors, pillar",
            "https://gibneydance.org/wp-content/uploads/2018/03/StudioC-2-1200x675.jpg"
          ),
        ],
      }),
      getSlots("Studio C")
    ),
    withSlots(
      "Studio D",
      getStudioMeta({
        amenities: [Amenity.Mirror],
        floor: {
          type: Material.Wood,
          size: "28 feet,46 feet",
        },
        nonProfitDanceRehearsalRate: 22,
        photos: [
          Photo.of(
            "Floor, windows, pillars, mirror",
            "https://gibneydance.org/wp-content/uploads/2018/03/StudioD-1200x675.jpg"
          ),
        ],
      }),
      getSlots("Studio D")
    ),
    withSlots(
      "Studio E",
      getStudioMeta({
        amenities: [Amenity.Mirror],
        floor: {
          type: Material.Marley,
          size: "23 feet,52 feet",
        },
        nonProfitDanceRehearsalRate: 22,
        photos: [
          Photo.of(
            "Floor, mirror, door",
            "https://gibneydance.org/wp-content/uploads/2018/03/StudioE-1-1200x675.jpg"
          ),
        ],
      }),
      getSlots("Studio E")
    ),
    withSlots(
      "Studio F",
      getStudioMeta({
        amenities: [Amenity.Mirror],
        floor: {
          type: Material.Marley,
          size: "17 feet,28 feet",
        },
        nonProfitDanceRehearsalRate: 15,
        photos: [
          Photo.of(
            "Floor, windows",
            "https://gibneydance.org/wp-content/uploads/2018/03/StudioF-1.jpg"
          ),
        ],
      }),
      getSlots("Studio F")
    ),
    withSlots(
      "Studio G",
      getStudioMeta({
        amenities: [Amenity.Mirror],
        floor: {
          type: Material.Marley,
          size: "20 feet,42 feet",
        },
        nonProfitDanceRehearsalRate: 19,
        photos: [
          Photo.of(
            "Floor, windows, mirror",
            "https://gibneydance.org/wp-content/uploads/2018/03/StudioG.jpg"
          ),
        ],
      }),
      getSlots("Studio G")
    ),
    withSlots(
      "Studio H (Theater)",
      getStudioMeta({
        amenities: [Amenity.Mirror],
        floor: {
          type: Material.Marley,
          size: "33 feet,38 feet",
        },
        nonProfitDanceRehearsalRate: 35,
        photos: [
          Photo.of(
            "Marley floor, 3 columns, bleachers",
            "https://gibneydance.org/wp-content/uploads/2018/03/26561639807_f36438a314_o-scaled.jpg"
          ),
        ],
      }),
      getSlots("Studio H (Theater)")
    ),
  ]
);
