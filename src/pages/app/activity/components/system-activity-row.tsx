// src/components/activity/SystemActivityRow.tsx

import { ChevronRight, UserCog } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { SystemActivity } from "@/types/activity";

interface SystemActivityRowProps {
  item: SystemActivity;
  onClick?: (item: SystemActivity) => void;
}

export function SystemActivityRow({ item, onClick }: SystemActivityRowProps) {
  const title = typeof item.title === "string" ? item.title : "System Activity";

  const description =
    typeof item.description === "string" ? item.description : "";

  const staff =
    typeof item.staff === "string"
      ? item.staff
      : typeof item.staffName === "string"
        ? item.staffName
        : "";

  const actor = typeof item.actor === "string" ? item.actor : "";

  const time = typeof item.createdAt === "string" ? item.createdAt : "";

  return (
    <div className="flex gap-4 border-b px-4 py-5 last:border-b-0">
      <div className="w-1 rounded-full bg-red-500" />

      <div className="flex flex-1 items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md border border-red-200 bg-red-50">
            <UserCog className="h-4 w-4 text-red-500" />
          </div>

          <div className="min-w-0">
            <div className="text-sm font-medium">{title}</div>

            {staff && (
              <div className="mt-2 text-xs">
                <p className="text-muted-foreground">Staff</p>

                <p className="font-medium text-foreground">{staff}</p>
              </div>
            )}

            {description && (
              <div className="mt-3 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                {description}
              </div>
            )}

            {(time || actor) && (
              <div className="mt-3 text-[11px] text-muted-foreground">
                {time}

                {actor && (
                  <>
                    <span className="mx-1">•</span>
                    <span>by {actor}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

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
  );
}
