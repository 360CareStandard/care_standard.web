// src/components/activity/AlertRow.tsx

import { Clock3, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

import type { ActivityAlert } from "@/types/activity";

interface AlertRowProps {
  item: ActivityAlert;
  onClick?: (item: ActivityAlert) => void;
}

const priorityStyles = {
  low: "bg-blue-50 text-blue-700 hover:bg-blue-50 border-transparent",
  medium: "bg-orange-50 text-orange-700 hover:bg-orange-50 border-transparent",
  high: "bg-red-50 text-red-700 hover:bg-red-50 border-transparent",
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function AlertRow({ item }: AlertRowProps) {
  return (
    <div className="flex gap-4 border-b px-4 py-5 last:border-b-0">
      <div className="w-1 rounded-full bg-red-500" />

      <div className="flex flex-1 items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md border border-red-200 bg-red-50">
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </div>

          <div className="min-w-0">
            <div className="text-sm font-medium">{item.title}</div>

            <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
              <div>
                <p className="text-muted-foreground">Client</p>

                <p className="font-medium text-foreground">{item.clientName}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Carer</p>

                <p className="font-medium text-foreground">{item.reportedBy}</p>
              </div>
            </div>

            <div className="mt-3 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
              {item.description}
            </div>

            <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5" />

              {formatDateTime(item.incidentDateTime)}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Badge variant="outline" className={priorityStyles[item.priority]}>
            {item.priority}
          </Badge>
          {/* 
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => onClick?.(item)}
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button> */}
        </div>
      </div>
    </div>
  );
}
