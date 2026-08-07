import { ColumnDef } from "@tanstack/react-table";
// import { TransactionType } from "@/types/wallet";
// import ColumnActions from "./column-action";
import { AssignedClient } from "@/types/staff/assigned-client";
import { DataTableColumnHeader } from "../../components/table/data-table-column-header";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LongText } from "@/components/shared/long-text";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { callTypes } from "@/pages/app/clients/components/data/data";
// import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const assignedcolumns: ColumnDef<AssignedClient>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const c = row.original;
      const d = row.original;
      const username = d.id; // use id in URL / linking
      const src = row.original.imageUrl;
      const initials = (c.firstname?.[0] ?? "") + (c.lastname?.[0] ?? "");
      const fullName = `${c.firstname ?? ""} ${c.lastname ?? ""}`.trim();
      return (
        <Link
          className="flex items-center gap-3"
          to={`/app/clients/${username}`}
          target="_blank"
        >
          <Avatar className="h-10 w-10">
            {src ? (
              <AvatarImage
                src={src}
                alt={`${fullName} avatar`}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="font-semibold">
              {initials.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <LongText className="max-w-36 font-medium">{fullName}</LongText>
          </div>
        </Link>
      );
    },
    // meta: {
    //   className: cn(
    //     "sticky left-0 z-10 rounded-tl",
    //     "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted"
    //   ),
    // },
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-nowrap">Status</div>,
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
  },

  {
    accessorKey: "carePackageName",
    header: () => <div className="text-nowrap">Care Type</div>,
  },
  // {
  //     accessorKey: "bank",
  //     header: () => <div className="text-nowrap">Bank</div>,
  // },

  // {
  //     accessorKey: "country",
  //     header: () => <div className="text-nowrap">Country</div>,
  // },

  //   {
  //     header: "Actions",
  //     cell: ({ row }) =>
  //       row.original.id && (
  //         <ColumnActions id={row.original.id} row={row} />
  //       ),
  //   },
];
