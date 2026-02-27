"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays, List } from "lucide-react";
import { useCalendarContext } from "../../calendar-context";

// You likely already have logic for shifting dates; wire your real functions here
function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

export function CalendarHeaderLeft() {
  const { date, setDate, mode } = useCalendarContext();

  const goPrev = () => {
    if (mode === "day") setDate(addDays(date, -1));
    if (mode === "week") setDate(addDays(date, -7));
    if (mode === "month")
      setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const goNext = () => {
    if (mode === "day") setDate(addDays(date, 1));
    if (mode === "week") setDate(addDays(date, 7));
    if (mode === "month")
      setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const goToday = () => setDate(new Date());

  return (
    <div className="flex items-center gap-2 lg:justify-start">
      {/* view icons (calendar/list) */}
      <div className="flex items-center rounded-md border overflow-hidden">
        <Button variant="ghost" size="icon" className="rounded-none">
          <CalendarDays className="h-4 w-4" />
        </Button>
        <div className="h-8 w-px bg-border" />
        <Button variant="ghost" size="icon" className="rounded-none">
          <List className="h-4 w-4" />
        </Button>
      </div>

      {/* Today */}
      <Button variant="outline" onClick={goToday}>
        Today
      </Button>

      {/* Prev / Next */}
      <div className="flex items-center rounded-md border overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-none"
          onClick={goPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="h-8 w-px bg-border" />
        <Button
          variant="ghost"
          size="icon"
          className="rounded-none"
          onClick={goNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
