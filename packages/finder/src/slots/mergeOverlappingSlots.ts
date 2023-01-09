import { Slot } from "../types/Slot";

export const mergeOverlappingSlots = (slots: Array<Slot>) => {
  const result: Slot[] = [];
  let i = 0;
  while (i < slots.length) {
    const mergedSlot = { ...slots[i] };

    let j = i + 1;
    while (j < slots.length) {
      const mergedEnd = new Date(mergedSlot.end);
      const nextStart = new Date(slots[j].start);
      const nextEnd = new Date(slots[j].end);

      if (nextStart > mergedEnd) {
        break;
      }

      if (nextEnd >= mergedEnd) {
        mergedSlot.end = slots[j].end;
      }

      j++;
    }
    i = j - 1;

    result.push(mergedSlot);

    i++;
  }
  return result;
};
