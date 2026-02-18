import { StaffAvailability } from "@/types/staff/availability";
import { CalendarEvent } from "@/utils/data";

function combineDateAndTime(date: string, time: string) {
  const d = new Date(date);
  const [h, m, s] = time.split(":").map(Number);
  d.setHours(h, m, s ?? 0, 0);
  return d;
}

export function mapStaffAvailabilityToEvents(
  availabilities: StaffAvailability[],
): CalendarEvent[] {
  return availabilities.map((a) => ({
    id: a.id,
    title: a.frequency,
    start: combineDateAndTime(a.startDate, a.startTime),
    end: combineDateAndTime(a.startDate, a.endTime),
    backgroundColor: "#E8F6ED",
    description: `${a.frequency} availability`,
  }));
}

// export function mapStaffAvailabilityToEvents(
//   availabilities: StaffAvailability[],
// ): CalendarEvent[] {
//   return availabilities.map((a) => ({
//     id: a.id,
//     title: a.frequency,
//     description: `${a.frequency} availability`,
//     start: combineDateAndTime(a.startDate, a.startTime),
//     end: combineDateAndTime(a.startDate, a.endTime),
//     display: "background",
//     backgroundColor: "#E8F6ED",
//   }));
// }
