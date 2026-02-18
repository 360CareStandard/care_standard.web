import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Medication } from "@/types/client/medication";
import { Row, Table } from "@tanstack/react-table";
import { BackSquare, Edit, InfoCircle, Trash } from "iconsax-react";

interface DataTableRowActionsProps {
  row: Row<Medication>;
  table: Table<Medication>;
}

export function DataTableRowActions({ row, table }: DataTableRowActionsProps) {
  const { onEdit, onStop, onView, onResolve } = table.options.meta as {
    onEdit: (med: Medication) => void;
    onStop: (med: Medication) => void;
    onView: (med: Medication) => void;
    onResolve: (med: Medication) => void;
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
        <DropdownMenuItem
          onSelect={() => onView(row.original)}
          className="text-sm"
        >
          <InfoCircle size={15} className="" />
          View Full Details
        </DropdownMenuItem>
        {row.original.status === "active" && <DropdownMenuSeparator />}
        {row.original.status === "active" && (
          <DropdownMenuItem
            onSelect={() => onEdit(row.original)}
            className="text-sm"
          >
            <Edit size={15} />
            Edit Medication
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {row.original.status === "active" ? (
          <DropdownMenuItem
            onSelect={() => onStop(row.original)}
            className="text-red-500 text-sm"
          >
            <Trash size={15} className=" text-red-500" />
            Stop Medication
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onSelect={() => onResolve(row.original)}
            className=" text-sm"
          >
            <BackSquare size={15} />
            Resolve
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
