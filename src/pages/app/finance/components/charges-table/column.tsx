import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Charge } from "@/types/finance/charges";

const statusStyles: Record<Charge["status"], string> = {
  unbilled: "bg-amber-50 text-amber-700 border-amber-200",
  billed: "bg-slate-50 text-slate-700 border-slate-200",
};

export const chargesColumns = (): ColumnDef<Charge>[] => [
  {
    accessorKey: "client",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium whitespace-nowrap">
          {row.original.client}
        </div>
      );
    },
  },

  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="whitespace-nowrap text-sm text-muted-foreground">
          {row.original.date}
        </div>
      );
    },
  },

  {
    accessorKey: "duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ row }) => {
      return <div className="whitespace-nowrap">{row.original.duration}</div>;
    },
  },

  {
    accessorKey: "rate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rate" />
    ),
    cell: ({ row }) => {
      const charge = row.original;

      return (
        <div className="flex flex-col">
          <span className="whitespace-nowrap">{charge.rate}</span>
          <Badge
            variant="outline"
            className={cn("capitalize text-xs text-secondary")}
          >
            {charge.rateName}
          </Badge>
        </div>
      );
    },
  },

  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium whitespace-nowrap">
          {row.original.amount}
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge
          variant="outline"
          className={cn("capitalize", statusStyles[status])}
        >
          {status}
        </Badge>
      );
    },
  },
];
