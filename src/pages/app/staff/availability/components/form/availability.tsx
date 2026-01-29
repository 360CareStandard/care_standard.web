import { Controller, useFormContext } from "react-hook-form";
import { StaffAvailabilityForm } from "../../../schemas/availability";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TextField } from "@/components/shared/text-field";
import { SelectableCheckbox } from "@/components/shared/selectable-checkbox";
import { useEffect } from "react";
import { Day } from "@/types/staff/availability";
import { RHFSelectField } from "@/components/shared/rhf-select-field";

const DAYS: { label: string; value: Day }[] = [
  { label: "Mon", value: "Mon" },
  { label: "Tue", value: "Tue" },
  { label: "Wed", value: "Wed" },
  { label: "Thu", value: "Thu" },
  { label: "Fri", value: "Fri" },
  { label: "Sat", value: "Sat" },
  { label: "Sun", value: "Sun" },
];

const AvailabilityForm = () => {
  const { watch, formState, register, setValue, control } =
    useFormContext<StaffAvailabilityForm>();

  const frequency = watch("frequency");
  const selectedDays = watch("selectedDays") ?? [];
  const noEndDate = watch("noEndDate");
  const startDate = watch("startDate");
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  const { errors } = formState;

  const toggleDay = (day: Day) => {
    setValue(
      "selectedDays",
      selectedDays.includes(day)
        ? selectedDays.filter((d) => d !== day)
        : [...selectedDays, day],
      { shouldValidate: true },
    );
  };

  useEffect(() => {
    if (frequency === "daily") {
      setValue("selectedDays", []);
    }
  }, [frequency, setValue]);
  const firstOccurrence = getFirstOccurrence({
    frequency,
    startDate,
    selectedDays,
  });

  const firstOccurrenceText =
    firstOccurrence && startTime && endTime
      ? `The first occurrence will be on ${formatDate(
          firstOccurrence,
        )} from ${formatTime(startTime)} to ${formatTime(endTime)}.`
      : null;

  return (
    <div className="space-y-6">
      {/* Frequency */}
      <div className="space-y-2">
        <Label>Select frequency *</Label>

        <Controller
          name="frequency"
          defaultValue="daily"
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="flex gap-6"
            >
              {["daily", "weekly", "custom"].map((f) => (
                <div key={f} className="flex items-center space-x-2">
                  <RadioGroupItem
                    className="size-6"
                    value={f}
                    id={`freq-${f}`}
                  />
                  <Label htmlFor={`freq-${f}`}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        />
      </div>

      {/* Custom repeat */}
      {frequency === "custom" && (
        <div className="flex gap-4 items-end max-w-sm">
          <TextField
            label="Repeats every"
            defaultValue={1}
            min={1}
            type="number"
            inputMode="numeric"
            {...register("repeatEvery", {
              valueAsNumber: true,
            })}
          />
          <RHFSelectField
            control={control}
            name="repeatUnit"
            placeholder="select.."
            options={[
              { value: "days", label: "Days" },
              { value: "weeks", label: "Weeks" },
              { value: "months", label: "Months" },
            ]}
          />
        </div>
      )}

      {/* Days (Weekly + Custom) */}
      {(frequency === "weekly" || frequency === "custom") && (
        <div className="space-y-2">
          <Label>Select days *</Label>
          <div className="flex gap-2 flex-wrap">
            {DAYS.map((day) => {
              const active = selectedDays.includes(day.value);

              return (
                <SelectableCheckbox
                  key={day.value}
                  label={day.label}
                  checked={active}
                  onChange={() => toggleDay(day.value)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Time */}
      <div className="space-y-2 max-w-sm">
        <Label>Select time *</Label>
        <div className="flex gap-4 items-center">
          <TextField
            type="time"
            {...register("startTime")}
            error={errors.startTime?.message}
          />
          <span>to</span>
          <TextField
            type="time"
            {...register("endTime")}
            error={errors.endTime?.message}
          />
        </div>
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <TextField
          label="Start Date *"
          type="date"
          {...register("startDate")}
          error={errors.startDate?.message}
        />
        {firstOccurrenceText && (
          <small className="text-muted-foreground">{firstOccurrenceText}</small>
        )}
      </div>

      {/* End Date */}
      {/* End Date */}
      <div className="space-y-2">
        <TextField
          label="End Date *"
          type="date"
          disabled={noEndDate}
          {...register("endDate")}
          error={errors.endDate?.message}
        />

        <Controller
          name="noEndDate"
          defaultValue={false}
          render={({ field }) => (
            <SelectableCheckbox
              label="No end date"
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  );
};

export default AvailabilityForm;
const DAY_INDEX: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

const formatDate = (date: Date) =>
  date.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

const formatTime = (time: string) => time; // already HH:mm

function getFirstOccurrence({
  frequency,
  startDate,
  selectedDays,
}: {
  frequency: "daily" | "weekly" | "custom";
  startDate?: string;
  selectedDays?: string[];
}) {
  if (!startDate) return null;

  const start = new Date(startDate);

  // DAILY → start date itself
  if (frequency === "daily") {
    return start;
  }

  // WEEKLY / CUSTOM → next matching weekday
  if (!selectedDays || selectedDays.length === 0) return null;

  const allowedDays = selectedDays.map((d) => DAY_INDEX[d]);

  for (let i = 0; i < 7; i++) {
    const candidate = new Date(start);
    candidate.setDate(start.getDate() + i);

    if (allowedDays.includes(candidate.getDay())) {
      return candidate;
    }
  }

  return null;
}
