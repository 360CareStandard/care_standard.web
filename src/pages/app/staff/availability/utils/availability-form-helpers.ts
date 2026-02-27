import { StaffBookAbsenceForm } from "../../schemas/book-absence";
import { StaffAvailabilityForm } from "../../schemas/availability";
import { StaffAvailability } from "@/types/staff/availability";

export const initialAvailabilityFormValues: Partial<StaffAvailabilityForm> = {
  frequency: "daily",
};

export const initialAbsenceFormValues: Partial<StaffBookAbsenceForm> = {
  absenceType: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  reason: "",
};

const normalizeDateInput = (value?: string | null) => {
  if (!value) return "";
  return value.includes("T") ? value.slice(0, 10) : value;
};

const normalizeTimeInput = (value?: string | null) => {
  if (!value) return "";
  return value.slice(0, 5);
};

const normalizeFrequency = (
  value?: string,
): "daily" | "weekly" | "custom" => {
  if (value === "weekly" || value === "custom") return value;
  return "daily";
};

export const mapAvailabilityToFormValues = (
  availability: StaffAvailability,
): StaffAvailabilityForm => ({
  frequency: normalizeFrequency(availability.frequency),
  selectedDays: (availability.selectedDays ?? []) as StaffAvailabilityForm["selectedDays"],
  startTime: normalizeTimeInput(availability.startTime),
  endTime: normalizeTimeInput(availability.endTime),
  startDate: normalizeDateInput(availability.startDate),
  endDate: availability.noEndDate
    ? undefined
    : normalizeDateInput(availability.endDate),
  noEndDate: Boolean(availability.noEndDate),
  isActive: availability.isActive,
  repeatUnit: availability.repeatUnit || undefined,
  repeatEvery:
    typeof availability.repeatEvery === "number"
      ? availability.repeatEvery
      : undefined,
});

export const formatTimeLabel = (value?: string | null) => {
  if (!value) return "--:--";
  const [h = "0", m = "0"] = value.slice(0, 5).split(":");
  return `${h}:${m}`;
};

export const availabilityDurationLabel = (
  availability: StaffAvailability | null,
) => {
  if (!availability) return "";
  const [sh = "0", sm = "0"] = availability.startTime.split(":");
  const [eh = "0", em = "0"] = availability.endTime.split(":");
  const start = Number(sh) * 60 + Number(sm);
  const end = Number(eh) * 60 + Number(em);
  const total = end >= start ? end - start : 24 * 60 - start + end;
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  if (mins === 0) return `${hours}hrs`;
  return `${hours}h ${mins}m`;
};

export const frequencyLabel = (availability: StaffAvailability | null) => {
  if (!availability) return "Every 1 day";
  const every =
    availability.repeatEvery && availability.repeatEvery > 0
      ? availability.repeatEvery
      : 1;
  const unit =
    availability.repeatUnit ||
    (availability.frequency === "weekly" ? "week" : "day");
  return `Every ${every} ${unit}`;
};
