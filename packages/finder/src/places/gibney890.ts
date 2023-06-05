import { Amenity } from "../types/Amenity";
import { Material } from "../types/Floor";
import { Photo } from "../types/Photo";
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
    withSlots(
      "Studio 1",
      getStudioMeta({
        amenities: [Amenity.Mirror, Amenity.Piano],
        floor: {
          type: Material.Marley,
          size: "32 feet,49 feet",
        },
        nonProfitDanceRehearsalRate: 29,
        photos: [
          Photo.of(
            "Marley floor, windows, grand piano, projector",
            "https://gibneydance.org/wp-content/uploads/2018/02/Studio1-Optimized.jpg"
          ),
        ],
      }),
      getSlots("Studio 1")
    ),
    withSlots(
      "Studio 2",
      getStudioMeta({
        amenities: [Amenity.Mirror],
        floor: {
          type: Material.Marley,
          size: "24 feet,30 feet",
        },
        nonProfitDanceRehearsalRate: 22,
        photos: [
          Photo.of(
            "Marley floor, 6 windows",
            "https://gibneydance.org/wp-content/uploads/2018/02/View-1.jpg"
          ),
        ],
      }),
      getSlots("Studio 2")
    ),
    withSlots(
      "Studio 3",
      getStudioMeta({
        amenities: [Amenity.Mirror],
        floor: {
          type: Material.Marley,
          size: "34 feet,36 feet",
        },
        nonProfitDanceRehearsalRate: 26,
        photos: [
          Photo.of(
            "Marley floor, walls",
            "https://gibneydance.org/wp-content/uploads/2018/02/studio-3.jpg"
          ),
        ],
      }),
      getSlots("Studio 3")
    ),
    withSlots(
      "Studio 4",
      getStudioMeta({
        amenities: [Amenity.Mirror, Amenity.Piano],
        floor: {
          type: Material.Marley,
          size: "44 feet,69 feet",
        },
        nonProfitDanceRehearsalRate: 40,
        photos: [
          Photo.of(
            "Marley floor, brick wall, windows, piano",
            "https://gibneydance.org/wp-content/uploads/2018/03/Studio52-1.jpg"
          ),
        ],
      }),
      getSlots("Studio 4")
    ),
    withSlots(
      "Studio 5-2",
      getStudioMeta({
        amenities: [Amenity.Mirror, Amenity.Piano],
        floor: {
          type: Material.Marley,
          size: "34 feet,53 feet",
        },
        nonProfitDanceRehearsalRate: 30,
        photos: [
          Photo.of(
            "Marley floor, windows, mirrors, projector",
            "https://gibneydance.org/wp-content/uploads/2018/03/Studio52-1.jpg"
          ),
        ],
      }),
      getSlots("Studio 5-2")
    ),
    withSlots(
      "Studio 6",
      getStudioMeta({
        amenities: [Amenity.Mirror],
        floor: {
          type: Material.Wood,
          size: "19 feet,36 feet",
        },
        nonProfitDanceRehearsalRate: 17,
        photos: [
          Photo.of(
            "Wood floor, windows, moveable mirrors, plant",
            "https://gibneydance.org/wp-content/uploads/2018/03/Studio6-1.jpg"
          ),
        ],
      }),
      getSlots("Studio 6")
    ),
    withSlots(
      "Studio 7",
      getStudioMeta({
        amenities: [Amenity.Mirror],
        floor: {
          type: Material.Wood,
          size: "12.5 feet,14 feet",
        },
        nonProfitDanceRehearsalRate: 9,
        photos: [
          Photo.of(
            "Wood floor, windows, heater, mirror",
            "https://gibneydance.org/wp-content/uploads/2018/03/Studio7-1.jpg"
          ),
        ],
      }),
      getSlots("Studio 7")
    ),
    withSlots(
      "Studio 8",
      getStudioMeta({
        amenities: [Amenity.Mirror],
        floor: {
          type: Material.Wood,
          size: "18 feet,49 feet",
        },
        nonProfitDanceRehearsalRate: 19,
        photos: [
          Photo.of(
            "Wood floor, windows, moveable mirror",
            "https://gibneydance.org/wp-content/uploads/2018/03/Studio8-1.jpg"
          ),
        ],
      }),
      getSlots("Studio 8")
    ),
    withSlots(
      "Studio 9",
      getStudioMeta({
        amenities: [Amenity.Mirror],
        floor: {
          type: Material.Wood,
          size: "35 feet,14 feet",
        },
        nonProfitDanceRehearsalRate: 15,
        photos: [
          Photo.of(
            "Wood floor, heater, windows, mirror",
            "https://gibneydance.org/wp-content/uploads/2018/03/Studio9-1.jpg"
          ),
        ],
      }),
      getSlots("Studio 9")
    ),
  ]
);
