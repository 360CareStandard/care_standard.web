// calendar/date-utils.ts
import dayjs from "dayjs";

export const DAY_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function combineDateAndTime(date: dayjs.Dayjs, time: string) {
  const [h, m, s] = time.split(":").map(Number);
  return date
    .hour(h)
    .minute(m)
    .second(s || 0);
}

export function buildEventDate(date: string, time: string) {
  // IMPORTANT: strip time & timezone
  const d = dayjs(date).format("YYYY-MM-DD");
  return `${d}T${time}`;
}
