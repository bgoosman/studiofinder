import classNames from "classnames";
import { DateTime } from "luxon";
import { useCreatedAt } from "../state/places";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export type LastUpdatedNoticeProps = {
  className?: string;
};

export const LastUpdatedNotice = ({ className }: LastUpdatedNoticeProps) => {
  const createdAt = useCreatedAt();
  return (
    <div className={classNames("alert alert-info shadow-lg mb-4", className)}>
      <div>
        <InformationCircleIcon className="h-7 w-7 mr-2 inline-block" />
        <p>
          {createdAt &&
            `Updated ${DateTime.fromISO(createdAt).toLocaleString({
              month: "long",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}`}
        </p>
      </div>
    </div>
  );
};
