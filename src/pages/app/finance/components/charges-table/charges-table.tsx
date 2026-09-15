import { useEffect, useState } from "react";
import {
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
// import { DataTableToolbar } from "./data-table-toolbar";
import { Button } from "@/components/ui/button";
import { DataTableSkeleton } from "@/components/shared/data-table-skeleton";

import { chargesColumns } from "./column";
import { useChargesList } from "@/hooks/finance/useFinance";
import { Charge } from "@/types/finance/charges";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

interface ChargesTableProps {
  initialPage?: number;
  initialLimit?: number;
  client?: string;
  status?: string;
  rateType?: string;
}
export function ChargesTable({
  initialPage = 1,
  initialLimit = 10,
  status,
}: ChargesTableProps) {
  const [pageIndex, setPageIndex] = useState(initialPage - 1);
  const [pageSize, setPageSize] = useState(initialLimit);

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = chargesColumns();

  const {
    data: chargesData,
    isLoading,
    isError,
    refetch,
  } = useChargesList({
    page: pageIndex + 1,
    limit: pageSize,
    q: status,
  });

  //   const {
  //   data: chargesData,
  //   isLoading,
  //   isError,
  //   refetch,
  // } = useChargesList({
  //   page: pageIndex + 1,
  //   limit: pageSize,
  //   q: debouncedSearch,
  //   clientId: client === "all" ? undefined : client,
  //   status: status === "all" ? undefined : status,
  //   rateType: rateType === "all" ? undefined : rateType,
  // });

  const rows: Charge[] = chargesData?.charges ?? [];
  const totalPages = chargesData?.totalPages ?? 1;

  useEffect(() => {
    if (chargesData) {
      const serverPageIndex = Math.max(0, chargesData.currentPage - 1);

      if (serverPageIndex !== pageIndex) {
        setPageIndex(serverPageIndex);
      }
    }
  }, [chargesData?.currentPage, pageIndex]);

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
          ? updater({ pageIndex, pageSize })
          : updater;

      if (typeof next.pageIndex === "number") {
        setPageIndex(next.pageIndex);
      }

      if (typeof next.pageSize === "number") {
        setPageSize(next.pageSize);
      }
    },

    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    getCoreRowModel: getCoreRowModel(),
  });

  const isInitialLoad = isLoading && !chargesData;

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

  return (
    <div className="space-y-4">
      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-red-800">Failed to load charges</p>

              <p className="text-sm text-red-700">
                An unexpected error occurred while fetching charges.
              </p>
            </div>

            <Button variant="ghost" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* <DataTableToolbar
        table={table}
        search={search}
        onSearchChange={setSearch}
      /> */}

      <div>
        <Table>
          {table.getRowModel().rows.length > 0 && (
            <TableHeader className="bg-neutral-50 border-b-2 border-b-black/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
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
          )}

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
                <TableCell colSpan={columns.length} className="p-0 !h-[55vh]">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <img
                      src="/EmptyState.svg"
                      alt="No charges"
                      className="mx-auto h-28 !w-[250px] opacity-90"
                    />

                    <p className="font-semibold text-muted-foreground">
                      No charges found.
                    </p>

                    <p className="text-sm text-muted-foreground">
                      There are no charges matching your search.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}

export default ChargesTable;
