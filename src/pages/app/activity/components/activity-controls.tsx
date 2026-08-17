// src/components/activity/ActivityControls.tsx

import { ChevronDown, Filter } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import type { AlertPriority, CareLogStatus } from "@/types/activity";

export type SortOption = "recently-created" | "first-created" | "last-30-days";

interface ActivityControlsProps {
  sort: SortOption;
  onSortChange: (value: SortOption) => void;

  currentTab: "alert" | "care-logs" | "system";

  alertPriority?: AlertPriority;
  onAlertPriorityChange: (value: AlertPriority | undefined) => void;

  careLogStatus?: CareLogStatus;
  onCareLogStatusChange: (value: CareLogStatus | undefined) => void;
}

const sortLabelMap: Record<SortOption, string> = {
  "recently-created": "Recently Created",
  "first-created": "First Created",
  "last-30-days": "Last 30 days",
};

export function ActivityControls({
  sort,
  onSortChange,
  currentTab,
  alertPriority,
  onAlertPriorityChange,
  careLogStatus,
  onCareLogStatusChange,
}: ActivityControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9 gap-2">
            <ChevronDown className="h-4 w-4" />
            {sortLabelMap[sort]}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => onSortChange("recently-created")}>
            Recently Created
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onSortChange("first-created")}>
            First Created
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onSortChange("last-30-days")}>
            Last 30 days
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {currentTab !== "system" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              {currentTab === "alert" ? "Priority" : "Status"}
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {currentTab === "alert" && (
              <>
                <DropdownMenuCheckboxItem
                  checked={!alertPriority}
                  onCheckedChange={() => onAlertPriorityChange(undefined)}
                >
                  All Priorities
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  checked={alertPriority === "high"}
                  onCheckedChange={() => onAlertPriorityChange("high")}
                >
                  High
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  checked={alertPriority === "medium"}
                  onCheckedChange={() => onAlertPriorityChange("medium")}
                >
                  Medium
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  checked={alertPriority === "low"}
                  onCheckedChange={() => onAlertPriorityChange("low")}
                >
                  Low
                </DropdownMenuCheckboxItem>
              </>
            )}

            {currentTab === "care-logs" && (
              <>
                <DropdownMenuCheckboxItem
                  checked={!careLogStatus}
                  onCheckedChange={() => onCareLogStatusChange(undefined)}
                >
                  All Statuses
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  checked={careLogStatus === "completed"}
                  onCheckedChange={() => onCareLogStatusChange("completed")}
                >
                  Completed
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  checked={careLogStatus === "missed"}
                  onCheckedChange={() => onCareLogStatusChange("missed")}
                >
                  Missed
                </DropdownMenuCheckboxItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
