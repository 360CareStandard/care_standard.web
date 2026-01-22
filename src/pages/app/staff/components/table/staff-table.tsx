// src/components/clients/clients-table-wrapper.tsx
import { useEffect, useState } from "react";
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

import { DataTableSkeleton } from "@/components/shared/data-table-skeleton";
import AddStaff from "../forms/add-staff";
import { Staff } from "@/types/staff";
import { useStaff } from "@/hooks/staff/useStaff";
import { staffColumns } from "./column";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

interface StaffProps {
  initialPage?: number;
  initialLimit?: number;
  columns?: ColumnDef<Staff>[];
}

export function StaffTable({
  initialPage = 1,
  initialLimit = 10,
  columns = staffColumns,
}: StaffProps) {
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
    data: staffData,
    isLoading,
    // isFetching,
    isError,
    error,
    refetch,
  } = useStaff({
    page: pageIndex + 1,
    limit: pageSize,
  });

  const rows: Staff[] = staffData?.staffs ?? [];
  const totalPages = staffData?.pagination?.totalPages ?? 1; // server-provided total pages
  //   const resultCount = normalized?.result ?? 0;
  //   const currentServerPage = normalized?.currentPage ?? pageIndex + 1;

  // keep pagination state in sync if server returns different page (e.g. after refresh)
  useEffect(() => {
    if (staffData) {
      const serverPageIndex = Math.max(
        0,
        Number(staffData.pagination?.page) - 1
      );
      if (serverPageIndex !== pageIndex) {
        setPageIndex(serverPageIndex);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffData?.pagination?.page]);

  // ---- create the table with manual (server-side) pagination enabled ----
  const table = useReactTable({
    data: rows,
    columns: columns as ColumnDef<Staff>[],
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
    manualPagination: true,
    pageCount: totalPages,
    onPaginationChange: (updater) => {
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
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // --- Loading: show skeleton during initial load ---
  if (isLoading) {
    // pass columnCount and rowCount to match your columns
    return (
      <div className="space-y-4">
        <DataTableSkeleton
          columnCount={columns.length}
          rowCount={8}
          searchableColumnCount={1}
          filterableColumnCount={1}
          showViewOptions={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error banner (visible when API returns error) */}
      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-red-800">
                Failed to load staff records
              </p>
              <p className="text-sm text-red-700">
                {(error as any)?.message ??
                  "An unexpected error occurred while fetching staff records."}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          </div>
        </div>
      )}

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
                      It looks like there are no staff members here yet. Start
                      by adding a new staff member to get started.
                    </p>
                    <Button onClick={() => setOpen(true)} className="gap-2">
                      <PlusIcon />
                      Add New Staff
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* small updating indicator + result count */}
      {/* <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          {isFetching && !isLoading ? (
            <span>Updating…</span>
          ) : (
            <span>
              {resultCount} results — page {currentServerPage} of {totalPages}
            </span>
          )}
        </div>
      </div> */}

      <DataTablePagination table={table} />

      <AddStaff open={open} setOpen={setOpen} />
    </div>
  );
}

export default StaffTable;
