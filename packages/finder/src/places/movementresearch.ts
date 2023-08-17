import * as T from "fp-ts/Task";
import { DateTime } from "luxon";
import { parseString } from "xml2js";
import { DateRange, dateRange } from "../datetime/datetime-fns";
import { invertSlots } from "../slots/invertSlots";
import { mergeOverlappingSlots } from "../slots/mergeOverlappingSlots";
import { Conditional } from "../types/Conditional";
import { Material } from "../types/Floor";
import { Link } from "../types/Link";
import { numberRange } from "../types/NumberRange";
import { Photo } from "../types/Photo";
import { PlaceMeta, withPlaces, withSlots } from "../types/Place";
import { RateValidIf } from "../types/RateValidIf";
import { RentalRate } from "../types/RentalRate";
import { RentalType } from "../types/RentalType";
import { Slot, slotsOrderedByDate } from "../types/Slot";

const emailTemplate = `I'd like to rent space,

Studio: $room

Intended use:

Date(s) requested (and alternate dates, if applicable): $date
Requested time: 

My name:

Telephone:

(initiated by studiofinder.fun)
`;
const bookingStrategy = {
  type: "email",
  email: "studio@movementresearch.org",
  subject: "Space Rental",
  body: emailTemplate,

  // https://github.com/moment/luxon/blob/master/docs/zones.md
  iana: "America/New_York",
};

const todayPlusThreeMonths = DateTime.local().plus({ months: 3 }).toJSDate();
const range = dateRange(new Date(), todayPlusThreeMonths);
const hours = numberRange(9, 22);
const cc122Link = Link.of(
  "122CC Info",
  "https://movementresearch.org/locations/mr-122-community-center"
);

const rates = [
  RentalRate.of({
    rate: 10,
    validIf: Conditional.all(
      RateValidIf.of({
        rentalHasTypes: Conditional.all(RentalType.Rehearsal),
      })
    ),
  }),
  RentalRate.of({
    rate: 35,
    validIf: Conditional.all(
      RateValidIf.of({
        rentalHasTypes: Conditional.some(RentalType.Class, RentalType.Workshop),
      })
    ),
  }),
];

//https://sosimple.foxtailtech.com/893/sosimple/sosimple_cal.php?calendar=1-2-063508965141-0000000-08731_084170519067110&js=1#date=2023-04-03,mode=week
const schema = {
  Courtyard: {
    meta: {
      amenities: [],
      floor: {
        type: Material.Marley,
        size: "21.5 feet,43 feet",
      },
      links: [
        T.of(
          Link.of(
            "About Courtyard",
            "https://movementresearch.org/locations/mr-courtyard-studio"
          )
        ),
        T.of(cc122Link),
      ],
      photos: [
        Photo.of(
          "windows, marley floor",
          "https://s3-us-west-2.amazonaws.com/movementresearch/locations/mr-courtyard-studio/_squareListing/DSC_0452.JPG"
        ),
      ],
      rates: [...rates],
    } as PlaceMeta,
    slots: [
      {
        baseUrl:
          "https://sosimple.foxtailtech.com/893/sosimple/sosimple_cal.php?template=1-2-063507084006-0000000-10054_084170519067110&uid=1680541636882&calendar=1-2-063508965141-0000000-08731_084170519067110&js=1&i=0&timeshift=240",
        range,
      },
    ],
  },
  "Ninth St": {
    meta: {
      amenities: [],
      floor: {
        type: Material.Marley,
        size: "26 feet,86 feet",
      },
      links: [
        T.of(
          Link.of(
            "About Ninth St",
            "https://movementresearch.org/locations/mr-ninth-street-studio"
          )
        ),
        T.of(cc122Link),
      ],
      photos: [
        Photo.of(
          "marley floor, windows, fire escape doors",
          "https://s3-us-west-2.amazonaws.com/movementresearch/locations/mr-ninth-street-studio/_squareListing/DSC_0453.JPG"
        ),
      ],
      rates: [...rates],
    } as PlaceMeta,
    slots: [
      {
        baseUrl:
          "https://sosimple.foxtailtech.com/893/sosimple/sosimple_cal.php?template=1-2-063579620511-0000000-14463_084170519067110&uid=1680541202231&calendar=1-2-063579620499-0000000-14463_084170519067110&js=1&i=0&timeshift=240",
        range,
      },
    ],
  },
};

type UrlOptions = {
  baseUrl: string;
  range: DateRange;
};

const formatDate = (date: Date) =>
  encodeURIComponent(DateTime.fromJSDate(date).toFormat("MM-dd-yyyy"));

const getUrl = (options: UrlOptions) =>
  `${options.baseUrl}&from=${formatDate(options.range[0])}&to=${formatDate(
    options.range[1]
  )}`;

type EventsJson = {
  data: {
    event: Array<{
      start_date: string[];
      end_date: string[];
    }>;
  };
};
const jsonToSlots = (json: unknown) => {
  const events = json as EventsJson; //?
  return events.data.event.map((event) => ({
    start: DateTime.fromFormat(event.start_date[0], "MM/dd/yyyy HH:mm:ss").toISO(),
    end: DateTime.fromFormat(event.end_date[0], "MM/dd/yyyy HH:mm:ss").toISO(),
  }));
};

const xmlToJson = (xml: string) =>
  new Promise((resolve, reject) => {
    parseString(xml, (err: unknown, result: unknown) => {
      if (err) {
        reject("Error parsing XML string");
      } else {
        resolve(result);
      }
    });
  });

const optionsToSlots = async (options: UrlOptions) => {
  const url = getUrl(options);
  const result = await fetch(url);
  const text = await result.text();
  const json = await xmlToJson(text);
  return jsonToSlots(json);
};

const getSlots = async (options: Array<UrlOptions>) => {
  try {
    const slots = (await Promise.all(options.map(optionsToSlots))) as Slot[][];
    const sorted = slots.flat().sort(slotsOrderedByDate.compare);
    const merged = mergeOverlappingSlots(sorted);
    const inverted = invertSlots({
      range,
      hours,
    })(merged);
    return inverted;
  } catch (error) {
    console.error(`Failed to get slots for Movement Research`);
    return [];
  }
};

// getSlots(schema["Courtyard"].slots).then((slots) => {
//   console.log(slots); //?
// });

export const cc122 = withPlaces(
  "122 Community Center",
  {
    shortName: "122CC",
  },
  Object.entries(schema).map(([name, { meta, slots }]) =>
    withSlots(name, meta, () => getSlots(slots))
  )
);
