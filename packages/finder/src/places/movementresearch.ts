import * as T from "fp-ts/Task";
import { DateTime } from "luxon";
import { parseString } from "xml2js";
import { DateRange, dateRange } from "../datetime/datetime-fns";
import { invertSlots } from "../slots/invertSlots";
import { mergeOverlappingSlots } from "../slots/mergeOverlappingSlots";
import { Conditional } from "../types/Conditional";
import { Link } from "../types/Link";
import { numberRange } from "../types/NumberRange";
import { withPlaces, withSlots } from "../types/Place";
import { RateValidIf } from "../types/RateValidIf";
import { RentalRate } from "../types/RentalRate";
import { RentalType } from "../types/RentalType";
import { slotsOrderedByDate } from "../types/Slot";

const emailTemplate = `I'd like to rent space,

Studio: $room

Intended use:

Date(s) requested (and alternate dates, if applicable): $date
Requested time: 

My name:

Telephone:

(initiated by rehearsal.fun)
`;
const bookingStrategy = {
  type: "email",
  email: "studio@movementresearch.org",
  subject: "Space Rental",
  body: emailTemplate,

  // https://github.com/moment/luxon/blob/master/docs/zones.md
  iana: "America/New_York",
};

const range = dateRange(new Date(), new Date("2023-01-30T23:59:59.000-05:00"));
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

const schema = {
  Courtyard: {
    links: [
      Link.of(
        "About Courtyard",
        "https://movementresearch.org/locations/mr-courtyard-studio"
      ),
      cc122Link,
    ],
    rates: [...rates],
    slots: [
      {
        templateId: "1-2-063507084006-0000000-10054_084170519067110",
        range,
      },
    ],
  },
  "Ninth St": {
    links: [
      Link.of(
        "About Ninth St",
        "https://movementresearch.org/locations/mr-ninth-street-studio"
      ),
      cc122Link,
    ],
    rates: [...rates],
    slots: [
      {
        templateId: "1-2-063579620511-0000000-14463_084170519067110",
        range,
      },
    ],
  },
};

type UrlOptions = {
  templateId: string;
  range: DateRange;
};

const formatDate = (date: Date) =>
  encodeURIComponent(DateTime.fromJSDate(date).toFormat("MM-dd-yyyy"));

const getUrl = (options: UrlOptions) =>
  `https://sosimple.foxtailtech.com/893/sosimple/sosimple_cal.php?template=${
    options.templateId
  }&from=${formatDate(options.range[0])}&to=${formatDate(options.range[1])}`;

type EventsJson = {
  data: {
    event: Array<{
      start_date: string[];
      end_date: string[];
    }>;
  };
};
const jsonToSlots = (json: unknown) => {
  const events = json as EventsJson;
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
  const slots = await Promise.all(options.map(optionsToSlots));
  const sorted = slots.flat().sort(slotsOrderedByDate.compare);
  const merged = mergeOverlappingSlots(sorted);
  const inverted = invertSlots({
    range,
    hours,
  })(merged);
  return inverted;
};

// getSlots(schema["Courtyard"].slots).then((slots) => {
//   console.log(slots); 
// })

export const cc122 = withPlaces(
  "122 Community Center",
  {
    shortName: "122CC",
  },
  Object.entries(schema).map(([name, { links, rates, slots }]) =>
    withSlots(name, { links: links.map(T.of), bookingStrategy, rates }, () => getSlots(slots))
  )
);
