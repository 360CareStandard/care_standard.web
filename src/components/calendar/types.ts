// types.ts
export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type AvailabilityRule = {
  id: string;
  isActive: boolean;
  frequency: "daily" | "weekly" | "custom";
  selectedDays?: Weekday[];
  startDate: string;
  endDate?: string;
  noEndDate: boolean;
  startTime: string;
  endTime: string;
  repeatUnit?: "days" | "weeks";
  repeatEvery?: number | null;
};
