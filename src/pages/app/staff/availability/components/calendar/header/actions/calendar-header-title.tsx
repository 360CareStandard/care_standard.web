"use client";

import { useCalendarContext } from "../../calendar-context";

export function CalendarHeaderTitle() {
  const { date } = useCalendarContext();

  const label = date.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex items-center lg:justify-center">
      <h2 className="text-lg font-medium tracking-tight">{label}</h2>
    </div>
  );
}
