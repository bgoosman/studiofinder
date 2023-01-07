import { DateTime } from "luxon";
import { EmailStrategy } from "../types/EmailStrategy";
import { Link, LinkType } from "../types/Link";
import { Place } from "../types/Place";
import { Slot } from "../types/Slot";

export const resolveEmailStrategy = (
  emailStrategy: EmailStrategy,
  slot: Slot,
  place: Place
): Link => {
  const { email, subject, body, iana } = emailStrategy;
  const date = DateTime.fromISO(slot.start)
    .setZone(iana)
    .toLocaleString(DateTime.DATE_FULL);
  const room = place.name;
  const resolvedBody = body.replace("$date", date).replace("$room", room);
  return Link.of(
    `Request by email`,
    `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(resolvedBody)}`,
    LinkType.Email
  );
};
