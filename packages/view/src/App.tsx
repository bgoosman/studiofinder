import {
  ArrowUpIcon,
  CalendarIcon,
  InformationCircleIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import { IconCirclePlus, IconWood } from "@tabler/icons-react";

import { DateTime } from "luxon";
import { useEffect } from "react";

import { Logo } from "./components/Logo";
import { PlaceFilterTree } from "./components/PlaceFilterTree";
import { SlotGroup } from "./components/SlotGroup";
import { Stats } from "./components/Stats";
import { WeekdayFilter } from "./components/WeekdayFilter";
import { WhatIsThisPopover } from "./components/WhatIsThisPopover";
import {
  getNextPage,
  hasNextPage,
  infiniteSlotGroups,
  totalPageCount,
} from "./state/infiniteSlotGroups";
import { setIsInitializing, useInitializingEntity } from "./state/isInitializing";
import { useCreatedAt } from "./state/places";
import { useTitleEntity } from "./state/title";

import "./App.css";
import { FloorMaterialFilter } from "./components/FloorMaterialFilter";
import { Material, materials } from "../../finder/src/types/Floor";
import { setSlotFilter } from "./state/slotFilters";
import { setWeekdayEnabled, weekdays } from "./state/filters/weekdayFilter";
import { setFloorMaterialEnabled } from "./state/filters/floorMaterialFilter";

function AllButton({onClick}: {onClick: () => void}) {
  return (
    <button
      className="btn btn-xs btn-ghost px-1"
      onClick={onClick}
    >
      <IconCirclePlus size={16} />
    </button>
  );
}

export default function App() {
  const isInitializing = useInitializingEntity();
  const createdAt = useCreatedAt();
  const titleLower = useTitleEntity((state) => state.toLowerCase());
  const _infiniteSlotGroups = infiniteSlotGroups.use();
  const _hasNextPage = hasNextPage.use();
  const _totalPageCount = totalPageCount.use();

  useEffect(() => {
    if (isInitializing) {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const rootElement = document.documentElement;
      const scrollToTopBtn = document.getElementById("scrollToTopBtn")!;
      var scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
      if (rootElement.scrollTop / scrollTotal > 0.01) {
        // Show button
        scrollToTopBtn.classList.remove("hidden");
      } else {
        // Hide button
        scrollToTopBtn.classList.add("hidden");
      }
    });
  }, []);

  const onScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      getNextPage();
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [_infiniteSlotGroups]);

  return (
    <div className="overflow-scroll flex flex-col" id="app-inner">
      <header className="navbar bg-base-100 flex-grow-0 p-3">
        <div className="flex-1">
          <Logo
            className="h-10 mr-3"
            onClick={() => {
              window.location.reload();
            }}
          />
          <h1 className="text-4xl pr-2">{titleLower}</h1>
        </div>
        <div className="flex-none flex gap-x-2 items-center">
          {/* <ThemePicker /> */}
          <WhatIsThisPopover className="z-20" />
        </div>
      </header>
      {!isInitializing && (
        <>
          <section className="px-3">
            {createdAt && (
              <h2 className="mb-2 flex items-center">
                <InformationCircleIcon className="h-4 w-4 mr-1" /> Last updated:{" "}
                {DateTime.fromISO(createdAt).toLocaleString(DateTime.DATETIME_SHORT)}
              </h2>
            )}
          </section>
          <section aria-label="Filters" className="px-3">
            <h2 className="mb-2 flex items-center gap-x-1">
              <CalendarIcon className="h-4 w-4" />
              Day
            </h2>
            <div className="space-x-1 mb-3 flex items-center">
              <WeekdayFilter label="Sunday" weekday={"0"} />
              <WeekdayFilter label="Monday" weekday={"1"} />
              <WeekdayFilter label="Tuesday" weekday={"2"} />
              <WeekdayFilter label="Wednesday" weekday={"3"} />
              <WeekdayFilter label="Thursday" weekday={"4"} />
              <WeekdayFilter label="Friday" weekday={"5"} />
              <WeekdayFilter label="Saturday" weekday={"6"} />
              <AllButton onClick={() => {
                weekdays.forEach(weekday => {
                  setSlotFilter("weekday", setWeekdayEnabled(true)(weekday))
                });
              }} />
            </div>
            <h2 className="mb-2 flex items-center">
              <IconWood size={16} className="mr-1" />
              Floor
            </h2>
            <div className="w-full space-x-1 mb-3">
              <FloorMaterialFilter label="Wood" material={Material.Wood} />
              {/* There are no rooms with concrete yet <FloorMaterialFilter label="Concrete" material={Material.Concrete} /> */}
              <FloorMaterialFilter label="Marley" material={Material.Marley} />
              <AllButton onClick={() => {
                materials.forEach(material => {
                  setSlotFilter("floorMaterial", setFloorMaterialEnabled(true)(material))
                });
              }} />
            </div>
            <h2 className="mb-2 flex items-center">
              <MapIcon className="h-4 w-4 mr-1" />
              Place
            </h2>
            <PlaceFilterTree className="mb-2" />
          </section>
          <section aria-label="Result stats" className="p-4">
            <Stats />
          </section>
          <section aria-label="Available space to rent">
            {_totalPageCount > 0 && (
              <>
                {_infiniteSlotGroups.length > 0 &&
                  _infiniteSlotGroups.map(
                    ([date, slots]) =>
                      slots.length > 0 && (
                        <SlotGroup
                          key={date}
                          slots={slots}
                          title={DateTime.fromISO(date).toLocaleString({
                            weekday: "short",
                            month: "long",
                            day: "2-digit",
                          })}
                        />
                      )
                  )}
                <p className="p-4">
                  {_hasNextPage
                    ? "There are more slots. Keep scrolling!"
                    : "That's all for now! Try different filters."}
                </p>
              </>
            )}
          </section>
          <button
            aria-label="Back to top"
            className="fixed hidden z-10 right-24 bottom-16 btn btn-primary btn-circle"
            id="scrollToTopBtn"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <ArrowUpIcon className="h-8 w-8" />
          </button>
          {isInitializing && (
            <Logo className="animate-pulse absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-48" />
          )}
        </>
      )}
    </div>
  );
}
