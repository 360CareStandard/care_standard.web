import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
dayjs.extend(isToday);

export function formatUpdatedAt(iso: string) {
  const d = dayjs(iso);
  if (d.isToday()) return `Last updated: Today at ${d.format("h:mm A")}`;
  return `Last updated: ${d.format("D MMM YYYY [at] h:mm A")}`;
}
