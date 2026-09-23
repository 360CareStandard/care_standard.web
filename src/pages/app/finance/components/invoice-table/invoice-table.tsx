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
import { DataTableToolbar } from "./data-table-toolbar";
import { Button } from "@/components/ui/button";
import { DataTableSkeleton } from "@/components/shared/data-table-skeleton";

import { invoiceColumns } from "./column";
import { useInvoicesList } from "@/hooks/finance/useFinance";
import { Invoice } from "@/types/finance/invoice";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

interface InvoiceTableProps {
  initialPage?: number;
  initialLimit?: number;
  openDetailSheet: (invoiceId: string) => void;
}
export function InvoiceTable({
  initialPage = 1,
  initialLimit = 10,
  openDetailSheet,
}: InvoiceTableProps) {
  const [pageIndex, setPageIndex] = useState(initialPage - 1);
  const [pageSize, setPageSize] = useState(initialLimit);

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const columns = invoiceColumns(openDetailSheet);

  function useDebouncedValue<T>(value: T, delay = 500) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
      const id = setTimeout(() => setDebounced(value), delay);

      return () => clearTimeout(id);
    }, [value, delay]);

    return debounced;
  }

  const debouncedSearch = useDebouncedValue(search);

  const {
    data: invoiceData,
    isLoading,
    isError,
    refetch,
  } = useInvoicesList({
    page: pageIndex + 1,
    limit: pageSize,
    q: debouncedSearch,
  });

  const rows: Invoice[] = invoiceData?.invoices ?? [];
  const totalPages = invoiceData?.totalPages ?? 1;

  useEffect(() => {
    setPageIndex(0);
  }, [search]);

  useEffect(() => {
    if (invoiceData) {
      const serverPageIndex = Math.max(0, invoiceData.currentPage - 1);

      if (serverPageIndex !== pageIndex) {
        setPageIndex(serverPageIndex);
      }
    }
  }, [invoiceData?.currentPage, pageIndex]);

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

  const isInitialLoad = isLoading && !invoiceData;

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
              <p className="font-medium text-red-800">
                Failed to load invoices
              </p>

              <p className="text-sm text-red-700">
                An unexpected error occurred while fetching invoices.
              </p>
            </div>

            <Button variant="ghost" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </div>
      )}

      <DataTableToolbar
        table={table}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="rounded-md border">
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
                      alt="No invoices"
                      className="mx-auto h-28 !w-[250px] opacity-90"
                    />

                    <p className="font-semibold text-muted-foreground">
                      No invoices found.
                    </p>

                    <p className="text-sm text-muted-foreground">
                      There are no invoices matching your search.
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

export default InvoiceTable;
