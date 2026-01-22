// src/components/clients/data-table-toolbar.tsx
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, X } from "lucide-react";
import * as React from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

type SortKey =
  | "name-asc"
  | "name-desc"
  | "role-asc"
  | "status-asc"
  | "risk-desc";

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // pick a sensible name column from table
  const nameCol =
    table.getColumn("name") ??
    table.getColumn("preferredname") ??
    table.getColumn("username");

  const [sortVal, setSortVal] = React.useState<SortKey>("name-asc");

  const applySort = (val: SortKey) => {
    setSortVal(val);
    switch (val) {
      case "name-asc":
        nameCol && table.setSorting([{ id: nameCol.id, desc: false }]);
        break;
      case "name-desc":
        nameCol && table.setSorting([{ id: nameCol.id, desc: true }]);
        break;
      case "role-asc":
        table.getColumn("role") &&
          table.setSorting([{ id: "role", desc: false }]);
        break;
      case "status-asc":
        table.getColumn("status") &&
          table.setSorting([{ id: "status", desc: false }]);
        break;
      case "risk-desc":
        table.getColumn("riskLevel") &&
          table.setSorting([{ id: "riskLevel", desc: true }]);
        break;
    }
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex flex-1 flex-col-reverse items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
        {/* Search input */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search client..."
            value={(nameCol?.getFilterValue() as string) ?? ""}
            onChange={(e) => nameCol?.setFilterValue(e.target.value)}
            className="h-10 w-[240px] pl-9 md:w-[360px]"
          />
        </div>

        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 min-w-[150px] justify-between gap-2 px-3"
            >
              <span className="text-sm">Sort by</span>
              <ChevronDown className="h-4 w-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={sortVal}
              onValueChange={(v) => applySort(v as SortKey)}
            >
              <DropdownMenuRadioItem value="name-asc">
                Name (A–Z)
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="name-desc">
                Name (Z–A)
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="role-asc">
                Role
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="status-asc">
                Status
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="risk-desc">
                Risk (High → Low)
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status filter chip */}
        {/* <div className="flex gap-2">
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Invited", value: "invited" },
                { label: "Paused", value: "pasused" },
              ]}
            />
          )}
        </div> */}

        {/* Reset filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className=" px-2"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default DataTableToolbar;
