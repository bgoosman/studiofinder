import { Slot } from "../types/Slot";

export type FetchGoogleCalendarOptions = {
  calendarId: string;
  range: [Date, Date];
  key?: string;
};

export type GoogleCalendarEvent = {
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
};

export const KEY = process.env.GOOGLE_KEY;

export const fetchGoogleCalendar =
  (options: FetchGoogleCalendarOptions) => async (): Promise<GoogleCalendarEvent[]> => {
    const {
      calendarId,
      range: [dateMin, dateMax],
      key,
    } = options;
    const from = dateMin.toISOString();
    const to = dateMax.toISOString();
    const url = `https://clients6.google.com/calendar/v3/calendars/${calendarId}%40group.calendar.google.com/events?calendarId=${calendarId}%40group.calendar.google.com&singleEvents=true&timeZone=America%2FNew_York&maxAttendees=1&maxResults=250&sanitizeHtml=true&timeMin=${from}&timeMax=${to}&key=${
      key || KEY
    }`;
    console.debug("Fetching availability from", from, "to", to, "from", calendarId);
    const response = await fetch(url);
    const json = await response.json();
    return json.items as GoogleCalendarEvent[];
  };

export const mapGoogleEventToSlot = (event: GoogleCalendarEvent): Slot => {
  const start = event.start.dateTime;
  const end = event.end.dateTime;
  return {
    start,
    end,
  };
};
