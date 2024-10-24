import { dateRange, daysFrom, monthsFrom, now } from "../datetime/datetime-fns";
import { invertSlots } from "../slots/invertSlots";
import { Material } from "../types/Floor";
import { Link } from "../types/Link";
import { numberRange } from "../types/NumberRange";
import { withPlaces, withSlots } from "../types/Place";
import * as T from "fp-ts/Task";
import { Slot } from "../types/Slot";

const links = [
  T.of(
    Link.of("Book Space", "https://markmorrisdancegroup.org/dance-center/space-rental/")
  ),
];

const hours = numberRange(9, 21);

type MarkMorrisStudioId = {
  BuildingID: number;
  Id: number;
};

type BookingsResult = {
  Bookings: {
    BuildingId: number;
    RoomId: number;
    BookingGMTStart: string;
    BookingGMTEnd: string;
    EventName: string;
  }[];
  BuildingHours: {
    Date: string;
    OpenTime: string;
    CloseTime: string;
    ClosedAllDay: boolean;
  }[];
};

interface APIResponse {
  d: string;
}

const dateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Add 1 because months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getSlotsForDay = async (
  day: Date,
  studioId: MarkMorrisStudioId
): Promise<Slot[]> => {
  const url =
    "https://mmdg.emscloudservice.com/web/AnonymousServersApi.aspx/GetBrowseLocationsBookings";

  const startDate = new Date(day);
  const endDate = new Date(day);
  endDate.setDate(endDate.getDate() + 2);

  const payload = {
    filterData: {
      filters: [
        {
          filterType: 3,
          value: dateToString(startDate) + " 12:00:00",
          displayValue: " ",
          filterName: "StartDate",
        },
        {
          filterType: 3,
          value: dateToString(endDate) + " 12:00:00",
          displayValue: "",
          filterName: "EndDate",
        },
        {
          filterType: 8,
          value: "-1",
          displayValue: "(all)",
          filterName: "Locations",
        },
        {
          filterType: 2,
          value: "61",
          displayValue: "",
          filterName: "TimeZone",
        },
      ],
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json, text/javascript, */*; q=0.01",
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as APIResponse;
    const bookingsResult = JSON.parse(data.d) as BookingsResult;
    // Filter bookings for the requested day
    const bookedSlots = bookingsResult.Bookings.filter((booking) => {
      return booking.BuildingId == studioId.BuildingID && booking.RoomId == studioId.Id;
    }).map((booking) => ({
      start: booking.BookingGMTStart + "Z",
      end: booking.BookingGMTEnd + "Z",
    }));

    return bookedSlots;
  } catch (error) {
    console.error("Error fetching slots:", error);
    throw error;
  }
};

const getSlots = (studioId: MarkMorrisStudioId) => async () => {
  // Get bookings
  const days = 90;
  const slots: Slot[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const slotsForDay = await getSlotsForDay(date, studioId);
    slots.push(...slotsForDay);
  }

  // Invert the bookings to get available slots
  const inverted = invertSlots({
    range: dateRange(now(), daysFrom(days)),
    hours,
  })(slots);

  return inverted;
};

export const markMorris = withPlaces(
  "Mark Morris Dance Group",
  {
    shortName: "Mark Morris",
    hours,
  },
  [
    withSlots(
      "Howard Hodgkin Studio",
      {
        links,
        rates: [],
        floor: {
          type: Material.Marley,
          size: "23 feet,38 feet",
        },
      },
      getSlots({
        BuildingID: 1,
        Id: 4,
      })
    ),
    withSlots(
      "Independence Community Foundation Studio",
      {
        links,
        rates: [],
        floor: {
          type: Material.Wood,
          size: "18 feet,40 feet",
        },
      },
      getSlots({
        BuildingID: 1,
        Id: 3,
      })
    ),
    withSlots(
      "Maxine Morris Studio",
      {
        links,
        rates: [],
        floor: {
          type: Material.Marley,
          size: "30 feet,46 feet",
        },
      },
      getSlots({
        BuildingID: 1,
        Id: 16,
      })
    ),
    withSlots(
      "Robert W. Cole Studio",
      {
        links,
        rates: [],
        floor: {
          type: Material.Marley,
          size: "38 feet,51 feet",
        },
      },
      getSlots({
        BuildingID: 1,
        Id: 2,
      })
    ),
    withSlots(
      "Studio B",
      {
        links,
        rates: [],
        floor: {
          type: Material.Marley,
          size: "24 feet,33 feet",
        },
      },
      getSlots({
        BuildingID: 1,
        Id: 5,
      })
    ),
    withSlots(
      "Studio E",
      {
        links,
        rates: [],
        floor: {
          type: Material.Marley,
          size: "29 feet,53 feet",
        },
      },
      getSlots({
        BuildingID: 1,
        Id: 88,
      })
    ),
    withSlots(
      "Studio F",
      {
        links,
        rates: [],
        floor: {
          type: Material.Marley,
          size: "28 feet,40 feet",
        },
      },
      getSlots({
        BuildingID: 1,
        Id: 89,
      })
    ),
  ]
);

/**
{
  "CanBook": false,
  "ShowSetupTeardown": true,
  "Buildings": [
    {
      "LocationLink": "/web/LocationDetails.aspx?data=Xc3Pf4edEPMxKKDxoCgqQ7xa7ZSd8ddlQ9voLQUV0LV2VFxY4JNvuyt3%2fQcUcrIU",
      "TimeZone": "ET",
      "OffsetMinutes": -240,
      "GmtMinutes": -240,
      "GmtDateTime": "2024-10-23T04:00:00",
      "HasReservableRooms": true,
      "HasRequestableRooms": false,
      "BuildingHours": [
        {
          "OpenTimeLength": 540,
          "CloseTimePosition": 1260,
          "BuildingId": 1,
          "Date": "2024-10-23T00:00:00",
          "OpenTime": "1900-01-01T09:00:00",
          "CloseTime": "1900-01-01T21:00:00",
          "ClosedAllDay": false,
          "GMTOpen": "2024-10-23T13:00:00",
          "GMTClose": "2024-10-24T01:00:00"
        },
        {
          "OpenTimeLength": 540,
          "CloseTimePosition": 1260,
          "BuildingId": 1,
          "Date": "2024-10-24T00:00:00",
          "OpenTime": "1900-01-01T09:00:00",
          "CloseTime": "1900-01-01T21:00:00",
          "ClosedAllDay": false,
          "GMTOpen": "2024-10-24T13:00:00",
          "GMTClose": "2024-10-25T01:00:00"
        }
      ],
      "BuildingHoliday": [],
      "Rooms": [
        {
          "LocationLink": "/web/LocationDetails.aspx?data=VuKrzliTM71uGosir%2foN7FqmYDaaASdZX8wOpcoyoIetnC%2buNxeIb0YAQquJHoWB",
          "RecordType": 1,
          "PromptForBillingReference": false,
          "AddRoomToCartText": null,
          "DisplayText": "Howard Hodgkin Studio",
          "MinCapacity": 0,
          "Capacity": 25,
          "SetupHours": 0.0,
          "TeardownHours": 0.0,
          "SeqNo": 13,
          "BuildingID": 1,
          "Id": 4,
          "Code": "004",
          "Description": "Howard Hodgkin Studio"
        },
        {
          "LocationLink": "/web/LocationDetails.aspx?data=wUZauXrwryL2mWQtBGblCeyCRSfxB3ZCYsDqtnRIc1A5KAeGcCDRLSd8IQdGH%2fcT",
          "RecordType": 1,
          "PromptForBillingReference": false,
          "AddRoomToCartText": null,
          "DisplayText": "Independence Community Foundation Studio",
          "MinCapacity": 0,
          "Capacity": 32,
          "SetupHours": 0.0,
          "TeardownHours": 0.0,
          "BuildingID": 1,
          "SeqNo": 12,
          "Id": 3,
          "Code": "003",
          "Description": "Independence Community Foundation Studio"
        },
        {
          "LocationLink": "/web/LocationDetails.aspx?data=sBHjoASXAphTb0%2fiMVfPfKdXXxQsTaAvQnSBpdMhcmbzY8y0ZDmqd8%2f0I4vfawYh",
          "RecordType": 1,
          "PromptForBillingReference": false,
          "AddRoomToCartText": null,
          "DisplayText": "Maxine Morris Studio",
          "MinCapacity": 0,
          "Capacity": 50,
          "SetupHours": 0.0,
          "TeardownHours": 0.0,
          "BuildingID": 1,
          "SeqNo": 15,
          "Id": 16,
          "Code": "006",
          "Description": "Maxine Morris Studio"
        },
        {
          "LocationLink": "/web/LocationDetails.aspx?data=XHoo9AMVGMRy1ZmwU1H1sNFPqhSl4c36xMVhIoNJLe0q%2bsnKP%2blKIYlUtuQHpsqu",
          "RecordType": 1,
          "PromptForBillingReference": false,
          "AddRoomToCartText": null,
          "DisplayText": "Robert W. Cole Studio",
          "MinCapacity": 0,
          "Capacity": 70,
          "SetupHours": 0.0,
          "TeardownHours": 0.0,
          "BuildingID": 1,
          "SeqNo": 11,
          "Id": 2,
          "Code": "002",
          "Description": "Robert W. Cole Studio"
        },
        {
          "LocationLink": "/web/LocationDetails.aspx?data=sxdJT0tFYs1izZI%2fOCljcSDO6IdTkLUnX6Ellmp80YYJhG3roqmqAbirEJGsrVu9",
          "RecordType": 1,
          "PromptForBillingReference": false,
          "AddRoomToCartText": null,
          "DisplayText": "Studio B",
          "MinCapacity": 0,
          "Capacity": 25,
          "SetupHours": 0.0,
          "TeardownHours": 0.0,
          "BuildingID": 1,
          "SeqNo": 14,
          "Id": 5,
          "Code": "005 ",
          "Description": "Studio B"
        },
        {
          "LocationLink": "/web/LocationDetails.aspx?data=rjEtnsUPQ3hBn4S%2bsUMqU4AjayK2M5pgtwKLWPQ75tNvlNlR3zgT6V54tOuEqyum",
          "RecordType": 1,
          "PromptForBillingReference": false,
          "AddRoomToCartText": null,
          "DisplayText": "Studio E",
          "MinCapacity": 0,
          "Capacity": 40,
          "SetupHours": 0.0,
          "TeardownHours": 0.0,
          "BuildingID": 1,
          "SeqNo": 16,
          "Id": 88,
          "Code": "006.5",
          "Description": "Studio E"
        },
        {
          "LocationLink": "/web/LocationDetails.aspx?data=rjEtnsUPQ3hwYT051ISicLp4Lo36w6R8gn30Xf9le3lUQ%2fyTcMMfQa5Tp8D%2fzaDK",
          "RecordType": 1,
          "PromptForBillingReference": false,
          "AddRoomToCartText": null,
          "DisplayText": "Studio F",
          "MinCapacity": 0,
          "Capacity": 30,
          "SetupHours": 0.0,
          "TeardownHours": 0.0,
          "BuildingID": 1,
          "SeqNo": 17,
          "Id": 89,
          "Code": "006.75",
          "Description": "Studio F"
        }
      ],
      "DisplayText": "Dance Center",
      "TimeZoneId": 61,
      "Id": 1,
      "Code": "DC1",
      "Description": "Dance Center"
    }
  ],
  "AvailableBuildings": [
    {
      "LocationLink": null,
      "TimeZone": "ET",
      "OffsetMinutes": -240,
      "GmtMinutes": 0,
      "GmtDateTime": "0001-01-01T00:00:00",
      "HasReservableRooms": false,
      "HasRequestableRooms": false,
      "BuildingHours": null,
      "BuildingHoliday": null,
      "Rooms": [],
      "DisplayText": "Dance Center",
      "TimeZoneId": 61,
      "Id": 1,
      "Code": "DC1",
      "Description": "Dance Center"
    }
  ],
  "RoomIds": [],
  "BuildingHours": null,
  "BuildingHoliday": null
}
*/
