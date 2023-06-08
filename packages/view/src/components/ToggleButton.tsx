import classNames from "classnames";

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
    <button
      aria-label={ariaLabel}
      className={classNames(
        "btn btn-sm flex-nowrap",
        "p-2",
        {
          "btn-outline": !checked,
          "btn-primary": checked,
        },
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
        "normal-case",
        className
      )}
      onClick={() => {
        onClick(!checked);
      }}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      data-pathId={pathId}
    >
      {!checked && off}
      {checked && on}
    </button>
  );
}
