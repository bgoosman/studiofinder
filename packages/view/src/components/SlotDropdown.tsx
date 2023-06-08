import { Anchor, Popover } from "@mantine/core";
import { ResolvedSlot } from "finder/src/types/Slot";
import { Link } from "finder/src/types/Link";
import { getPlaceById } from "../state/places";
import { TimeRange } from "./TimeRange";
import { IconLink, IconMenu2, IconPencil } from "@tabler/icons-react";

export type SlotActionsPopoverProps = { slot: ResolvedSlot };
const LinkItem = ({ link }: { link: Link }) => {
  const { type, url, label } = link;
  let icon;
  switch (type) {
    case "url":
      icon = <IconLink size="1rem" />;
      break;
    case "email":
      icon = <IconPencil size="1rem" />;
      break;
  }
  return (
    <li>
      <Anchor href={url} target="_blank">
        {icon} {label}
      </Anchor>
    </li>
  );
};

export const SlotActionsPopover = ({ slot }: SlotActionsPopoverProps) => {
  const { links } = slot;
  const place = getPlaceById(slot.placeId)!;
  return (
    <Popover width={200} position="left" withArrow shadow="md">
      <Popover.Target>
        <IconMenu2 size="1.25rem" />
      </Popover.Target>

      <Popover.Dropdown>
        <p className="p-2">
          {place.name} <TimeRange start={slot.start} end={slot.end} />
        </p>
        <ul className="menu">
          {links.map((link) => (
            <LinkItem key={link.url} link={link} />
          ))}
        </ul>
      </Popover.Dropdown>
    </Popover>
  );
};
