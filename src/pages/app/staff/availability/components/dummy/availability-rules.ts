// dummy/availability-rules.ts
import { AvailabilityRule } from "@/components/calendar/types";
import { availabilityApiResponse } from "./availability";

export const availabilityRules: AvailabilityRule[] =
  availabilityApiResponse.data.map((r) => ({
    id: r.id,
    frequency: r.frequency,
    repeatUnit: r.repeatUnit,
    repeatEvery: r.repeatEvery,
    selectedDays: r.selectedDays,
    startDate: r.startDate,
    endDate: r.endDate ?? undefined,
    noEndDate: r.noEndDate,
    startTime: r.startTime,
    endTime: r.endTime,
    isActive: r.isActive,
  }));

//   const rules: AvailabilityRule[] =   availabilityApiResponse.data.map((r) => ({
// .map((r) => ({
//   id: r.id,
//   frequency: r.frequency,
//   repeatUnit: r.repeatUnit,
//   repeatEvery: r.repeatEvery,
//   selectedDays: r.selectedDays,
//   startDate: r.startDate,
//   endDate: r.endDate,
//   noEndDate: r.noEndDate,
//   startTime: r.startTime,
//   endTime: r.endTime,
//   isActive: r.isActive,
// }));
