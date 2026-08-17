// src/components/activity/ActivitySkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";

interface ActivitySkeletonProps {
  count?: number;
}

export function ActivitySkeleton({ count = 4 }: ActivitySkeletonProps) {
  return (
    <div>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex gap-4 border-b px-4 py-5 last:border-b-0"
        >
          <Skeleton className="w-1 rounded-full" />

          <div className="flex flex-1 gap-3">
            <Skeleton className="h-7 w-7 rounded-md" />

            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-40" />

              <div className="grid grid-cols-2 gap-8">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-32" />
              </div>

              <Skeleton className="h-8 w-full max-w-xl" />

              <Skeleton className="h-3 w-32" />
            </div>

            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
