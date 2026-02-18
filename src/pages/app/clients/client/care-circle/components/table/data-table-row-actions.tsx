import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Row, Table } from "@tanstack/react-table";
import { Edit, InfoCircle, Trash } from "iconsax-react";
import { ClientContact } from "@/types/client/contact";

interface DataTableRowActionsProps {
  row: Row<ClientContact>;
  table: Table<ClientContact>;
}

export function DataTableRowActions({ row, table }: DataTableRowActionsProps) {
  const { openForEdit, openDeleteDialog } = table.options.meta as {
    openForEdit: (contactId: string) => void;
    openDeleteDialog: (
      contactId: string,
      contactName?: string | undefined
    ) => void;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={4}>
        <DropdownMenuItem className="text-sm">
          <InfoCircle size={15} className="" />
          Send Invite
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => openForEdit(row.original.id)}
          className="text-sm"
        >
          <Edit size={15} />
          Edit Member
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() =>
            openDeleteDialog(row.original.clientId, row.original.contactName)
          }
          className="text-red-500 text-sm"
        >
          <Trash size={15} className=" text-red-500" />
          Delete Member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
