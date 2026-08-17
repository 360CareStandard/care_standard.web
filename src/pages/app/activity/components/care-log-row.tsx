// src/components/activity/CareLogRow.tsx

import { CalendarClock, ChevronRight, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { CareLog } from "@/types/activity";

interface CareLogRowProps {
  item: CareLog;
  onClick?: (item: CareLog) => void;
}

const statusStyles = {
  completed: "bg-green-50 text-green-700 hover:bg-green-50 border-transparent",

  missed: "bg-red-50 text-red-700 hover:bg-red-50 border-transparent",

  pending: "bg-orange-50 text-orange-700 hover:bg-orange-50 border-transparent",
};

export function CareLogRow({ item, onClick }: CareLogRowProps) {
  const isCompleted = item.status === "completed";

  return (
    <div className="flex gap-4 border-b px-4 py-5 last:border-b-0">
      <div
        className={`w-1 rounded-full ${
          isCompleted ? "bg-green-500" : "bg-red-500"
        }`}
      />

      <div className="flex flex-1 items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div
            className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-md border ${
              isCompleted
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <CalendarClock
              className={`h-4 w-4 ${
                isCompleted ? "text-green-600" : "text-red-500"
              }`}
            />
          </div>

          <div className="min-w-0">
            <div className="text-sm font-medium">
              {isCompleted
                ? "Visit Completed"
                : item.status === "missed"
                  ? "Visit Missed"
                  : "Visit Pending"}
            </div>

            <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
              <div>
                <p className="text-muted-foreground">Client</p>

                <p className="font-medium text-foreground">{item.clientName}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Carer</p>

                <p className="font-medium text-foreground">{item.carer}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5" />
              {item.visitDate} · {item.visitStartTime} - {item.visitEndTime}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Badge variant="outline" className={statusStyles[item.status]}>
            {item.status}
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => onClick?.(item)}
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
}
