import { DateTime } from "luxon";

export const TimeRange = ({ start, end }: { start: string; end: string }) => {
  const startHour = DateTime.fromISO(start).setZone("local").hour;
  const startMinute = DateTime.fromISO(start).setZone("local").minute;
  const startMeridiem = startHour < 12 ? "a" : "p";
  const endHour = DateTime.fromISO(end).setZone("local").hour;
  const endMinute = DateTime.fromISO(end).setZone("local").minute;
  const endMeridiem = endHour < 12 ? "a" : "p";
  return (
    <>
      {startHour % 12 === 0 ? 12 : startHour % 12}
      {startMinute > 0 ? `:${startMinute}` : ``}
      {startMeridiem}-{endHour % 12 === 0 ? 12 : endHour % 12}
      {endMinute > 0 ? `:${endMinute}` : ``}
      {endMeridiem}
    </>
  );
};
