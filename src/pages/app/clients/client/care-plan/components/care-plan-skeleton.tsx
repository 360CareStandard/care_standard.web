import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CarePlanCardSkeleton() {
  return (
    <Card className="w-[933px]">
      <CardContent className="space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-40" /> {/* Assessment label */}
              <Skeleton className="h-5 w-16 rounded-full" />{" "}
              {/* Status badge */}
            </div>
            <Skeleton className="h-3 w-48" /> {/* Updated date */}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-8 w-8 rounded-md" /> {/* Menu button */}
          </div>
        </div>
        <Skeleton className="h-px w-full" /> {/* Divider */}
        {/* 2-column info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-xs">
          {/* Left column */}
          <div className="space-y-4">
            <InfoRowSkeleton />
            <InfoRowSkeleton />
            <InfoRowSkeleton />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <InfoRowSkeleton />
            <InfoRowSkeleton />
          </div>

          {/* Risks section */}
          <div className="space-y-3">
            <Skeleton className="h-3 w-40" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-3 w-80" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRowSkeleton() {
  return (
    <div className="space-y-1">
      <Skeleton className="h-3 w-24" /> {/* Label */}
      <Skeleton className="h-4 w-full max-w-sm" /> {/* Value */}
    </div>
  );
}
