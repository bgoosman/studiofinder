import { IconPlus, IconX } from "@tabler/icons-react";
import ToggleButton, { ToggleButtonProps } from "./ToggleButton";

export default function (props: Omit<ToggleButtonProps, "off" | "on">) {
  return (
    <ToggleButton {...props} off={<IconPlus size={16} />} on={<IconX size={16} />} />
  );
}
