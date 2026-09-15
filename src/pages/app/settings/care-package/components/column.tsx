import { ColumnDef } from "@tanstack/react-table";
import { LongText } from "@/components/shared/long-text";
import { CarePackage } from "@/types/care-package";
import { DataTableColumnHeader } from "@/pages/app/staff/components/table/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const carePackagecolumns: ColumnDef<CarePackage>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Package Name" />
    ),
    cell: ({ row }) => {
      const packageName = row.original.name;

      return <span>{packageName}</span>;
    },

    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const packageDesc = row.original.description;

      return (
        <div>
          <LongText className="max-w-80 ">{packageDesc}</LongText>
        </div>
      );
    },

    enableHiding: false,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const packageAmount = row.original.amount;

      return <span>£{packageAmount.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "rate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rate" />
    ),
    cell: ({ row }) => {
      const packageRate = row.original.rate;

      return <span>{packageRate}</span>;
    },
  },

  {
    id: "actions",
    // render row actions component (it receives the row internally)
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
