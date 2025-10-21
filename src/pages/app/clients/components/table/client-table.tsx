// src/components/clients/clients-table-wrapper.tsx
import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
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
import { useClients } from "@/hooks/useClients";
import { clientsColumns } from "./column";
import {
  ClientNormalized,
  normalizeClientsResponse,
} from "../data/normalize-clients";
import AddClient from "../../add-client";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

interface ClientsTableProps {
  // optional initial page/limit
  initialPage?: number;
  initialLimit?: number;
  columns?: ColumnDef<ClientNormalized>[];
}

export function ClientsTable({
  initialPage = 1,
  initialLimit = 10,
  columns = clientsColumns,
}: ClientsTableProps) {
  // ---- local pagination state (table uses 0-based pageIndex) ----
  const [pageIndex, setPageIndex] = useState<number>(initialPage - 1);
  const [pageSize, setPageSize] = useState<number>(initialLimit);

  // other table state
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [open, setOpen] = useState(false);

  // fetch data from server using 1-based page param
  const {
    data: raw,
    // isLoading,
    // isFetching,
    // isError,
    // error,
  } = useClients({
    page: pageIndex + 1,
    limit: pageSize,
  });

  // Normalize server response into rows + pagination info
  const normalized = useMemo(
    () => (raw ? normalizeClientsResponse(raw) : null),
    [raw]
  );

  const rows: ClientNormalized[] = normalized?.clients ?? [];
  const totalPages = normalized?.totalPages ?? 1; // server-provided total pages
  //   const resultCount = normalized?.result ?? 0;
  //   const currentServerPage = normalized?.currentPage ?? pageIndex + 1;

  // keep pagination state in sync if server returns different page (e.g. after refresh)
  useEffect(() => {
    // server might return currentPage as number/string, normalized ensures number
    if (normalized) {
      const serverPageIndex = Math.max(0, normalized.currentPage - 1);
      if (serverPageIndex !== pageIndex) {
        setPageIndex(serverPageIndex);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalized?.currentPage]);

  // ---- create the table with manual (server-side) pagination enabled ----
  const table = useReactTable({
    data: rows,
    columns: columns as ColumnDef<ClientNormalized>[],
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      } as PaginationState,
    },
    manualPagination: true, // tell TanStack we are doing server-side pagination
    pageCount: totalPages, // important: inform table how many pages total
    onPaginationChange: (updater) => {
      // updater can be a function or object
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      if (newState) {
        if (
          typeof newState.pageIndex === "number" &&
          newState.pageIndex !== pageIndex
        ) {
          setPageIndex(newState.pageIndex);
        }
        if (
          typeof newState.pageSize === "number" &&
          newState.pageSize !== pageSize
        ) {
          setPageSize(newState.pageSize);
        }
      }
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // still useful for table helpers
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div>
        <Table>
          {table.getRowModel().rows?.length ? (
            <TableHeader className="bg-neutral-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="group/row">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={
                          header.column.columnDef.meta?.className ?? ""
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
          ) : null}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group/row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className ?? ""}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="p-0 mx-auto !h-[55vh]"
                >
                  <div className="flex flex-col items-center justify-center gap-3 ">
                    <img
                      src="/EmptyState.svg"
                      alt="empty"
                      className="mx-auto h-28 !w-[250px] opacity-90"
                    />
                    <p className="font-semibold text-muted-foreground">
                      No results.
                    </p>
                    <p className="text-sm text-muted-foreground ">
                      It looks like there are no clients here yet. Start by
                      adding a new client to get started.
                    </p>
                    <Button onClick={() => setOpen(true)} className="gap-2">
                      <PlusIcon />
                      Add New Client
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* pagination: DataTablePagination will call table.setPageIndex / table.nextPage etc */}
      {/* <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {isLoading
            ? "Loading clients…"
            : `${resultCount} results — page ${currentServerPage} of ${totalPages}`}
          {isFetching && !isLoading ? " — updating…" : ""}
        </div>
      </div> */}

      <DataTablePagination table={table} />

      <AddClient open={open} setOpen={setOpen} />
    </div>
  );
}

export default ClientsTable;
