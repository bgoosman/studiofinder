import { Affix, Alert, Button, Drawer, Group, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAlertCircle, IconArrowUp, IconFilter } from "@tabler/icons-react";
import { DateTime } from "luxon";
import { useEffect } from "react";

import { Logo } from "./components/Logo";
import { setIsInitializing, useInitializingEntity } from "./state/isInitializing";
import { useCreatedAt } from "./state/places";
import { useTitleEntity } from "./state/title";
import InfiniteSlotGroups from "./components/InfiniteSlotGroups";
import SlotFilters from "./components/SlotFilters";

import "./App.css";
import { WhatIsThisPopover } from "./components/WhatIsThisPopover";

export default function App() {
  const [filtersOpened, { open: openFilters, close: closeFilters }] =
    useDisclosure(false);
  const isInitializing = useInitializingEntity();
  const createdAt = useCreatedAt();
  const titleLower = useTitleEntity((state) => state.toLowerCase());

  useEffect(() => {
    if (isInitializing) {
      setIsInitializing(false);
    }
  }, []);

  return (
    <div className="overflow-scroll flex flex-col" id="app-inner">
      <header className="flex items-center py-2 gap-x-3 px-3">
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
          }}
        >
          {titleLower}
        </h1>
        <WhatIsThisPopover />
      </header>
      {!isInitializing && (
        <>
          {createdAt && (
            <Alert icon={<IconAlertCircle size="1rem" />}>
              Last updated:{" "}
              {DateTime.fromISO(createdAt).toLocaleString(DateTime.DATETIME_SHORT)}
            </Alert>
          )}
          <div className="md:flex md:flex-row">
            <SlotFilters className="md:w-[350px] p-4" />
            <InfiniteSlotGroups className="p-4" />
          </div>
          <Drawer opened={filtersOpened} onClose={closeFilters} title="Filters">
            <SlotFilters />
          </Drawer>
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
          {isInitializing && (
            <Logo className="animate-pulse absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-48" />
          )}
        </>
      )}
    </div>
  );
}
