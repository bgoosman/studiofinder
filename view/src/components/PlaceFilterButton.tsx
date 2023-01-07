import classNames from "classnames";
import { PlacesFilter, setPlaceFilter } from "../state/filters/placeFilter";
import { setSlotFilter, useSlotFilter } from "../state/slotFilters";
import { Switch } from "@headlessui/react";
import { Fragment } from "react";
import { ResolvedPlace } from "@finder/Place";

export const clearHighlight = () => {
  document.querySelectorAll(".place-toggle-button").forEach((el) => {
    el.classList.remove("shadow-md");
    el.classList.remove("shadow-base-200");
    el.classList.remove("opacity-30");
  });
};

const PATH_ID_ATTRIBUTE = "data-pathid";
export const highlightPath = (path: string[]) => {
  const highlight = (el: Element, value: boolean) => {
    el.classList.toggle("shadow-md", value);
    el.classList.toggle("shadow-base-200", value);
    el.classList.toggle("opacity-30", !value);
  };

  const toggles = document.querySelectorAll(".place-toggle-button");

  toggles.forEach((el) => {
    highlight(el, false);
  });

  // Highlight all ancestor toggles in this path
  for (let i = 0; i < path.length - 1; i++) {
    const classPath = path.slice(0, i + 1).join(">");
    const selector = `[${PATH_ID_ATTRIBUTE}="${classPath}"]`;
    const els = document.querySelectorAll(selector);
    for (const el of els) {
      highlight(el, true);
    }
  }

  // Highlight all descendant toggles with this path as prefix
  const classPath = path.join(">");
  for (const el of toggles) {
    if (el.getAttribute(PATH_ID_ATTRIBUTE)?.startsWith(classPath)) {
      highlight(el, true);
    }
  }
};

export type PlaceFilterButtonProps = {
  className?: string;
  place: ResolvedPlace;
};

export const PlaceFilterButton = ({ className, place }: PlaceFilterButtonProps) => {
  const checked = useSlotFilter("place", (sf) => sf[place.id]!);
  return (
    <Switch
      as={Fragment}
      checked={checked}
      onChange={(newChecked: boolean) =>
        setSlotFilter("place", (placeFilter) =>
          setPlaceFilter(newChecked)(place.id)(placeFilter)
        )
      }
    >
      {({ checked }) => (
        <button
          {...{ [PATH_ID_ATTRIBUTE]: place.id }}
          className={classNames(
            className,
            "btn",
            "btn-xs md:btn-sm flex-nowrap",
            {
              "btn-outline": !checked,
              "btn-primary": checked,
            },
            "focus:ring-2 focus:ring-offset-2 focus:ring-primary",
            "place-toggle-button",
            "normal-case"
          )}
          onClick={() => {
            clearHighlight();
          }}
          onMouseOver={() => {
            highlightPath(place.path);
          }}
          onMouseOut={() => {
            clearHighlight();
          }}
        >
          {place.name}
        </button>
      )}
    </Switch>
  );
};
