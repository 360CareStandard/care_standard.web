import {  RosterRow, RosterRowResponse, ShiftRosterData } from "@/types/roster";

export function toCarerRows(roster:RosterRowResponse[]): RosterRow[] {

  return roster.map((r) => ({
    rowId: r.staffId,
    title: `${r.firstname} ${r.lastname}`,
    subtitle: `${r.shiftCount ?? 0} shifts`,
    shifts: r.shifts ?? [],
  }));
}

export function toClientRows(api: ShiftRosterData): RosterRow[] {
  const roster = api.roster;
  const map = new Map<string, RosterRow>();

  for (const staff of roster) {
    for (const shift of staff.shifts ?? []) {
      const c = shift.client;
      if (!c) continue;
      if (!map.has(c.id)) {
        map.set(c.id, { rowId: c.id, title: `${c.firstname} ${c.lastname}`, shifts: [] });
      }
      map.get(c.id)!.shifts.push(shift);
    }
  }

  return Array.from(map.values()).map((row) => ({
    ...row,
    subtitle: `${row.shifts.length} shifts`,
  }));
}
