const DAY_MINUTES = 24 * 60;

const extractHourMinute = (value: string) => {
  const source = (value ?? "").trim();
  if (!source) return { hour: 0, minute: 0 };

  // Supports values like "HH:mm", "HH:mm:ss", "YYYY-MM-DDTHH:mm:ssZ"
  const match = source.match(/(\d{2}):(\d{2})/);
  if (!match) return { hour: 0, minute: 0 };

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return { hour: 0, minute: 0 };

  return { hour, minute };
};

export function toMinutes(value: string) {
  const { hour, minute } = extractHourMinute(value);
  return hour * 60 + minute;
}

export function formatTime(value: string) {
  const { hour, minute } = extractHourMinute(value);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function barStyle(start: string, end: string) {
  const s = toMinutes(start);
  const e = toMinutes(end);

  let duration = e - s;
  if (duration < 0) duration += DAY_MINUTES; // overnight support

  return {
    left: `${(s / DAY_MINUTES) * 100}%`,
    width: `${Math.max((duration / DAY_MINUTES) * 100, 0)}%`,
  };
}