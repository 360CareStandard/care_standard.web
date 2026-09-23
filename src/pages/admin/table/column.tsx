import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTableColumnHeader } from "./data-table-column-header";
import { LongText } from "@/components/shared/long-text";
import { Link } from "react-router-dom";
import { AgencyNew } from "@/types/agency";
import { DataTableRowActions } from "./data-table-row-actions";

export const agencyColumns: ColumnDef<AgencyNew>[] = [
  // Agency
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Agency" />
    ),
    cell: ({ row }) => {
      const agency = row.original;

      const initials = agency.name
        ?.split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

      return (
        <Link
          to={`/app/agencies/${agency.id}`}
          className="flex min-w-[220px] items-center gap-3"
        >
          <Avatar className="h-10 w-10 shrink-0">
            {agency.logo ? (
              <AvatarImage
                src={agency.logo}
                alt={`${agency.name} logo`}
                className="object-cover"
              />
            ) : null}

            <AvatarFallback className="font-semibold">
              {initials || "AG"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <LongText className="max-w-[180px] font-medium">
              {agency.name}
            </LongText>

            <span className="block max-w-[180px] truncate text-xs text-muted-foreground">
              {agency.legalName || "—"}
            </span>
          </div>
        </Link>
      );
    },
    enableHiding: false,
  },

  // Owner
  {
    id: "owner",
    accessorFn: (row) => row.owner?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner" />
    ),
    cell: ({ row }) => {
      const owner = row.original.owner;

      if (!owner) {
        return <span className="text-muted-foreground">—</span>;
      }

      const initials =
        `${owner.firstname?.[0] ?? ""}${owner.lastname?.[0] ?? ""}`.toUpperCase();

      return (
        <div className="flex min-w-[190px] items-center gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback>{initials || "—"}</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate font-medium">{owner.name}</p>

            <p className="max-w-[170px] truncate text-xs text-muted-foreground">
              {owner.email}
            </p>
          </div>
        </div>
      );
    },
  },

  // Status
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      const isActive = status?.toLowerCase() === "active";

      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize",
            isActive
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-muted bg-muted text-muted-foreground",
          )}
        >
          {status || "Unknown"}
        </Badge>
      );
    },
    filterFn: (row, id, value: string[]) =>
      value.includes(String(row.getValue(id))),
  },

  // Country
  {
    accessorKey: "country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.original.country || "—"}</div>
    ),
  },

  // Team
  {
    id: "members",
    accessorFn: (row) => row.counts?.members ?? 0,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Members" />
    ),
    cell: ({ row }) => {
      const count = row.original.counts?.members ?? 0;

      return <div className="font-medium">{count.toLocaleString()}</div>;
    },
  },

  // Staff
  {
    id: "staff",
    accessorFn: (row) => row.counts?.staff ?? 0,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Staff" />
    ),
    cell: ({ row }) => {
      const count = row.original.counts?.staff ?? 0;

      return <div className="font-medium">{count.toLocaleString()}</div>;
    },
  },

  // Clients
  {
    id: "clients",
    accessorFn: (row) => row.counts?.clients ?? 0,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Clients" />
    ),
    cell: ({ row }) => {
      const count = row.original.counts?.clients ?? 0;

      return <div className="font-medium">{count.toLocaleString()}</div>;
    },
  },

  // Created
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt;

      if (!date) {
        return <span className="text-muted-foreground">—</span>;
      }

      return (
        <div className="whitespace-nowrap text-sm">
          {new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(date))}
        </div>
      );
    },
  },
  {
    id: "actions",
    // render row actions component (it receives the row internally)
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
