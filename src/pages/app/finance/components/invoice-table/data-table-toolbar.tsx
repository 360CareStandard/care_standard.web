// src/components/finance/overview-table/data-table-toolbar.tsx

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Search, ChevronDown, X } from "lucide-react";

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

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  search: string;
  onSearchChange: (value: string) => void;
}

type SortKey =
  | "invoice-asc"
  | "invoice-desc"
  | "amount-asc"
  | "amount-desc"
  | "due-date-asc"
  | "due-date-desc"
  | "status-asc";

export function DataTableToolbar<TData>({
  table,
  search,
  onSearchChange,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [sortVal, setSortVal] = React.useState<SortKey>("invoice-asc");

  const applySort = (value: SortKey) => {
    setSortVal(value);

    switch (value) {
      case "invoice-asc":
        table.setSorting([{ id: "invoiceNumber", desc: false }]);
        break;

      case "invoice-desc":
        table.setSorting([{ id: "invoiceNumber", desc: true }]);
        break;

      case "amount-asc":
        table.setSorting([{ id: "totalAmount", desc: false }]);
        break;

      case "amount-desc":
        table.setSorting([{ id: "totalAmount", desc: true }]);
        break;

      case "due-date-asc":
        table.setSorting([{ id: "dueDate", desc: false }]);
        break;

      case "due-date-desc":
        table.setSorting([{ id: "dueDate", desc: true }]);
        break;

      case "status-asc":
        table.setSorting([{ id: "status", desc: false }]);
        break;
    }
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex flex-1 flex-col-reverse items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search invoices..."
            value={search}
            type="search"
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-10 w-[240px] pl-9 md:w-[360px]"
          />
        </div>

        {/* Sort */}
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

          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>

            <DropdownMenuRadioGroup
              value={sortVal}
              onValueChange={(value) => applySort(value as SortKey)}
            >
              <DropdownMenuRadioItem value="invoice-asc">
                Invoice (A–Z)
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="invoice-desc">
                Invoice (Z–A)
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="amount-asc">
                Amount (Low–High)
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="amount-desc">
                Amount (High–Low)
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="due-date-asc">
                Due Date (Earliest)
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="due-date-desc">
                Due Date (Latest)
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="status-asc">
                Status
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Reset */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="px-2"
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
