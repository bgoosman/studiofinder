import { withPlaces } from "../types/Place";
import { brooklynArtsExchange } from "./bax";
import { chezbushwick } from "./chezbushwick";
import { centerForPerformanceResearch } from "./cpr";
import { gibney280 } from "./gibney280";
import { gibney890 } from "./gibney890";
import { markMorris } from "./markmorris";
import { motive } from "./motive";
import { cc122 } from "./movementresearch";
import { thewoods } from "./thewoods";
import { triskelion } from "./triskelion";

export const universe = withPlaces("Universe", {}, [
  withPlaces("Brooklyn", {}, [
    triskelion,
    chezbushwick,
    centerForPerformanceResearch,
    markMorris,

    // Commenting out BAX until I can fix it.
    // brooklynArtsExchange,

    // Commenting out Motive for now, because their API subscription expired.
    // "API access is only available on Powerhouse plans, upgrade at https://secure.acuityscheduling.com/preferences.php?action=myaccount"
    // motive,
  ]),
  // withPlaces("Queens", {}, [thewoods]),
  // withPlaces("Manhattan", {}, [
  //   gibney280,
  //   gibney890,
  //   // cc122
  // ]),
]);
