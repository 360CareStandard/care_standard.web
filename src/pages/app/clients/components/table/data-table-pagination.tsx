// src/components/clients/data-table-pagination.tsx
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

// helper to make a range of numbers
const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => i + start);

// build page numbers with ellipses
function getPageNumbers(current: number, total: number, siblingCount = 1) {
  const totalNumbers = siblingCount * 2 + 5; // first, last, current + 2 dots
  if (total <= totalNumbers) return range(1, total);

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, total);
  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < total - 1;

  if (!showLeftDots && showRightDots) {
    const leftCount = 3 + 2 * siblingCount;
    return [...range(1, leftCount), "…", total];
  }
  if (showLeftDots && !showRightDots) {
    const rightCount = 3 + 2 * siblingCount;
    return [1, "…", ...range(total - rightCount + 1, total)];
  }
  return [1, "…", ...range(leftSibling, rightSibling), "…", total];
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  // table.getState().pagination.pageIndex is 0-based
  const pageIndex = table.getState().pagination.pageIndex ?? 0;
  const currentPage = pageIndex + 1;
  const pageCount = Math.max(1, table.getPageCount()); // guard to at least 1
  const pages = getPageNumbers(currentPage, pageCount, 1);

  return (
    <div
      className="flex items-center justify-between overflow-clip px-2"
      style={{ overflowClipMargin: 1 }}
    >
      <div className="flex items-center justify-center text-sm font-medium">
        Page {currentPage} of {pageCount}
      </div>

      <div className="flex items-center gap-1">
        {/* page numbers (with ellipses) */}
        {pages.map((p, i) =>
          typeof p === "string" ? (
            <span
              key={`dots-${i}`}
              className="px-2 text-sm text-muted-foreground"
            >
              {p}
            </span>
          ) : (
            <Button
              key={p}
              variant={currentPage === p ? "default" : "outline"}
              className={`h-8 min-w-8 px-2 ${
                currentPage === p
                  ? "bg-primary-accent text-primary hover:bg-primary-accent"
                  : "bg-transparent"
              }`}
              onClick={() => table.setPageIndex(p - 1)} // convert to 0-based
            >
              <span className="sr-only">Go to page {p}</span>
              {p}
            </Button>
          )
        )}
      </div>

      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 px-2 gap-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.91076 10.5889C1.58533 10.2635 1.58533 9.73586 1.91076 9.41042L5.2441 6.07709C5.56954 5.75165 6.09717 5.75165 6.42261 6.07709C6.74805 6.40252 6.74805 6.93016 6.42261 7.2556L4.51186 9.16634L17.5 9.16634C17.9603 9.16634 18.3334 9.53944 18.3334 9.99968C18.3334 10.4599 17.9603 10.833 17.5 10.833L4.51186 10.833L6.42261 12.7438C6.74805 13.0692 6.74805 13.5968 6.42261 13.9223C6.09717 14.2477 5.56954 14.2477 5.2441 13.9223L1.91076 10.5889Z"
                fill="#344054"
              />
            </svg>
            Previous
          </Button>

          <Button
            variant="outline"
            className="h-8 px-2 gap-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.0893 10.5889C18.4147 10.2635 18.4147 9.73586 18.0893 9.41042L14.7559 6.07709C14.4305 5.75165 13.9029 5.75165 13.5774 6.07709C13.252 6.40252 13.252 6.93016 13.5774 7.2556L15.4882 9.16634L2.50002 9.16634C2.03978 9.16634 1.66669 9.53944 1.66669 9.99968C1.66669 10.4599 2.03978 10.833 2.50002 10.833L15.4882 10.833L13.5774 12.7438C13.252 13.0692 13.252 13.5968 13.5774 13.9223C13.9029 14.2477 14.4305 14.2477 14.7559 13.9223L18.0893 10.5889Z"
                fill="#344054"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DataTablePagination;
