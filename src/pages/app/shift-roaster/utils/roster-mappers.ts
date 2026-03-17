import { RosterRow, RosterRowResponse, Shift, ShiftRosterData } from "@/types/roster";

const DAY_MINUTES = 24 * 60;

type UnknownShift = Shift & Record<string, unknown>;

const toMinutes = (t: string) => {
  const source = (t ?? "").trim();
  if (!source) return 0;

  const timePart = source.includes("T") ? source.split("T")[1] : source;
  const [hh = "0", mm = "0"] = timePart.split(":");

  const hour = Number(hh);
  const minute = Number(mm);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return 0;
  return hour * 60 + minute;
};

const getShiftMinutes = (shift: Shift) => {
  const start = toMinutes(shift.visitStartTime);
  const end = toMinutes(shift.visitEndTime);
  const diff = end >= start ? end - start : DAY_MINUTES - start + end;
  return Math.max(diff, 0);
};

const formatDuration = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) return `${hours} hrs`;
  return `${hours}h ${minutes}m`;
};

const formatHoursFromShifts = (shifts: Shift[]) => {
  const totalMinutes = shifts.reduce((acc, shift) => acc + getShiftMinutes(shift), 0);
  return formatDuration(totalMinutes);
};

const toDateKey = (value?: string) => {
  if (!value) return "";
  const source = value.trim();
  if (!source) return "";
  if (source.includes("T")) return source.split("T")[0];
  return source.slice(0, 10);
};

const getNestedString = (obj: Record<string, unknown>, key: string) => {
  const value = obj[key];
  return typeof value === "string" ? value : undefined;
};

const getShiftDateKey = (shift: UnknownShift) => {
  const directCandidates = [
    getNestedString(shift, "startDate"),
    getNestedString(shift, "start_date"),
    getNestedString(shift, "date"),
    getNestedString(shift, "shiftDate"),
    getNestedString(shift, "shift_date"),
    getNestedString(shift, "visitDate"),
    getNestedString(shift, "visit_date"),
    getNestedString(shift, "scheduledDate"),
    getNestedString(shift, "scheduled_date"),
    getNestedString(shift, "scheduleDate"),
    getNestedString(shift, "schedule_date"),
  ];

  const schedule = shift.schedule;
  const scheduleObj =
    schedule && typeof schedule === "object" ? (schedule as Record<string, unknown>) : null;

  const nestedCandidates = scheduleObj
    ? [
        getNestedString(scheduleObj, "startDate"),
        getNestedString(scheduleObj, "start_date"),
        getNestedString(scheduleObj, "date"),
      ]
    : [];

  const candidate = [...directCandidates, ...nestedCandidates].find(
    (value): value is string => typeof value === "string" && value.trim().length > 0
  );

  return toDateKey(candidate);
};

const isShiftOnDate = (shift: Shift, selectedDateYMD: string) => {
  const shiftDate = getShiftDateKey(shift as UnknownShift);
  if (!shiftDate) return true;
  return shiftDate === selectedDateYMD;
};

export function toCarerRows(roster: RosterRowResponse[], selectedDateYMD: string): RosterRow[] {
  return roster.map((r) => {
    const shifts = (r.shifts ?? [])
      .filter((shift) => isShiftOnDate(shift, selectedDateYMD))
      .map((shift) => ({
        ...shift,
        counterpartyName: `${shift.client.firstname} ${shift.client.lastname}`,
      }));

    return {
      rowId: r.staffId,
      title: `${r.firstname} ${r.lastname}`,
      subtitle: formatHoursFromShifts(shifts),
      shifts,
    };
  });
}

export function toClientRows(api: ShiftRosterData, selectedDateYMD: string): RosterRow[] {
  const map = new Map<string, RosterRow>();

  for (const staff of api.roster) {
    const staffName = `${staff.firstname} ${staff.lastname}`;

    for (const shift of staff.shifts ?? []) {
      if (!isShiftOnDate(shift, selectedDateYMD)) continue;

      const c = shift.client;
      if (!c) continue;

      if (!map.has(c.id)) {
        map.set(c.id, {
          rowId: c.id,
          title: `${c.firstname} ${c.lastname}`,
          shifts: [],
        });
      }

      map.get(c.id)?.shifts.push({
        ...shift,
        counterpartyName: staffName,
      });
    }
  }

  return Array.from(map.values()).map((row) => ({
    ...row,
    subtitle: formatHoursFromShifts(row.shifts),
  }));
}