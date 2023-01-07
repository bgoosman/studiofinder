export enum RentalType {
  Audition = "audition",
  Class = "class",
  Dance = "dance",
  Event = "event",
  InPerson = "in-person",
  MediaProduction = "media-production",
  SmallMediaProduction = "small-media-production",
  LargeMediaProduction = "large-media-production",
  Member = "member",
  Music = "music",
  NonMember = "non-member",
  NonProfit = "non-profit",
  OpenRehearsal = "open-rehearsal",
  Performance = "performance",
  PhotoShoot = "photo-shoot",
  Pilates = "pilates",
  Rehearsal = "rehearsal",
  SelfTapeAudition = "self-tape-audition",
  Showing = "showing",
  Subsidized = "subsidized",
  TableRead = "table-read",
  Theater = "theater",
  VideoShoot = "video-shoot",
  Virtual = "virtual",
  Workshop = "workshop",
  Yoga = "yoga",
}

export type CompositeRentalType = RentalType[];
export const CompositeRentalType = {
  toString: (t: CompositeRentalType) => t.join(" "),
};

export const AllRentalTypes = Object.values(RentalType);
