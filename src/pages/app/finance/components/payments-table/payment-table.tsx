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
import { Button } from "@/components/ui/button";
import { DataTableSkeleton } from "@/components/shared/data-table-skeleton";

import { paymentColumns } from "./column";
import { usePaymentList } from "@/hooks/finance/useFinance";
import { Payment } from "@/types/finance/payments";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

interface PaymentTableProps {
  initialPage?: number;
  initialLimit?: number;
  openDetailSheet: (paymentId: string) => void;
  openConfirmPaymentModal: (payment: Payment) => void;
  status?: string;
}
export function PaymentTable({
  initialPage = 1,
  initialLimit = 10,
  openDetailSheet,
  openConfirmPaymentModal,
  status,
}: PaymentTableProps) {
  const [pageIndex, setPageIndex] = useState(initialPage - 1);
  const [pageSize, setPageSize] = useState(initialLimit);

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = paymentColumns(openDetailSheet, openConfirmPaymentModal);

  const {
    data: paymentsData,
    isLoading,
    isError,
    refetch,
  } = usePaymentList({
    page: pageIndex + 1,
    limit: pageSize,
    q: status === "paid" ? undefined : status,
  });

  const rows: Payment[] = paymentsData?.payments ?? [];
  const totalPages = paymentsData?.totalPages ?? 1;

  useEffect(() => {
    setPageIndex(0);
  }, [status]);

  useEffect(() => {
    if (paymentsData) {
      const serverPageIndex = Math.max(0, paymentsData.currentPage - 1);

      if (serverPageIndex !== pageIndex) {
        setPageIndex(serverPageIndex);
      }
    }
  }, [paymentsData?.currentPage, pageIndex]);

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

  const isInitialLoad = isLoading && !paymentsData;

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
                Failed to load payments
              </p>

              <p className="text-sm text-red-700">
                An unexpected error occurred while fetching payments.
              </p>
            </div>

            <Button variant="ghost" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </div>
      )}
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
                      alt="No payments"
                      className="mx-auto h-28 !w-[250px] opacity-90"
                    />

                    <p className="font-semibold text-muted-foreground">
                      No payments found.
                    </p>

                    <p className="text-sm text-muted-foreground">
                      There are no payments matching your search.
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

export default PaymentTable;
