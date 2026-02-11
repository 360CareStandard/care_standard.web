import { SelectableCheckbox } from "@/components/shared/selectable-checkbox";
import { TextField } from "@/components/shared/text-field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { VisitScheduleForm } from "@/pages/app/clients/schemas/visit-schedule";

import CreatableSelect from "react-select/creatable";
import { useEffect, useMemo, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import CarerSelector from "./selector";
import { customSelectStyles } from "@/styles/react-select";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
type Day = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
const DAYS: { label: string; value: Day }[] = [
  { label: "Mon", value: "mon" },
  { label: "Tue", value: "tue" },
  { label: "Wed", value: "wed" },
  { label: "Thu", value: "thu" },
  { label: "Fri", value: "fri" },
  { label: "Sat", value: "sat" },
  { label: "Sun", value: "sun" },
];
type Option = { value: string; label: string };
const skills: Option[] = [
  { value: "medication-administration", label: "Medication Administration" },
  { value: "cather-care", label: "Cather care" },
];
const activities: Option[] = [
  { value: "meal-preparation", label: "Meal Preparation" },
  { value: "phone-repair", label: "Phone Repair" },
];
const VisitScheduleFormField = () => {
  const { watch, formState, register, setValue, control } =
    useFormContext<VisitScheduleForm>();
  const sheetContentRef = useRef(null);
  const frequency = watch("visitFrequency");
  const selectedDays = watch("daysOfWeek") ?? [];
  const noEndDate = watch("noEndDate");
  //   const startDate = watch("startDate");
  const startTime = watch("visitStartTime");
  const endTime = watch("visitEndTime");
  const { errors } = formState;
  const toggleDay = (day: Day) => {
    setValue(
      "daysOfWeek",
      selectedDays.includes(day)
        ? selectedDays.filter((d) => d !== day)
        : [...selectedDays, day],
      { shouldValidate: true },
    );
  };

  useEffect(() => {
    if (frequency === "daily") {
      setValue("daysOfWeek", []);
    }
  }, [frequency, setValue]);

  const calculateDuration = (start: string, end: string) => {
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    let duration = endHour * 60 + endMinute - (startHour * 60 + startMinute);

    if (duration < 0) {
      duration += 24 * 60; // Handle overnight shifts
    }

    return duration;
  };
  const durationMinutes = useMemo(() => {
    if (!startTime || !endTime) return null;
    return calculateDuration(startTime, endTime);
  }, [startTime, endTime]);
  useEffect(() => {
    setValue("duration", durationMinutes ?? 0, { shouldValidate: true });
  }, [durationMinutes, setValue]);
  return (
    <div className="space-y-6">
      {/* Frequency */}
      <div className="space-y-2">
        <Label>Visit frequency *</Label>

        <Controller
          name="visitFrequency"
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
        <div className="flex gap-4 items-end max-w-xs">
          <div>
            <TextField
              label="Repeats every"
              defaultValue={1}
              min={1}
              type="number"
              inputMode="numeric"
              {...register("repeatEveryWeeks", {
                valueAsNumber: true,
              })}
            />
          </div>
          <span className="border flex justify-center items-center px-4 h-11 rounded-md">
            Weeks
          </span>
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

          {errors.daysOfWeek?.message && (
            <p className="mt-1 text-sm text-red-600">
              {String(errors.daysOfWeek.message)}
            </p>
          )}
        </div>
      )}

      {/* Time */}
      <div className="space-y-2 max-w-sm">
        <Label>Visit time *</Label>
        <div className="flex gap-4 items-center">
          <TextField
            type="time"
            {...register("visitStartTime")}
            error={errors.visitStartTime?.message}
          />
          <span>to</span>
          <TextField
            type="time"
            {...register("visitEndTime")}
            error={errors.visitEndTime?.message}
          />
        </div>
        {durationMinutes !== null && (
          <span className="text-sm text-muted-foreground">
            Duration: {durationMinutes} minutes
          </span>
        )}
      </div>

      {/* Start Date */}
      <div className="space-y-1">
        <div className="flex gap-4 items-center">
          <TextField
            label="Start Date"
            required
            type="date"
            {...register("startDate")}
            error={errors.startDate?.message}
          />
          <TextField
            label="End Date"
            required={!noEndDate}
            type="date"
            disabled={noEndDate}
            {...register("endDate")}
            error={errors.endDate?.message}
          />
        </div>
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

      {/* End Date */}
      <div className="flex gap-4 items-end max-w-xs">
        <TextField
          label="Carers needed"
          required
          defaultValue={1}
          min={1}
          type="number"
          inputMode="numeric"
          {...register("carersNeeded", {
            valueAsNumber: true,
          })}
        />
      </div>
      <CarerSelector />
      <div>
        <Label className="mb-2 block text-sm font-medium">
          Required Skills
        </Label>

        <Controller
          name="requiredSkills"
          control={control}
          defaultValue={[]} // ✅ important
          render={({ field }) => {
            const selectedSkills: Option[] = (field.value ?? []).map(
              (val: string) =>
                skills.find((o) => o.value === val) ?? {
                  value: val,
                  label: val,
                },
            );

            return (
              <CreatableSelect<Option, true>
                isMulti
                options={skills}
                value={selectedSkills}
                onChange={(selected) =>
                  field.onChange((selected ?? []).map((o) => o.value))
                }
                placeholder="Add required skills..."
                menuPortalTarget={sheetContentRef.current}
                // menuPortalTarget={portalTarget}
                menuPosition="fixed" // <- important
                menuShouldScrollIntoView={false}
                styles={customSelectStyles}
                // optional: control whether menu closes on scroll
                closeMenuOnScroll={false}
              />
            );
          }}
        />
      </div>
      <div>
        <Label className="mb-2 block text-sm font-medium">
          Activities Required
        </Label>

        <Controller
          name="activitiesRequired"
          control={control}
          defaultValue={[]} // ✅ important
          render={({ field }) => {
            const selectedActivities: Option[] = (field.value ?? []).map(
              (val: string) =>
                activities.find((o) => o.value === val) ?? {
                  value: val,
                  label: val,
                },
            );

            return (
              <CreatableSelect<Option, true>
                isMulti
                options={activities}
                value={selectedActivities}
                onChange={(selected) =>
                  field.onChange((selected ?? []).map((o) => o.value))
                }
                placeholder="Add required activities..."
                menuPortalTarget={sheetContentRef.current}
                // menuPortalTarget={portalTarget}
                menuPosition="fixed" // <- important
                menuShouldScrollIntoView={false}
                styles={customSelectStyles}
                // optional: control whether menu closes on scroll
                closeMenuOnScroll={false}
              />
            );
          }}
        />
      </div>
      <div className="flex gap-4 items-end max-w-xs">
        <RHFSelectField
          control={control}
          name="fundingSource"
          label="Funding Source"
          placeholder="Select funding source"
          options={
            [
              { value: "nhs", label: "NHS" },
              { value: "local-authority", label: "Local Authority" },
              { value: "private", label: "Private" },
              { value: "mixed", label: "Mixed" },
              { value: "other", label: "Other" },
            ] /* fundingOptions */
          }
        />
      </div>
    </div>
  );
};

export default VisitScheduleFormField;
