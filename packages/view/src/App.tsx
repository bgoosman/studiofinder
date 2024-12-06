import {
  ActionIcon,
  Affix,
  Alert,
  Anchor,
  Button,
  Drawer,
  Group,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAlertCircle,
  IconArrowUp,
  IconBrandGithubFilled,
  IconFilter,
} from "@tabler/icons-react";
import { DateTime } from "luxon";
import { useEffect } from "react";

import InfiniteSlotGroups from "./components/InfiniteSlotGroups";
import { Logo } from "./components/Logo";
import SlotFilters from "./components/SlotFilters";
import { setIsInitializing, useInitializingEntity } from "./state/isInitializing";
import { useCreatedAt } from "./state/places";
import { useTitleEntity } from "./state/title";

import "./App.css";
import CalendarSlotGroups from "./components/CalendarSlotGroups";
import ThemeToggle from "./components/ThemeToggle";
import { WhatIsThisPopover } from "./components/WhatIsThisPopover";
import { useCurrentView, useCurrentViewDays } from "./state/view";

export default function App() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [filtersOpened, { open: openFilters, close: closeFilters }] =
    useDisclosure(false);
  const isInitializing = useInitializingEntity();
  const createdAt = useCreatedAt();
  const titleLower = useTitleEntity((state) => state.toLowerCase());
  const view = useCurrentView();
  const days = useCurrentViewDays();

  useEffect(() => {
    if (isInitializing) {
      setIsInitializing(false);
    }
  }, []);

  return (
    <div className={`overflow-scroll flex flex-col ${dark ? "dark" : ""}`} id="app-inner">
      <header className="flex items-center py-2 gap-x-2 px-3">
        <Logo
          className="h-10"
          onClick={() => {
            window.location.reload();
          }}
        />
        <h1
          style={{
            fontSize: rem(30),
            margin: 0,
            marginRight: rem(10),
          }}
        >
          {titleLower}
        </h1>
        <WhatIsThisPopover />
        <Anchor href="https://github.com/bgoosman/studiofinder" target="_blank">
          <ActionIcon variant="subtle" radius="xl" size="sm">
            <IconBrandGithubFilled size="2rem" />
          </ActionIcon>
        </Anchor>
        <ThemeToggle />
      </header>
      {!isInitializing && (
        <>
          {createdAt && (
            <Alert icon={<IconAlertCircle size="1rem" />}>
              Last updated:{" "}
              {DateTime.fromISO(createdAt).toLocaleString(DateTime.DATETIME_SHORT)}
            </Alert>
          )}
          {/* <Stats /> */}
          <div className="md:flex md:flex-row">
            <SlotFilters
              className="md:w-[350px] p-4"
            />
            {view === "calendar" && <CalendarSlotGroups className="p-4" days={days} />}
            {view === "list" && <InfiniteSlotGroups className="p-4" />}
          </div>
          <Drawer opened={filtersOpened} onClose={closeFilters} title="Filters">
            <SlotFilters />
          </Drawer>
          {view == "list" && (
            <Affix
              position={{ bottom: rem(30), left: "50%" }}
              style={{ transform: "translateX(-50%)" }}
            >
              <Group>
                <Button.Group>
                  <Button
                    aria-label="Open filters"
                    leftIcon={<IconFilter size="1rem" />}
                    onClick={() => openFilters()}
                  >
                    Filters
                  </Button>
                  <Button
                    aria-label="Back to top"
                    id="scrollToTopBtn"
                    leftIcon={<IconArrowUp size="1rem" />}
                    onClick={() =>
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      })
                    }
                  >
                    Scroll up
                  </Button>
                </Button.Group>
              </Group>
            </Affix>
          )}
          {isInitializing && (
            <Logo className="animate-pulse absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-48" />
          )}
        </>
      )}
    </div>
  );
}
