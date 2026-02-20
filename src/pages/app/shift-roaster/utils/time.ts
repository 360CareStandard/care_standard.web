const DAY_MINUTES = 24 * 60;

export function toMinutes(t: string) {
  // supports "HH:mm:ss" or "HH:mm"
  const [hh, mm] = t.split(":");
  return Number(hh) * 60 + Number(mm);
}

export function barStyle(start: string, end: string) {
  const s = toMinutes(start);
  const e = toMinutes(end);

  let duration = e - s;
  if (duration < 0) duration += DAY_MINUTES; // overnight support if needed

  return {
    left: `${(s / DAY_MINUTES) * 100}%`,
    width: `${(duration / DAY_MINUTES) * 100}%`,
  };
}
