// src/components/activity/ActivityEmptyState.tsx

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ActivityEmptyStateProps {
  onReset: () => void;
}

export function ActivityEmptyState({ onReset }: ActivityEmptyStateProps) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
      <Avatar className="mb-4 h-28 w-28 rounded-none">
        <AvatarImage src="/EmptyState.svg" alt="Empty state" />

        <AvatarFallback>ES</AvatarFallback>
      </Avatar>

      <h4 className="font-semibold text-foreground">
        No activity events found
      </h4>

      <p className="mt-1 text-xs text-muted-foreground">
        Adjust filters or date range to see more events
      </p>

      <Button variant="outline" className="mt-5" onClick={onReset}>
        Reset All Filters
      </Button>
    </div>
  );
}
