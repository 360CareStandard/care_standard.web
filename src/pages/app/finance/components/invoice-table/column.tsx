// src/components/finance/overview-table/column.tsx

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Invoice } from "@/types/finance/invoice";

const statusStyles: Record<Invoice["status"], string> = {
  draft: "bg-gray-100 text-gray-700 border-gray-200",
  sent: "bg-blue-100 text-blue-700 border-blue-200",
  paid: "bg-green-100 text-green-700 border-green-200",
  overdue: "bg-red-100 text-red-700 border-red-200",
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(amount);
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export const invoiceColumns = (
  openDetailSheet: (invoiceId: string) => void,
): ColumnDef<Invoice>[] => [
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice" />
    ),
    cell: ({ row }) => {
      const invoice = row.original;

      return (
        <button
          type="button"
          onClick={() => openDetailSheet(invoice.id)}
          className="font-medium hover:underline underline underline-offset-2"
        >
          {invoice.invoiceNumber}
        </button>
      );
    },
    enableHiding: false,
  },

  {
    id: "client",
    accessorKey: "client.firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => {
      const client = row.original.client;

      const fullName = `${client.firstname} ${client.lastname}`.trim();

      return <div className="w-fit text-nowrap">{fullName || "—"}</div>;
    },
  },

  {
    id: "period",
    header: "Billing Period",
    cell: ({ row }) => {
      const invoice = row.original;

      return (
        <div className="whitespace-nowrap text-sm">
          {formatDate(invoice.periodStart)} – {formatDate(invoice.periodEnd)}
        </div>
      );
    },
    enableSorting: false,
  },

  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const invoice = row.original;

      return (
        <div className="font-medium whitespace-nowrap">
          {formatCurrency(invoice.totalAmount, invoice.currency)}
        </div>
      );
    },
  },

  {
    accessorKey: "amountPaid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid" />
    ),
    cell: ({ row }) => {
      const invoice = row.original;

      return (
        <div className="whitespace-nowrap">
          {formatCurrency(invoice.amountPaid, invoice.currency)}
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

  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const invoice = row.original;

      return (
        <div className="whitespace-nowrap">{formatDate(invoice.dueDate)}</div>
      );
    },
  },
];
