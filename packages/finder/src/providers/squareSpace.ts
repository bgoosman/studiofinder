import { DateTime } from "luxon";
import { Slot } from "../types/Slot";

export type SquareSpaceOptions = {
  USER_ID: string;
  API_KEY: string;
};

export type AvailableDate = {
  date: string;
};

export type AvailableTime = {
  time: string;
  slotsAvailable: number;
};

async function fetchAvailableDates(
  year: number,
  month: number,
  options: SquareSpaceOptions
) {
  const monthString = `${year}-${month < 10 ? `0${month}` : month}`;
  const appointmentTypeID = "26388607";
  const baseURL = "https://acuityscheduling.com/api/v1/availability/dates";
  const url = `${baseURL}?month=${monthString}&appointmentTypeID=${appointmentTypeID}`;

  const headers = new Headers();
  headers.set("Authorization", "Basic " + btoa(options.USER_ID + ":" + options.API_KEY));
  const response = await fetch(url, { headers });
  const datesJson: AvailableDate[] = await response.json();
  const dates = datesJson.map((d) => d.date);
  return dates;
}

async function fetchAvailableTimes(date: string, options: SquareSpaceOptions) {
  const appointmentTypeID = "26388607";
  const baseURL = "https://acuityscheduling.com/api/v1/availability/times";
  const url = `${baseURL}?date=${date}&appointmentTypeID=${appointmentTypeID}`;

  const headers = new Headers();
  headers.set("Authorization", "Basic " + btoa(options.USER_ID + ":" + options.API_KEY));
  const response = await fetch(url, { headers });
  const timesJson: AvailableTime[] = await response.json();
  const dates = timesJson.map((d) => d.time);
  return dates;
}

export const fetchSlotsFromSquareSpace = async (
  options: SquareSpaceOptions
): Promise<Slot[]> => {
  let slots: Slot[] = [];
  let fetchDate = DateTime.now();
  for (let i = 0; i < 1; i++) {
    const dates = await fetchAvailableDates(fetchDate.year, fetchDate.month, options);
    for (const date of dates) {
      const times = await fetchAvailableTimes(date, options);
      slots = slots.concat(
        times.map((time) => ({
          start: DateTime.fromISO(time).toISO(),
          end: DateTime.fromISO(time).plus({ hours: 2 }).toISO(),
        })) as Slot[]
      );
    }
    fetchDate = fetchDate.plus({ month: 1 }).startOf("month");
  }
  return slots;
};
