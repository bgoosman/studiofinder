import { Badge, Button, Popover } from "@mantine/core";
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
}) => <Badge>{CompositeRentalType.toString(compositeType)}</Badge>;

const Rate = ({ rate }: { rate: RentalRate | DiscountedRentalRate }) => {
  const { types } = rate;
  return (
    <div className="mb-4">
      {rate.rate}
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
    </div>
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
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Badge
          variant="outline"
          radius="xl"
          size="sm"
          style={{
            cursor: "pointer",
          }}
        >
          {rates && rates.length > 0 ? ` \$${rates[0]?.rate}/hr` : ``}
        </Badge>
      </Popover.Target>
      <Popover.Dropdown>
        {rates.map((r, i) => (
          <Rate key={i} rate={r} />
        ))}
      </Popover.Dropdown>
    </Popover>
  );
}
