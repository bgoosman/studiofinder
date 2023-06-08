import React, { useMemo } from "react";
import { MantineReactTable, MRT_ColumnDef } from "mantine-react-table";
import { filteredSlots } from "../state/slotFilters";
import { ResolvedSlot } from "finder/src/types/Slot";

export default function () {
  const data = filteredSlots.use();

  const columns = useMemo<MRT_ColumnDef<ResolvedSlot>[]>(
    () => [
      {
        header: "placeId",
        accessorKey: "placeId",
        enableGrouping: false, //do not let this column be grouped
      },
      {
        header: "start",
        accessorKey: "start",
      },
      {
        header: "end",
        accessorKey: "end",
      },
    ],
    []
  );

  return (
    <MantineReactTable
      columns={columns}
      data={data}
      enableColumnResizing
      enableGrouping
      enableStickyHeader
      enableStickyFooter
      initialState={{
        density: "xs",
        expanded: true,
        grouping: [],
        pagination: { pageIndex: 0, pageSize: 20 },
        sorting: [{ id: "start", desc: false }],
      }}
      mantineToolbarAlertBannerChipProps={{ color: "blue", variant: "outline" }}
      mantineTableContainerProps={{ sx: { maxHeight: 700 } }}
    />
  );
}
