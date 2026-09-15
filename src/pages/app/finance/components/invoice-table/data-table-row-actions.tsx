import { useState } from "react";
// import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";

// interface DataTableRowActionsProps {
//   row: Row<Client>;
// }

export function DataTableRowActions() {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button" // ✅ avoid implicit submit
          variant="outline"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()} // ✅ don't bubble to row
          onPointerDown={(e) => e.stopPropagation()} // ✅ helps on mobile
        >
          <EllipsisVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="w-[160px] z-[60]" // optional: ensure on top
        onClick={(e) => e.stopPropagation()} // keep clicks local
      >
        <DropdownMenuItem
        // onClick={() => navigate(`/app/staff/${row.original.id}`)}
        // onSelect={() => { /* set row + open edit dialog */ }}
        >
          Edit
          <DropdownMenuShortcut>
            <Pencil size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          // onSelect={() => { /* set row + open delete dialog */ }}
          className="!text-red-500" // ✅ correct important class
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
