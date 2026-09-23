// src/components/agencies/agencies-table-wrapper.tsx

import { useEffect, useState } from "react";
import {
  ColumnDef,
  RowData,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DataTableSkeleton } from "@/components/shared/data-table-skeleton";

import { agencyColumns } from "./column";
import { AgencyNew } from "@/types/agency";
import { useAgenciesList } from "@/hooks/agency";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}
interface AgencyTableProps {
  initialPage?: number;
  initialLimit?: number;
  columns?: ColumnDef<AgencyNew>[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AgencyTable({
  initialPage = 1,
  initialLimit = 10,
  columns = agencyColumns,
  setOpen,
}: AgencyTableProps) {
  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const [pageIndex, setPageIndex] = useState(initialPage - 1);
  const [pageSize, setPageSize] = useState(initialLimit);

  // --------------------------------------------------
  // Table state
  // --------------------------------------------------

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [sorting, setSorting] = useState<SortingState>([]);

  const [search, setSearch] = useState("");

  // --------------------------------------------------
  // Debounced search
  // --------------------------------------------------

  function useDebouncedValue<T>(value: T, delay = 500) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setDebounced(value);
      }, delay);

      return () => clearTimeout(timeoutId);
    }, [value, delay]);

    return debounced;
  }

  const debouncedSearch = useDebouncedValue(search);

  // --------------------------------------------------
  // Fetch agencies
  // --------------------------------------------------

  const {
    data: agencyData,
    isLoading,
    isError,
    refetch,
  } = useAgenciesList({
    page: pageIndex + 1,
    limit: pageSize,
    q: debouncedSearch,
  });

  const rows: AgencyNew[] = agencyData?.agencies ?? [];

  const totalPages = agencyData?.totalPages ?? 1;

  // --------------------------------------------------
  // Reset pagination when search changes
  // --------------------------------------------------

  useEffect(() => {
    setPageIndex(0);
  }, [search]);

  // --------------------------------------------------
  // Sync pagination with server
  // --------------------------------------------------

  useEffect(() => {
    if (!agencyData) return;

    const serverPageIndex = Math.max(0, Number(agencyData.currentPage) - 1);

    if (serverPageIndex !== pageIndex) {
      setPageIndex(serverPageIndex);
    }
  }, [agencyData?.currentPage]);

  // --------------------------------------------------
  // React Table
  // --------------------------------------------------

  const table = useReactTable({
    data: rows,
    columns,

    state: {
      sorting,
      columnVisibility,
      rowSelection,

      pagination: {
        pageIndex,
        pageSize,
      },
    },

    manualPagination: true,
    pageCount: totalPages,

    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({
              pageIndex,
              pageSize,
            })
          : updater;

      if (!next) return;

      if (typeof next.pageIndex === "number" && next.pageIndex !== pageIndex) {
        setPageIndex(next.pageIndex);
      }

      if (typeof next.pageSize === "number" && next.pageSize !== pageSize) {
        setPageSize(next.pageSize);
      }
    },

    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    getCoreRowModel: getCoreRowModel(),
  });

  // --------------------------------------------------
  // Initial loading
  // --------------------------------------------------

  const isInitialLoad = isLoading && !agencyData;

  if (isInitialLoad) {
    return (
      <DataTableSkeleton
        columnCount={columns.length}
        rowCount={8}
        searchableColumnCount={1}
        filterableColumnCount={1}
        showViewOptions
      />
    );
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="space-y-4">
      {/* Error state */}
      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-red-800">
                Failed to load agencies
              </p>

              <p className="text-sm text-red-700">
                An unexpected error occurred while fetching agency records.
              </p>
            </div>

            <Button variant="ghost" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <DataTableToolbar
        table={table}
        search={search}
        onSearchChange={setSearch}
      />

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          {table.getRowModel().rows?.length ? (
            <TableHeader className="bg-neutral-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="group/row">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={header.column.columnDef.meta?.className ?? ""}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          ) : null}

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className="group/row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className ?? ""}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-[55vh] p-0">
                  <div className="flex h-full flex-col items-center justify-center gap-3">
                    <img
                      src="/EmptyState.svg"
                      alt="No agencies"
                      className="mx-auto h-28 w-[250px] opacity-90"
                    />

                    <p className="font-semibold text-muted-foreground">
                      No agencies found
                    </p>

                    <p className="max-w-md text-center text-sm text-muted-foreground">
                      There are currently no agencies matching your search or
                      filter criteria.
                    </p>

                    {search && (
                      <Button variant="outline" onClick={() => setSearch("")}>
                        Clear Search
                      </Button>
                    )}

                    {!search && (
                      <Button onClick={() => setOpen(true)} className="gap-2">
                        <PlusIcon className="h-4 w-4" />
                        Add New Agency
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} />
    </div>
  );
}

export default AgencyTable;
