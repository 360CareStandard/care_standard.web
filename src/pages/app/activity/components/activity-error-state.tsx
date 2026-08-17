// src/components/activity/ActivityErrorState.tsx

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ActivityErrorStateProps {
  onRetry: () => void;
}

export function ActivityErrorState({ onRetry }: ActivityErrorStateProps) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>

      <h4 className="font-semibold text-foreground">Failed to load activity</h4>

      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        Something went wrong while fetching the activity logs. Please try again.
      </p>

      <Button variant="outline" className="mt-5" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}
