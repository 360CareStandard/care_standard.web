import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/pages/app/staff/components/table/data-table-column-header";
import { RecentInvoice } from "@/types/finance/overview";
import { Badge } from "@/components/ui/badge";
import { callTypes } from "@/pages/app/clients/components/data/data";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

export const overviewFinancecolumns: ColumnDef<RecentInvoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice ID" />
    ),
    cell: ({ row }) => {
      const invoiceNumber = row.original.invoiceNumber;

      return <span>{invoiceNumber}</span>;
    },

    enableHiding: false,
  },

  {
    accessorKey: "client",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => {
      const clientName =
        row.original.client.firstname + " " + row.original.client.lastname;

      return <span>{clientName}</span>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const totalAmount = row.original.totalAmount;

      return <span>£{totalAmount.toFixed(2)}</span>;
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original?.status ?? row.getValue("status");
      const badgeColor = callTypes.get(status as string);
      return (
        <div className="flex space-x-2">
          <Badge variant="outline" className={cn("capitalize", badgeColor)}>
            {status ?? "—"}
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
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;

      return <span>{dayjs(dueDate).format("DD, MMM YYYY")}</span>;
    },
    enableHiding: false,
    enableSorting: false,
  },

  // {
  //   id: "actions",
  //   // render row actions component (it receives the row internally)
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
