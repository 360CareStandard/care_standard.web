import { StaffVisit } from "@/types/staff/visit";
import { CalendarEvent } from "./calendar/calendar-types";

// const CALENDAR_COLORS = [
//   "blue",
//   "emerald",
//   "violet",
//   "amber",
//   "rose",
//   "cyan",
// ] as const;

// function stableColorFromId(id: string): string {
//   let hash = 0;
//   for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
//   return CALENDAR_COLORS[Math.abs(hash) % CALENDAR_COLORS.length];
// }

function combineDateAndTime(dateStr: string, timeStr: string): Date {
  // local time
  return new Date(`${dateStr}T${timeStr}`);
}

export function visitSchedulesToCalendarEvents(
  schedules: StaffVisit[],
): CalendarEvent[] {
  return schedules
    .flatMap((s) => {
      const dateStr = s.visitDate ?? s.startDate;
      if (!dateStr) return [];

      const start = combineDateAndTime(dateStr, s.visitStartTime);

      const end =
        s.visitEndTime && s.visitEndTime.length > 0
          ? combineDateAndTime(dateStr, s.visitEndTime)
          : new Date(start.getTime() + (s.duration ?? 0) * 60_000);

      const event: CalendarEvent = {
        id: s.id,
        title: `${s.activitiesRequired[0] ?? "Care Visit"}`, // ✅ string
        color:
          s.status === "scheduled"
            ? "blue"
            : s.status === "missed"
              ? "orange"
              : s.status === "completed"
                ? "green"
                : "gray", // ✅ string
        start,
        end,
        duration: s.duration,
        status: s.status,
        clientassigned: s.client ?? undefined,
      };

      return [event];
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}
