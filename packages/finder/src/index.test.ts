import { DateTime } from "luxon";
import universeJson from "../dist/universe.json";
import { ResolvedPlace } from "./types/Place";
import { DiscountedRentalRate, RentalRate } from "./types/RentalRate";
import { AllRentalTypes, RentalType } from "./types/RentalType";

const getPlace = (fullPath: string[]) => {
  const recurse = (place: ResolvedPlace, nextPath: string[]): ResolvedPlace => {
    if (nextPath.length === 0) {
      return place;
    }
    const nextName = nextPath.shift();
    const nextPlace = place.places.find((place) => place.name === nextName);
    if (!nextPlace) throw new Error("Oops! That's not a valid path");
    return recurse(nextPlace, nextPath);
  };
  return recurse(universeJson as unknown as ResolvedPlace, fullPath);
};

/**
 * Every place
 * - has slots
 * Every slot
 * - has at least one rental rate
 * Every rental rate
 * - has a validIf
 * - has a rate
 * Every validIf
 * - returns false if allowed rental types is empty
 */
it("is valid", () => {
  expect(AllRentalTypes.length).toBe(26);

  const verify = (path: string[]) => {
    const place = getPlace(path);
    expect(place.meta.rates!.length > 0).toBe(true);
    expect(place.meta.rates!.every((rate) => rate.validIf != undefined)).toBe(true);

    const hasSlots = place.slots.length > 0;
    if (hasSlots) {
      expect(
        place.slots.every((slot) =>
          place.meta.rates!.every((rate) => {
            return RentalRate.isValid(rate)(slot, new Date(), AllRentalTypes);
          })
        )
      ).toBe(false);

      place.slots.forEach((slot, i) => {
        const slotStart = new Date(slot.start);
        const yesterday = DateTime.now().minus({ days: 1 }).toJSDate();
        expect(slotStart > yesterday).toBe(true);
        if (i > 0) {
          const prevSlot = place.slots[i - 1];
          const prevSlotEnd = new Date(prevSlot.end);
          expect(slotStart >= prevSlotEnd).toBe(true);
        }
      });

      // all slots should have a unique start time
      const uniqStartTimes = new Set(place.slots.map((slot) => slot.start));
      expect(uniqStartTimes.size).toBe(place.slots.length);

      // all slots should have a unique end time
      const uniqEndTimes = new Set(place.slots.map((slot) => slot.end));
      expect(uniqEndTimes.size).toBe(place.slots.length);
    }

    if (place.id != "Universe>Manhattan>Gibney (890 Broadway)>Studio 1")
      expect(hasSlots).toBe(true);

    if (place.id == "Universe>Manhattan>Gibney (280 Broadway)>Studio A")
      // There should be at least one discounted rate
      expect(
        place.meta.rates!.some((rate) => {
          return DiscountedRentalRate.isDiscounted(rate);
        })
      ).toBe(true);

    // A bogus current date will strike out any rates with startHoursWithin
    if (hasSlots) {
      const startHoursWithinRates = place.meta.rates!.filter((rate) =>
        rate.validIf.expressions.some((validIf) => "startHoursWithin" in validIf)
      );
      if (startHoursWithinRates.length > 0)
        expect(
          place.slots.every((slot) =>
            startHoursWithinRates.every(
              (rate) =>
                !RentalRate.isValid(rate)(
                  slot,
                  DateTime.fromISO("1990-01-01T00:00:00.000Z").toJSDate(),
                  AllRentalTypes
                )
            )
          )
        ).toBe(true);
    }

    // Check if Some[Audition] can match All[Audition, Virtual]
    if (place.id === "Universe>Brooklyn>Triskelion Arts>Doug") {
      expect(
        place.slots.some((slot) =>
          place.meta.rates!.some((rate) =>
            RentalRate.isValid(rate)(slot, new Date(), [RentalType.Audition])
          )
        )
      ).toBe(true);
    }
  };

  verify(["Brooklyn", "Brooklyn Arts Exchange", "Studio A"]);
  verify(["Brooklyn", "Brooklyn Arts Exchange", "Studio B"]);
  verify(["Brooklyn", "Brooklyn Arts Exchange", "Studio C"]);
  verify(["Brooklyn", "Brooklyn Arts Exchange", "Studio D"]);
  verify(["Brooklyn", "Chez Bushwick", "Chez Bushwick"]);
  verify(["Brooklyn", "Triskelion Arts", "Theater"]);
  verify(["Brooklyn", "Triskelion Arts", "Stu"]);
  verify(["Brooklyn", "Triskelion Arts", "Lillian"]);
  verify(["Brooklyn", "Triskelion Arts", "Doug"]);
  verify(["Brooklyn", "Center For Performance Research", "Large Studio"]);
  verify(["Brooklyn", "Center For Performance Research", "Small Studio"]);
  verify(["Queens", "The Woods", "The Woods"]);
  verify(["Manhattan", "122 Community Center", "Courtyard"]);
  verify(["Manhattan", "122 Community Center", "Ninth St"]);
  // Studio 1 has zero availability right now
  verify(["Manhattan", "Gibney (890 Broadway)", "Studio 1"]);
  verify(["Manhattan", "Gibney (890 Broadway)", "Studio 2"]);
  verify(["Manhattan", "Gibney (890 Broadway)", "Studio 3"]);
  verify(["Manhattan", "Gibney (890 Broadway)", "Studio 4"]);
  verify(["Manhattan", "Gibney (890 Broadway)", "Studio 5-2"]);
  verify(["Manhattan", "Gibney (890 Broadway)", "Studio 6"]);
  verify(["Manhattan", "Gibney (890 Broadway)", "Studio 7"]);
  verify(["Manhattan", "Gibney (890 Broadway)", "Studio 8"]);
  verify(["Manhattan", "Gibney (890 Broadway)", "Studio 9"]);
  verify(["Manhattan", "Gibney (280 Broadway)", "Studio A"]);
  verify(["Manhattan", "Gibney (280 Broadway)", "Studio B"]);
  verify(["Manhattan", "Gibney (280 Broadway)", "Studio C"]);
  verify(["Manhattan", "Gibney (280 Broadway)", "Studio D"]);
  verify(["Manhattan", "Gibney (280 Broadway)", "Studio E"]);
  verify(["Manhattan", "Gibney (280 Broadway)", "Studio F"]);
  verify(["Manhattan", "Gibney (280 Broadway)", "Studio G"]);
  verify(["Manhattan", "Gibney (280 Broadway)", "Studio H (Theater)"]);
});
