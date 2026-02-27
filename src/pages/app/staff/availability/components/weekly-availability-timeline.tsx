import React from "react";
import {
  addDays,
  addWeeks,
  differenceInCalendarWeeks,
  format,
  isAfter,
  isBefore,
  isSameDay,
  startOfWeek,
} from "date-fns";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StaffAvailability } from "@/types/staff/availability";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

type Props = {
  schedules: StaffAvailability[];
  onEditAvailability: (availability: StaffAvailability) => void;
  onDeleteAvailability: (availability: StaffAvailability) => void;
};

type Segment = {
  id: string;
  dayIndex: number;
  startMinutes: number;
  endMinutes: number;
  title: string;
  colorClass: string;
  schedule: StaffAvailability;
};

const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
const DAY_CODES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const HEADER_HEIGHT = 48;
const ROW_HEIGHT = 64;
const LEFT_COL_WIDTH = 96;
const BASE_HOUR_WIDTH = 46;
const DAY_MINUTES = 24 * 60;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const toDateOnly = (value: string) => {
  const source = value.includes("T") ? value.slice(0, 10) : value;
  const [y, m, d] = source.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

const toMinutes = (value: string) => {
  const [h = "0", m = "0"] = value.split(":");
  const hh = Number(h);
  const mm = Number(m);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return 0;
  return clamp(hh * 60 + mm, 0, DAY_MINUTES);
};

const inRange = (target: Date, start: Date, end?: Date | null) => {
  if (isBefore(target, start)) return false;
  if (!end) return true;
  return !isAfter(target, end);
};

const dayCode = (date: Date) => DAY_CODES[date.getDay()];

const shouldRenderOnDay = (schedule: StaffAvailability, day: Date) => {
  const startDate = toDateOnly(schedule.startDate);
  if (!startDate) return false;

  const endDate = schedule.noEndDate ? null : toDateOnly(schedule.endDate ?? "");
  if (!inRange(day, startDate, endDate)) return false;

  if (schedule.frequency === "daily") return true;

  const selected = schedule.selectedDays ?? [];
  if (!selected.length) return false;

  const thisDayCode = dayCode(day);
  if (!selected.includes(thisDayCode)) return false;

  if (schedule.frequency === "weekly") return true;

  const repeatEvery = schedule.repeatEvery && schedule.repeatEvery > 0 ? schedule.repeatEvery : 1;
  const weekDiff = differenceInCalendarWeeks(day, startDate, { weekStartsOn: 1 });
  return weekDiff >= 0 && weekDiff % repeatEvery === 0;
};

const splitSegments = (schedule: StaffAvailability, dayIndex: number): Segment[] => {
  const start = toMinutes(schedule.startTime);
  const end = toMinutes(schedule.endTime);
  const availabilityTitle = `${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}`;
  const absenceTitle = schedule.absenceType
    ? schedule.absenceType.replace(/-/g, " ")
    : "Absence";
  const title =
    schedule.type === "absent"
      ? absenceTitle.charAt(0).toUpperCase() + absenceTitle.slice(1)
      : availabilityTitle;
  const colorClass =
    schedule.type === "absent"
      ? "border-slate-400 bg-slate-200 text-slate-700"
      : "border-emerald-500 bg-emerald-50 text-emerald-800";

  if (end > start) {
    return [
      {
        id: `${schedule.id}-${dayIndex}`,
        dayIndex,
        startMinutes: start,
        endMinutes: end,
        title,
        colorClass,
        schedule,
      },
    ];
  }

  return [
    {
      id: `${schedule.id}-${dayIndex}-a`,
      dayIndex,
      startMinutes: start,
      endMinutes: DAY_MINUTES,
      title,
      colorClass,
      schedule,
    },
    {
      id: `${schedule.id}-${dayIndex + 1}-b`,
      dayIndex: dayIndex + 1,
      startMinutes: 0,
      endMinutes: end,
      title,
      colorClass,
      schedule,
    },
  ];
};

const formatTime = (value: string) => {
  const [h = "0", m = "0"] = value.split(":");
  const hh = Number(h);
  const mm = Number(m);
  const period = hh >= 12 ? "pm" : "am";
  const displayHour = hh % 12 === 0 ? 12 : hh % 12;
  return `${displayHour}:${String(mm).padStart(2, "0")}${period}`;
};

export default function WeeklyAvailabilityTimeline({
  schedules,
  onEditAvailability,
  onDeleteAvailability,
}: Props) {
  const [anchorDate, setAnchorDate] = React.useState(new Date());
  const timelineViewportRef = React.useRef<HTMLDivElement | null>(null);
  const [timelineViewportWidth, setTimelineViewportWidth] = React.useState(0);

  const weekStart = React.useMemo(
    () => startOfWeek(anchorDate, { weekStartsOn: 1 }),
    [anchorDate],
  );

  const weekDays = React.useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  React.useEffect(() => {
    const element = timelineViewportRef.current;
    if (!element) return;

    const updateWidth = () => {
      setTimelineViewportWidth(element.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const minTimelineWidth = BASE_HOUR_WIDTH * 24;
  const timelineWidth = Math.max(minTimelineWidth, timelineViewportWidth);
  const hourWidth = timelineWidth / 24;

  const segments = React.useMemo(() => {
    const mapped: Segment[] = [];

    weekDays.forEach((day, dayIndex) => {
      schedules.forEach((schedule) => {
        if (!shouldRenderOnDay(schedule, day)) return;
        const split = splitSegments(schedule, dayIndex).filter(
          (segment) => segment.dayIndex >= 0 && segment.dayIndex < 7,
        );
        mapped.push(...split);
      });
    });

    return mapped.sort((a, b) => a.startMinutes - b.startMinutes);
  }, [schedules, weekDays]);

  const daySegments = (dayIndex: number) => segments.filter((segment) => segment.dayIndex === dayIndex);

  return (
    <div>
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setAnchorDate(new Date())}>Today</Button>
          <Button variant="outline" size="icon" onClick={() => setAnchorDate((d) => addWeeks(d, -1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setAnchorDate((d) => addWeeks(d, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm font-semibold text-slate-700">
          {format(weekDays[0], "d MMM, yyyy")} - {format(weekDays[6], "d MMM, yyyy")}
        </p>

        <div className="w-[100px]" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: `${LEFT_COL_WIDTH}px 1fr` }}>
        <div className="border-r bg-white">
          <div className="border-b bg-[#F9FAFB]" style={{ height: `${HEADER_HEIGHT}px` }} />
          {weekDays.map((day) => {
            const isToday = isSameDay(day, new Date());
            return (
              <div
                key={`label-${day.toISOString()}`}
                className={`flex items-center border-b px-3 text-sm text-slate-600 ${isToday ? "border-l-2 border-l-emerald-600 bg-emerald-50 text-emerald-700" : ""
                  }`}
                style={{ height: `${ROW_HEIGHT}px` }}
              >
                <span className="font-semibold">{format(day, "d")}</span>&nbsp;
                <span>{format(day, "EEE")}</span>
              </div>
            );
          })}
        </div>

        <div className="overflow-x-auto">
          <div ref={timelineViewportRef} className="w-full">
            <div style={{ width: `${timelineWidth}px` }}>
            <div className="grid border-b bg-[#F9FAFB]" style={{ gridTemplateColumns: `repeat(24, ${hourWidth}px)`, height: `${HEADER_HEIGHT}px` }}>
              {HOURS.map((hour) => (
                <div key={hour} className="flex items-center justify-center border-l px-1 text-xs text-slate-500">
                  {hour}
                </div>
              ))}
            </div>

            {weekDays.map((day, dayIndex) => {
              const items = daySegments(dayIndex);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  className={`relative border-b ${isToday ? "bg-emerald-50/50" : ""}`}
                  style={{ height: `${ROW_HEIGHT}px` }}
                >
                  <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(24, ${hourWidth}px)` }}>
                    {HOURS.map((hour) => (
                      <div key={`${day.toISOString()}-${hour}`} className="border-l" />
                    ))}
                  </div>

                  {items.map((segment) => {
                    const left = (segment.startMinutes / 60) * hourWidth;
                    const width = ((segment.endMinutes - segment.startMinutes) / 60) * hourWidth;
                    return (
                      <div
                        key={segment.id}
                        className={`group absolute top-1/2 -translate-y-1/2 rounded-md border-l-2 px-2 py-1 text-xs ${segment.colorClass}`}
                        style={{ left: `${left}px`, width: `${Math.max(width, 10)}px` }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-center font-medium">{segment.title}</p>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="opacity-0 transition-opacity group-hover:opacity-100"
                                aria-label="Availability actions"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {segment.schedule.type === "availability" ? (
                                <DropdownMenuItem
                                  onClick={() => onEditAvailability(segment.schedule)}
                                >
                                  Edit availability
                                </DropdownMenuItem>
                              ) : null}
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => onDeleteAvailability(segment.schedule)}
                              >
                                {segment.schedule.type === "absent"
                                  ? "Delete absence"
                                  : "Delete availability"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
