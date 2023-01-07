import {
  Bars3Icon,
  LinkIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import * as Popover from "@radix-ui/react-popover";
import { ResolvedSlot } from "finder/src/types/Slot";
import { Link } from "finder/src/types/Link";
import { getPlaceById } from "../state/places";
import { TimeRange } from "./TimeRange";

export type SlotActionsPopoverProps = { slot: ResolvedSlot };
const LinkItem = ({ link }: { link: Link }) => {
  const { type, url, label } = link;
  let icon;
  switch (type) {
    case "url":
      icon = <LinkIcon className="h-5 w-5" />;
      break;
    case "email":
      icon = <PencilSquareIcon className="h-5 w-5" />;
      break;
  }
  return (
    <li>
      <a href={url} target="_blank">
        {icon} {label}
      </a>
    </li>
  );
};

export const SlotActionsPopover = ({ slot }: SlotActionsPopoverProps) => {
  const { links } = slot;
  const place = getPlaceById(slot.placeId)!;
  return (
    <Popover.Root>
      <Popover.Trigger className="btn btn-ghost">
        <Bars3Icon className="h-5 w-5" />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className="sf-popover" sideOffset={0} side="left" align="end">
          <p className="p-2">
            {place.name} <TimeRange start={slot.start} end={slot.end} />
          </p>
          <ul className="menu">
            {links.map((link) => (
              <LinkItem key={link.url} link={link} />
            ))}
          </ul>
          <Popover.Close className="absolute top-5 right-5">
            <XMarkIcon className="h-5 w-5"></XMarkIcon>
          </Popover.Close>
          <Popover.Arrow className="" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
