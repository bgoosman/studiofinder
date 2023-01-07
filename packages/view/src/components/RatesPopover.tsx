import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import * as Popover from "@radix-ui/react-popover";
import classNames from "classnames";
import { DiscountedRentalRate, RentalRate } from "finder/src/types/RentalRate";
import { Discount } from "finder/src/types/Discount";
import { CompositeRentalType } from "finder/src/types/RentalType";

const RateText = ({ rate }: { rate: RentalRate | Discount }) => {
  const { name, description } = rate;
  return name ? (
    <>
      <p className="font-medium">{name}</p>
      {description && <p>{description}</p>}
    </>
  ) : (
    <></>
  );
};

const CompositeRentalTypeBadge = ({
  compositeType,
}: {
  compositeType: CompositeRentalType;
}) => <span className="badge">{CompositeRentalType.toString(compositeType)}</span>;

const Rate = ({ rate }: { rate: RentalRate | DiscountedRentalRate }) => {
  const { types } = rate;
  return (
    <section className="mb-4">
      <h2 className="font-bold">${rate.rate}</h2>
      <RateText rate={DiscountedRentalRate.isDiscounted(rate) ? rate.discount : rate} />
      {types && (
        <div className="flex flex-wrap gap-1">
          {types.map((t) => (
            <CompositeRentalTypeBadge
              compositeType={t}
              key={CompositeRentalType.toString(t)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export function RatesPopover({
  className,
  rates,
}: {
  className?: string;
  rates: RentalRate[];
}) {
  return (
    <Popover.Root>
      <Popover.Trigger className={"btn btn-xs w-[80px]"}>
        <span className="mr-1">
          {rates && rates.length > 0 ? ` \$${rates[0]?.rate}` : ``}
        </span>{" "}
        <QuestionMarkCircleIcon className="h-4 w-4" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="center"
          sideOffset={5}
          className={classNames("sf-popover p-3", className)}
        >
          {rates.map((r, i) => (
            <Rate key={i} rate={r} />
          ))}
          <Popover.Close className="absolute top-5 right-8">
            <XMarkIcon className="h-5 w-5"></XMarkIcon>
          </Popover.Close>
          <Popover.Arrow className="" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
