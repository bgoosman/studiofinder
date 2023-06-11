import { ActionIcon, Button, HoverCard, Popover } from "@mantine/core";
import { IconQuestionMark } from "@tabler/icons-react";
import classNames from "classnames";

export function WhatIsThisPopover({ className }: { className?: string }) {
  const FAQ = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-4">
      <h2 className="font-bold">{title}</h2>
      <p>{children}</p>
    </section>
  );
  return (
    <HoverCard width={450}>
      <HoverCard.Target>
        <ActionIcon variant="subtle" radius="xl" size="sm">
          <IconQuestionMark size={"2rem"} />
        </ActionIcon>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <FAQ title="What is Studio Finder?">
          Studio Finder helps you find a time to rehearse. It replaces the task of opening
          10 different tabs of all your favorite studios, by doing that for you.
        </FAQ>
        <FAQ title="How does it work?">
          Using web scraping techniques, Studio Finder downloads availability and
          transforms it into this user interface.
        </FAQ>
        <FAQ title="Who made it?">
          Hi 👋, I'm Ben Goosman. I made Studio Finder to make it easier for me to craft a
          weekly rehearsal schedule which works for multiple people. Find me at
          @the_real_bgoosman on Instagram, or bgoosman at gmail.com.
        </FAQ>
        <div className="avatar mb-4">
          <div className="w-24 rounded-xl">
            <img src={"/profile-pic.jpg"} alt="Profile picture of Ben Goosman" />
          </div>
        </div>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
