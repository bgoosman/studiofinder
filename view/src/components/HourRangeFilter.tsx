import { setMaxHour, setMinHour } from "../state/filters/hourFilter";
import { setSlotFilter, useSlotFilter } from "../state/slotFilters";

export type HourRangeFilterProps = {};
export const HourRangeFilter = () => {
  const { min, max } = useSlotFilter("hour");

  return (
    <>
      <input
        type="select"
        min="0"
        max="23"
        value={min}
        className="range"
        step="1"
        onChange={(e) => setSlotFilter("hour", setMinHour(parseInt(e.target.value)))}
      />
      <div className="w-full flex justify-between text-xs px-2 mb-4">
        {Array.from({ length: 23 }, (_, i) => (
          <span key={i}>|</span>
        ))}
      </div>
      <input
        type="range"
        min="0"
        max="24"
        value={max}
        className="range"
        step="1"
        onChange={(e) => setSlotFilter("hour", setMaxHour(parseInt(e.target.value)))}
      />
      <div className="w-full flex justify-between text-xs px-2">
        {Array.from({ length: 23 }, (_, i) => (
          <span key={i}>|</span>
        ))}
      </div>
    </>
  );
};
