import classNames from "classnames";
import { setPlaceFilter } from "../state/filters/placeFilter";
import { setSlotFilter, useSlotFilter } from "../state/slotFilters";
import { ResolvedPlace } from "finder/src/types/Place";
import ToggleButton from "./ToggleButton";

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
  place: ResolvedPlace;
};

export const PlaceFilterButton = ({ place }: PlaceFilterButtonProps) => {
  const checked = useSlotFilter("place", (sf) => sf[place.id]!);
  return (
    <ToggleButton
      checked={checked}
      ariaLabel={place.name}
      className={classNames("place-toggle-button")}
      off={place.name}
      on={place.name}
      onClick={(newChecked: boolean) => {
        setSlotFilter("place", (placeFilter) =>
          setPlaceFilter(newChecked)(place.id)(placeFilter)
        );
        clearHighlight();
      }}
      onMouseOver={() => {
        highlightPath(place.path);
      }}
      onMouseOut={() => {
        clearHighlight();
      }}
      pathId={place.id}
    />
  );
};
