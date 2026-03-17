import { CalendarEvent } from "./calendar/calendar-types";
import { StaffAvailability } from "@/types/staff/availability";

function buildDateTime(dateValue: string, timeValue: string): Date | null {
  if (!dateValue || !timeValue) return null;

  const datePart = dateValue.includes("T") ? dateValue.slice(0, 10) : dateValue;
  const [hh = "0", mm = "0", ss = "0"] = timeValue.split(":");

  const year = Number(datePart.slice(0, 4));
  const month = Number(datePart.slice(5, 7));
  const day = Number(datePart.slice(8, 10));
  const hour = Number(hh);
  const minute = Number(mm);
  const second = Number(ss);

  if (
    [year, month, day, hour, minute, second].some((value) =>
      Number.isNaN(value),
    )
  ) {
    return null;
  }

  return new Date(year, month - 1, day, hour, minute, second, 0);
}

export function AvailabilityToCalendarEvents(
  schedules: StaffAvailability[],
): CalendarEvent[] {
  return schedules
    .flatMap((s) => {
      const start = buildDateTime(s.startDate, s.startTime);
      const endBase = buildDateTime(s.startDate, s.endTime);

      if (!start || !endBase) return [];

      const end = endBase < start ? new Date(endBase.getTime() + 24 * 60 * 60 * 1000) : endBase;

      return [
        {
          id: s.id,
          title: s.frequency || "availability",
          color: "emerald",
          start,
          end,
        } satisfies CalendarEvent,
      ];
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}