// src/components/clients/clients-columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { callTypes } from "../data/data"; // keep your existing color map
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { LongText } from "@/components/shared/long-text";
import { Link } from "react-router-dom";
import { ClientNormalized } from "../data/normalize-clients";
import { riskColorMap } from "@/helpers/risk-colors";

// small helper to compute age from YYYY-MM-DD string (returns undefined if no dob)
function getAge(dob?: string | null) {
  if (!dob) return undefined;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return undefined;
  const diff = Date.now() - d.getTime();
  const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  return age;
}

export const clientsColumns: ColumnDef<ClientNormalized>[] = [
  // ✅ Name with avatar (no checkbox column)
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const c = row.original;
      const username = c.id; // use id in URL / linking
      const src = "";
      const initials =
        (c.firstname?.[0] ?? c.name?.[0] ?? "?") +
        (c.lastname?.[0] ?? c.name?.split(" ")[1]?.[0] ?? "");
      const fullName = `${c.firstname ?? ""} ${c.lastname ?? ""}`.trim();
      const age = getAge(c.raw?.dob);
      return (
        <Link
          className="flex items-center gap-3"
          to={`/app/clients/${username}`}
        >
          <Avatar className="h-12 w-12">
            {src ? <AvatarImage src={src} alt={`${fullName} avatar`} /> : null}
            <AvatarFallback className="font-semibold">
              {initials.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <LongText className="max-w-36 font-medium">
              {fullName || c.name}
            </LongText>
            <span className="w-fit text-nowrap text-sm text-muted-foreground">
              {age ? `${age} years` : c.preferredname ?? "—"}
            </span>
          </div>
        </Link>
      );
    },
    meta: {
      className: cn(
        "sticky left-0 z-10 rounded-tl",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted"
      ),
    },
    enableHiding: false,
  },

  {
    accessorKey: "gender",
    id: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => {
      const gender = row.original?.gender ?? row.getValue("gender");
      return (
        <div className="flex space-x-2">
          <Badge
            variant="outline"
            className={cn("capitalize rounded-full bg-neutral-100")}
          >
            {gender ?? "—"}
          </Badge>
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
      const status = row.original.status ?? row.getValue("status");
      const badgeColor = callTypes.get(status);
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
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.getValue("email") ?? "—"}</div>
    ),
  },

  {
    accessorKey: "phone", // <- must match ClientNormalized.phone
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    enableSorting: false,
  },

  //   {
  //     accessorKey: "city",
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="City" />
  //     ),
  //     cell: ({ row }) => <div>{row.getValue("city") ?? "—"}</div>,
  //   },

  //   {
  //     accessorKey: "country",
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="Country" />
  //     ),
  //     cell: ({ row }) => <div>{row.getValue("country") ?? "—"}</div>,
  //   },

  {
    accessorKey: "riskLevel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Risk" />
    ),
    cell: ({ row }) => {
      const riskLevel = row.original.riskLevel ?? row.getValue("riskLevel");
      const riskStyle =
        riskLevel && riskColorMap[riskLevel]
          ? riskColorMap[riskLevel]
          : { bg: "bg-gray-100", text: "text-gray-600" };
      return (
        <Badge
          className={cn(
            "text-xs font-medium rounded-md px-2 py-1 capitalize",
            riskStyle.bg,
            riskStyle.text
          )}
        >
          {riskLevel ?? "—"}
        </Badge>
      );
    },
    enableSorting: false,
  },

  {
    id: "actions",
    // render row actions component (it receives the row internally)
    cell: DataTableRowActions,
  },
];
