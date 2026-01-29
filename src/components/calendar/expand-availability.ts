import dayjs from "@/lib/dayjs";
import { AvailabilityRule, Weekday } from "./types";

/**
 * Expand a single availability rule into FullCalendar events
 */
export function expandAvailabilityRule(
  rule: AvailabilityRule,
  rangeStart: dayjs.Dayjs,
  rangeEnd: dayjs.Dayjs,
) {
  if (!rule.isActive) return [];

  const events: any[] = [];

  // MUST be let (dayjs is immutable)
  let cursor = dayjs(rule.startDate).startOf("day");

  // Determine last date to expand to
  const last =
    rule.noEndDate || !rule.endDate
      ? rangeEnd.endOf("day")
      : dayjs(rule.endDate).endOf("day");

  let safety = 0;

  while (cursor.isSameOrBefore(last)) {
    safety++;
    if (safety > 1000) {
      console.warn("Availability expansion aborted (safety guard)", rule);
      break;
    }

    let shouldAdd = false;

    // DAILY
    if (rule.frequency === "daily") {
      shouldAdd = true;
    }

    // WEEKLY
    if (rule.frequency === "weekly") {
      const day = getWeekday(cursor);
      shouldAdd = rule.selectedDays?.includes(day) ?? false;
    }

    // CUSTOM
    if (rule.frequency === "custom") {
      const day = getWeekday(cursor);
      shouldAdd = rule.selectedDays?.includes(day) ?? false;
    }

    if (shouldAdd) {
      pushEvent(cursor);
    }

    // Advance cursor (CRITICAL)
    cursor =
      rule.frequency === "custom"
        ? cursor.add(rule.repeatEvery ?? 1, rule.repeatUnit ?? "days")
        : cursor.add(1, "day");
  }

  function pushEvent(date: dayjs.Dayjs) {
    const startDt = dayjs(`${date.format("YYYY-MM-DD")}T${rule.startTime}`);

    const endDt = dayjs(`${date.format("YYYY-MM-DD")}T${rule.endTime}`);

    // Only push if event overlaps visible range
    if (startDt.isBefore(rangeEnd) && endDt.isAfter(rangeStart)) {
      events.push({
        id: `${rule.id}-${date.format("YYYY-MM-DD")}`,
        title: "Available",
        start: startDt.format("YYYY-MM-DDTHH:mm:ss"),
        end: endDt.format("YYYY-MM-DDTHH:mm:ss"),
        backgroundColor: "#DCFCE7",
        borderColor: "#16A34A",
      });
    }
  }

  return events;
}

/**
 * Safely get weekday union from dayjs
 */
function getWeekday(d: dayjs.Dayjs): Weekday {
  return d.format("ddd") as Weekday;
}
