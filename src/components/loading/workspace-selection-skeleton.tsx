// src/components/skeletons/workspace-selection-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Props = {
  /** Number of list rows to show while loading */
  rows?: number;
  /** Optional className for outer wrapper */
  className?: string;
};

export function WorkspaceSelectionSkeleton({ rows = 6, className }: Props) {
  return (
    <div
      role="status"
      aria-label="Loading workspaces"
      className={cn("space-y-6", className)}
    >
      {/* Header */}
      <div>
        <div className="h-6 w-56">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="mt-2 h-4 w-44">
          <Skeleton className="h-full w-full" />
        </div>
      </div>

      {/* Search + Filter row */}
      <div className="mb-4 flex items-center gap-2">
        {/* search input */}
        <Skeleton className="h-10 w-full" />
        {/* filter button */}
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Section label */}
      <div className="h-4 w-40">
        <Skeleton className="h-full w-full" />
      </div>

      {/* List items */}
      <section className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex w-full items-center justify-between rounded-lg border bg-white px-3 py-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              {/* avatar */}
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="min-w-0 space-y-2">
                {/* name */}
                <Skeleton className="h-4 w-48" />
                {/* caption */}
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* role badge */}
              <Skeleton className="h-6 w-20 rounded-full" />
              {/* chevron box */}
              <Skeleton className="h-4 w-4 rounded" />
            </div>
          </div>
        ))}
      </section>

      {/* screen reader helper */}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
