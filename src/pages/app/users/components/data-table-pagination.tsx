import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

// helper to make a range
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
  const pageIndex = table.getState().pagination.pageIndex; // 0-based
  const currentPage = pageIndex + 1;
  const pageCount = table.getPageCount();
  const pages = getPageNumbers(currentPage, pageCount, 1);

  return (
    <div
      className="flex items-center justify-between overflow-clip px-2"
      style={{ overflowClipMargin: 1 }}
    >
      <div className="flex  items-center justify-center text-sm font-medium">
        Page {currentPage} of {pageCount}
      </div>
      {/* page number buttons */}
      <div className="flex items-center gap-1">
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
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <Button
            variant="outline"
            className="h-8 px-2 gap-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
