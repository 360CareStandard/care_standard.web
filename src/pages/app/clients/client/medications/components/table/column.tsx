// src/components/clients/clients-columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { LongText } from "@/components/shared/long-text";

import { Medication } from "@/types/client/medication";
import { callTypes } from "@/pages/app/clients/components/data/data";
import { DataTableColumnHeader } from "@/pages/app/users/components/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import dayjs from "dayjs";

export const medicationColumns: ColumnDef<Medication>[] = [
  // ✅ Name with avatar (no checkbox column)
  {
    accessorKey: "medicationName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medication Name" />
    ),
    cell: ({ row }) => {
      const c = row.original;

      return (
        <div>
          <LongText className="max-w-36 font-medium">
            {c.medicationName}
          </LongText>
          <span className="w-fit text-nowrap text-sm text-muted-foreground">
            {c.dosage}
          </span>
        </div>
      );
    },

    enableHiding: false,
  },

  {
    accessorKey: "route",
    id: "route",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Route" />
    ),
  },
  {
    accessorKey: "frequency",
    id: "frequency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Frequency" />
    ),
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status ?? row.getValue("status");
      const badgeColor = callTypes.get(status);
      return (
        <div className="flex space-x-2">
          <Badge variant="outline" className={cn("capitalize", badgeColor)}>
            {status === "active" ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value: string[]) =>
      value.includes(String(row.getValue(id))),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => {
      const c = row.original;

      return (
        <div>
          <span className="w-fit text-nowrap text-sm text-muted-foreground">
            {dayjs(c.startDate).format("DD/MM/YYYY")}
          </span>
        </div>
      );
    },

    enableHiding: false,
  },

  {
    accessorKey: "prescriberName",
    id: "prescriberName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prescriber" />
    ),
  },

  {
    id: "actions",
    // render row actions component (it receives the row internally)
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
  },
];
