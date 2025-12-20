// src/components/clients/clients-columns.tsx
import { ColumnDef } from "@tanstack/react-table";

import { LongText } from "@/components/shared/long-text";

import { DataTableColumnHeader } from "@/pages/app/users/components/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { ClientContact } from "@/types/client/contact";

export const clientContactColumns: ColumnDef<ClientContact>[] = [
  // ✅ Name with avatar (no checkbox column)
  {
    accessorKey: "contactName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medication Name" />
    ),
    cell: ({ row }) => {
      const c = row.original;

      return (
        <div>
          <LongText className="max-w-36 font-medium">{c.contactName}</LongText>
          <span className="w-fit text-nowrap text-sm text-muted-foreground">
            {c.relationshipToClient}
          </span>
        </div>
      );
    },

    enableHiding: false,
  },
  {
    accessorKey: "isEmergencyContact",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Emergency Contact" />
    ),
    cell: ({ row }) => {
      const c = row.original;

      return <span>{c.isEmergencyContact ? "Yes" : "No"}</span>;
    },

    enableHiding: false,
  },

  {
    accessorKey: "contactPhone",
    id: "contactPhone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
  },
  {
    accessorKey: "contactEmail",
    id: "contactEmail",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },

  {
    accessorKey: "hasAppAccess",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Family App Access" />
    ),
    cell: ({ row }) => {
      const c = row.original;

      return <span>{c.hasAppAccess ? "Yes" : "No"}</span>;
    },

    enableHiding: false,
  },

  {
    id: "actions",
    // render row actions component (it receives the row internally)
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
  },
];
