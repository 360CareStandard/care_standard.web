// src/components/finance/overview-table/column.tsx

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Payment } from "@/types/finance/payments";
import dayjs from "dayjs";

const statusStyles: Record<Payment["status"], string> = {
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

export const paymentColumns = (
  openDetailSheet: (paymentId: string) => void,
): ColumnDef<Payment>[] => [
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
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice" />
    ),
    cell: ({ row }) => {
      const invoice = row.original;

      return (
        <button
          type="button"
          onClick={() => openDetailSheet(invoice.invoiceId)}
          className="font-medium hover:underline underline underline-offset-2"
        >
          {invoice.invoiceNumber}
        </button>
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
      const payment = row.original;

      return (
        <div className="font-medium whitespace-nowrap">
          {formatCurrency(payment.amount, payment.currency)}
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
    accessorKey: "datePaid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Paid" />
    ),
    cell: ({ row }) => {
      return (
        <div className="whitespace-nowrap text-sm text-muted-foreground">
          {dayjs(row.original.datePaid).format("DD MMM YYYY")}
        </div>
      );
    },
  },

  {
    accessorKey: "method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Method" />
    ),
    cell: ({ row }) => {
      const payment = row.original;

      return <div className="whitespace-nowrap">{payment.method}</div>;
    },
  },
];
