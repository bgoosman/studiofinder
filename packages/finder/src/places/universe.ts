import { withPlaces } from "../types/Place";
import { brooklynArtsExchange } from "./bax";
import { chezbushwick } from "./chezbushwick";
import { centerForPerformanceResearch } from "./cpr";
import { gibney280 } from "./gibney280";
import { gibney890 } from "./gibney890";
import { motive } from "./motive";
import { cc122 } from "./movementresearch";
import { thewoods } from "./thewoods";
import { triskelion } from "./triskelion";

export const universe = withPlaces("Universe", {}, [
  withPlaces("Brooklyn", {}, [
    triskelion,
    chezbushwick,
    brooklynArtsExchange,
    centerForPerformanceResearch,
    motive,
  ]),
  withPlaces("Queens", {}, [thewoods]),
  withPlaces("Manhattan", {}, [gibney280, gibney890, cc122]),
]);
