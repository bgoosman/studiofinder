import { Button } from "@mantine/core";

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
};

export default function ({
  ariaLabel,
  checked,
  className,
  off,
  on,
  onClick,
  onMouseOver,
  onMouseOut,
  pathId,
}: ToggleButtonProps) {
  return (
    <Button
      aria-label={ariaLabel}
      className={className}
      compact
      data-pathid={pathId}
      onClick={() => onClick(!checked)}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      variant={checked ? "filled" : "outline"}
    >
      {!checked && off}
      {checked && on}
    </Button>
  );
}
