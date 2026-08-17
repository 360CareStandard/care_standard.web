// src/components/activity/ActivityPagination.tsx

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ActivityPaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function ActivityPagination({
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange,
  disabled,
}: ActivityPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  return (
    <div className="flex items-center justify-between border-t px-4 py-3">
      <p className="text-xs text-muted-foreground">
        Showing {start}–{end} of {total}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>

        <span className="text-xs text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={disabled || currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
