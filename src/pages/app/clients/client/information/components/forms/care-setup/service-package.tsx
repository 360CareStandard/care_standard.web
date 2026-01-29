import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TextField } from "@/components/shared/text-field";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
import { CareSetupForm, StatusEnum } from "../../../../../schemas/care-setup";
import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/ui/time-picker/time-picker";
import React from "react";
import { getDateFromMinutes } from "@/lib/utils";
import { earliestTime, latestTime } from "@/utils/data";
import { useCarePackage } from "@/hooks/agency/care-package";
import { formatTimeHHMMSS, parseHHMMSSToDate } from "@/utils/time";

const statusOptions = StatusEnum.options.map((v) => ({ value: v, label: v }));

const durations = [
  { value: "15", label: "15 Mins" },
  { value: "30", label: "30 Mins" },
  { value: "45", label: "45 Mins" },
  { value: "60", label: "60 Mins" },
];

export function ServicePackageFields() {
  const { data } = useCarePackage();
  const packagedata = Array.isArray(data) ? data : [];
  const { register, control, formState, watch, setValue } =
    useFormContext<CareSetupForm>();

  const { errors } = formState;
  const overnight = watch("overnightCareRequired");
  const watchedStartStr = watch("overnightCareStartTime");
  const watchedEndStr = watch("overnightCareEndTime");

  const [selectedStartTime, setSelectedStartTime] = React.useState<
    Date | undefined
  >(getDateFromMinutes(earliestTime));

  const [selectedLastTime, setSelectedLastTime] = React.useState<
    Date | undefined
  >(getDateFromMinutes(latestTime));
  const packageOptions = packagedata?.map((v) => ({
    value: v.id,
    label: v.name,
  }));
  // Sync local state when form values (strings) change externally
  React.useEffect(() => {
    const d = parseHHMMSSToDate(watchedStartStr);
    if (!d) return;
    // avoid unnecessary setState if same time
    if (
      !selectedStartTime ||
      selectedStartTime.getHours() !== d.getHours() ||
      selectedStartTime.getMinutes() !== d.getMinutes()
    ) {
      setSelectedStartTime(d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedStartStr]);

  React.useEffect(() => {
    const d = parseHHMMSSToDate(watchedEndStr);
    if (!d) return;
    if (
      !selectedLastTime ||
      selectedLastTime.getHours() !== d.getHours() ||
      selectedLastTime.getMinutes() !== d.getMinutes()
    ) {
      setSelectedLastTime(d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedEndStr]);

  // helper from earlier: formatTimeHHMMSS(date?: Date | null): string { ... }

  const defaultStart = getDateFromMinutes(earliestTime);
  const defaultEnd = getDateFromMinutes(latestTime);

  // on mount: if form already has values, sync local pickers (you may already do this).
  React.useEffect(() => {
    // if the form already has values (e.g. editing an existing record), initialize local state
    const startFromForm = parseHHMMSSToDate(watchedStartStr); // optional helper from earlier
    const endFromForm = parseHHMMSSToDate(watchedEndStr);
    if (startFromForm) setSelectedStartTime(startFromForm);
    if (endFromForm) setSelectedLastTime(endFromForm);
    // otherwise leave defaults in place
  }, []);

  // When overnight toggles ON, ensure the form fields are set (so API/validation sees a value)
  React.useEffect(() => {
    if (overnight) {
      // if the form field is empty, set it to the picker's current value or a sensible default
      const startVal = watchedStartStr ?? "";
      const endVal = watchedEndStr ?? "";

      if (!startVal || startVal.trim() === "") {
        const hh = formatTimeHHMMSS(selectedStartTime ?? defaultStart);
        setValue("overnightCareStartTime", hh, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      if (!endVal || endVal.trim() === "") {
        const hh = formatTimeHHMMSS(selectedLastTime ?? defaultEnd);
        setValue("overnightCareEndTime", hh, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
    // if turning OFF, you probably want to clear them (optional)
    else {
      setValue("overnightCareStartTime", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("overnightCareEndTime", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overnight]);

  // call this whenever your TimePicker changes
  function onStartTimeChange(d?: Date | undefined) {
    setSelectedStartTime(d);
    const hh = formatTimeHHMMSS(d); // e.g. "13:00:00"
    // write hh to form field used by your API/schema
    setValue("overnightCareStartTime", hh ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function onEndTimeChange(d?: Date | undefined) {
    setSelectedLastTime(d);
    const hh = formatTimeHHMMSS(d);
    setValue("overnightCareEndTime", hh ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  return (
    <div className="space-y-6">
      {errors.root?.message && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {errors.root.message}
        </div>
      )}
      {/* row 1 */}
      <div className="grid grid-cols-1 items-center  sm:grid-cols-2 gap-4">
        <RHFSelectField
          control={control}
          name="packageId"
          label="Package Type *"
          placeholder="Select package type"
          options={packageOptions}
          containerClassName="text-xs"
        />
        <TextField
          type="date"
          label="Start Date *"
          {...register("startDate")}
          error={errors.startDate?.message}
        />
      </div>

      {/* row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RHFSelectField
          control={control}
          name="status"
          label="Status"
          placeholder="Select status"
          options={statusOptions}
        />
        <TextField
          inputMode="numeric"
          type="number"
          label="Authorised Hr/Wk"
          min={0}
          {...register("authorisedHoursPerWeek", {
            valueAsNumber: true,
          })}
          error={errors.authorisedHoursPerWeek?.message}
        />
      </div>

      {/* Visit durations (checkbox UI, single select) */}
      <div>
        <Label className="mb-2 block text-sm font-medium">
          Visit Duration Presets
        </Label>

        <Controller
          control={control}
          name="visitDurationPreset"
          render={({ field }) => {
            const current = field.value ?? "";

            return (
              <div className="flex flex-wrap gap-4">
                {durations.map((d) => (
                  <Label
                    key={d.value}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <Input
                      type="checkbox"
                      className="h-4 w-4 border-gray-300 accent-primary"
                      checked={current === d.value}
                      onChange={() =>
                        field.onChange(current === d.value ? "" : d.value)
                      }
                    />
                    {d.label}
                  </Label>
                ))}
              </div>
            );
          }}
        />

        {errors.visitDurationPreset?.message && (
          <p className="mt-1 text-sm text-red-600">
            {String(errors.visitDurationPreset.message)}
          </p>
        )}
      </div>

      {/* Double-up visits */}
      <Controller
        control={control}
        name="doubleUpVisitRequired"
        render={({ field }) => (
          <div className="flex items-center justify-between py-2 ">
            <div>
              <Label className="font-medium text-sm mb-1">
                Double-up Visits Required
              </Label>
              <p className="text-xs text-muted-foreground">
                Require 2 carers per visit
              </p>
            </div>
            <Switch checked={!!field.value} onCheckedChange={field.onChange} />
          </div>
        )}
      />

      {/* Overnight Care */}

      <Controller
        control={control}
        name="overnightCareRequired"
        render={({ field }) => (
          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium mb-1">Overnight Care</Label>
              </div>
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            </div>

            {overnight && (
              <div className="col-span-3 sm:col-span-1">
                <Controller
                  control={control}
                  name="overnightCareType"
                  defaultValue="sleep-in"
                  render={({ field }) => (
                    <fieldset className="flex  items-center flex-wrap gap-8">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={field.name}
                          value="sleep-in"
                          checked={field.value === "sleep-in"}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="h-4 w-4 accent-primary"
                        />
                        <span className="text-sm">Sleep-in</span>
                      </label>

                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={field.name}
                          value="waking-night"
                          checked={field.value === "waking-night"}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="h-4 w-4 accent-primary"
                        />
                        <span className="text-sm">Waking night</span>
                      </label>
                    </fieldset>
                  )}
                />
                {errors.overnightCareType?.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {String(errors.overnightCareType.message)}
                  </p>
                )}
              </div>
            )}

            {overnight ? (
              <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6 bg-emerald-50 p-4 rounded-xl">
                <div className="absolute inset-y-0 left-0 w-1.5 bg-primary rounded-l-xl" />
                <div className="flex flex-col p-1">
                  Start Time
                  <TimePicker
                    date={selectedStartTime}
                    setDate={onStartTimeChange}
                    defaultPeriod="AM"
                  />
                </div>
                <div className="flex flex-col p-1">
                  End Time
                  <TimePicker
                    date={selectedLastTime}
                    setDate={onEndTimeChange}
                    defaultPeriod="PM"
                  />
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      />
    </div>
  );
}
