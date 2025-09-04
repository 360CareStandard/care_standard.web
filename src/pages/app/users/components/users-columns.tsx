import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { callTypes, userTypes } from "../data/data";
import { User } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { LongText } from "@/components/shared/long-text";
import { Link } from "react-router-dom";

export const columns: ColumnDef<User>[] = [
  // ✅ Username with avatar (no checkbox column)
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => {
      const u = row.original as Partial<User> & {
        avatarUrl?: string;
        image?: string;
        avatar?: string;
        firstName?: string;
        lastName?: string;
      };
      const username = row.getValue("username") as string;
      const src = u.avatarUrl || u.image || u.avatar || "";
      const initials =
        (u.firstName?.[0] ?? username?.[0] ?? "?") +
        (u.lastName?.[0] ?? username?.[1] ?? "");
      const { firstName, lastName } = row.original;
      const fullName = `${firstName} ${lastName}`;
      return (
        <Link
          className="flex items-center gap-3"
          to={`/app/clients/${username}`}
        >
          <Avatar className="h-12 w-12">
            <AvatarImage src={src} alt={`${username} avatar`} />
            <AvatarFallback className="font-semibold">
              {initials.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <LongText className="max-w-36">{fullName}</LongText>
            <span className="w-fit text-nowrap">78 years</span>
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Badge variant="outline" className={cn("capitalize bg-neutral-100")}>
          {row.getValue("gender")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const { status } = row.original;
      const badgeColor = callTypes.get(status);
      return (
        <div className="flex space-x-2">
          <Badge variant="outline" className={cn("capitalize", badgeColor)}>
            {row.getValue("status")}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableHiding: false,
    enableSorting: false,
  },

  // {
  //   id: "fullName",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Name" />
  //   ),
  //   cell: ({ row }) => {
  //     const { firstName, lastName } = row.original;
  //     const fullName = `${firstName} ${lastName}`;
  //     return <LongText className="max-w-36">{fullName}</LongText>;
  //   },
  //   meta: { className: "w-36" },
  // },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>,
    enableSorting: false,
  },

  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const { role } = row.original;
      const userType = userTypes.find(({ value }) => value === role);
      if (!userType) return null;
      const Icon = userType.icon;
      return (
        <div className="flex items-center gap-x-2">
          {Icon && <Icon size={16} className="text-muted-foreground" />}
          <span className="text-sm capitalize">{row.getValue("role")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: DataTableRowActions,
  },
];
