import { Button } from "@mantine/core";
import { forwardRef } from "react";

export type ToggleButtonProps = {
  ariaLabel: string;
  checked: boolean;
  className?: string;
  off: React.ReactNode;
  on: React.ReactNode;
  onClick: (enabled: boolean) => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  pathId?: string;
  ref?: React.RefObject<HTMLButtonElement>;
};

export default forwardRef<HTMLButtonElement, ToggleButtonProps>((props, ref) => (
  <Button
    aria-label={props.ariaLabel}
    className={props.className}
    data-pathid={props.pathId}
    onClick={() => props.onClick(!props.checked)}
    onMouseOver={props.onMouseOver}
    onMouseOut={props.onMouseOut}
    ref={ref}
    variant={props.checked ? "filled" : "outline"}
  >
    {!props.checked && props.off}
    {props.checked && props.on}
  </Button>
));
