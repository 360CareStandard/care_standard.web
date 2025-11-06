"use client";

import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Period, display12HourValue, setDateByType } from "./time-picker-utils";

export interface PeriodSelectorProps {
  period: Period;
  setPeriod: (m: Period) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  onRightFocus?: () => void;
  onLeftFocus?: () => void;
}

export const TimePeriodToggle = React.forwardRef<
  HTMLButtonElement,
  PeriodSelectorProps
>(({ period, setPeriod, date, setDate, onLeftFocus, onRightFocus }, ref) => {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  // keep original keyboard behavior (left/right to move focus elsewhere)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") onRightFocus?.();
    if (e.key === "ArrowLeft") onLeftFocus?.();
  };

  const handleValueChange = (value: string | undefined) => {
    if (!value) return;
    // value will be "AM" or "PM"
    const newPeriod = value as Period;
    setPeriod(newPeriod);

    if (date) {
      const tempDate = new Date(date);
      const hours = display12HourValue(date.getHours());
      // note: original code used the old period to determine toggling; preserve same behavior:
      setDate(
        setDateByType(
          tempDate,
          hours.toString(),
          "12hours",
          // when user selects a value, previous code used `period === "AM" ? "PM" : "AM"`
          // to force an update when switching between AM/PM. Here we still want to toggle if the value actually changes:
          newPeriod
        )
      );
    }
  };

  return (
    <div
      className="flex h-10 items-center"
      onKeyDown={handleKeyDown}
      ref={wrapperRef}
    >
      <ToggleGroup
        type="single"
        // controlled value
        value={period}
        onValueChange={handleValueChange}
        aria-label="Select AM or PM"
        className="inline-flex rounded-md border"
      >
        <ToggleGroupItem
          // attach forwarded ref to the first button so consumers focusing the trigger will focus a button
          ref={ref as React.Ref<HTMLButtonElement>}
          value="AM"
          className={`
     " !text-xs border border-input
    data-[state=on]:border-black 
    data-[state=on]:border
    data-[state=on]:bg-accent 
    data-[state=on]:text-accent-foreground
  `}
          aria-label="AM"
        >
          AM
        </ToggleGroupItem>

        <ToggleGroupItem
          value="PM"
          className={`
     " !text-xs border border-input 
    data-[state=on]:border-black 
    data-[state=on]:border
    data-[state=on]:bg-accent 
    data-[state=on]:text-accent-foreground
  `}
          aria-label="PM"
        >
          PM
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
});

TimePeriodToggle.displayName = "TimePeriodToggle";
