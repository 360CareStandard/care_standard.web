import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";

export default function CalendarBodyHeader({
  date,
  onlyDay = false,
}: {
  date: Date;
  onlyDay?: boolean;
}) {
  const isToday = isSameDay(date, new Date());

  return (
    <div className="flex items-center justify-center gap-1 py-2 w-full sticky top-0 bg-background z-10 border-b">
      {!onlyDay && (
        <span
          className={cn(
            "text-xs font-medium",
            isToday ? "text-[#F56630] font-bold" : "text-foreground",
          )}
        >
          {format(date, "dd")}
        </span>
      )}
      <span
        className={cn(
          "text-xs font-medium",
          isToday ? "text-[#F56630]" : "text-muted-foreground",
        )}
      >
        {format(date, "EEE")}
      </span>
    </div>
  );
}
