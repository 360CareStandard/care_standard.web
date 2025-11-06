// formats a Date to "HH:MM:SS" or "" if falsy
export function formatTimeHHMMSS(date?: Date | null): string {
  if (!date) return "";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

// parse "HH:MM:SS" (24h) into a Date on today (local), returns undefined for invalid input
export function parseHHMMSSToDate(hhmmss?: string | null): Date | undefined {
  if (!hhmmss) return undefined;
  const parts = hhmmss.split(":").map((p) => p.trim());
  if (parts.length < 2) return undefined;
  const hh = parseInt(parts[0], 10);
  const mm = parseInt(parts[1], 10);
  const ss = parts[2] ? parseInt(parts[2], 10) : 0;
  if (
    Number.isNaN(hh) ||
    Number.isNaN(mm) ||
    Number.isNaN(ss) ||
    hh < 0 ||
    hh > 23 ||
    mm < 0 ||
    mm > 59 ||
    ss < 0 ||
    ss > 59
  ) {
    return undefined;
  }
  const d = new Date();
  d.setHours(hh, mm, ss, 0);
  return d;
}
