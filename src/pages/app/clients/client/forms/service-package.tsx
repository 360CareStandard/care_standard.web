import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TextField } from "@/components/shared/text-field";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
import {
  CareSetupForm,
  PackageTypeEnum,
  StatusEnum,
} from "../../schemas/care-setup";
import { Input } from "@/components/ui/input";
import { RHFTimePicker } from "@/components/shared/rhf-time-picker";

const packageOptions = PackageTypeEnum.options.map((v) => ({
  value: v,
  label: v,
}));
const statusOptions = StatusEnum.options.map((v) => ({ value: v, label: v }));

const durations = [
  { value: "15", label: "15 Mins" },
  { value: "30", label: "30 Mins" },
  { value: "45", label: "45 Mins" },
  { value: "60", label: "60 Mins" },
];

export function ServicePackageFields() {
  const { register, control, formState, watch } =
    useFormContext<CareSetupForm>();
  const { errors } = formState;
  const overnight = watch("overnightCare");

  return (
    <div className="space-y-6">
      {/* row 1 */}
      <div className="grid grid-cols-1  sm:grid-cols-2 gap-4">
        <RHFSelectField
          control={control}
          name="packageType"
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
          type="number"
          label="Authorised Hr/Wk"
          min={0}
          {...register("authorisedHours", { valueAsNumber: true })}
          error={errors.authorisedHours?.message}
        />
      </div>

      {/* Visit durations (checkbox UI, single select) */}
      <div>
        <Label className="mb-2 block text-sm font-medium">
          Visit Duration Presets
        </Label>

        <Controller
          control={control}
          name="visitDuration"
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

        {errors.visitDuration?.message && (
          <p className="mt-1 text-sm text-red-600">
            {String(errors.visitDuration.message)}
          </p>
        )}
      </div>

      {/* Double-up visits */}
      <Controller
        control={control}
        name="doubleUpRequired"
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
        name="overnightCare"
        render={({ field }) => (
          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium mb-1">Overnight Care</Label>
                <p className="text-xs text-muted-foreground">
                  Sleep-in or waking night care
                </p>
              </div>
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            </div>

            {overnight ? (
              <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6 bg-emerald-50 p-4 rounded-xl">
                <div className="absolute inset-y-0 left-0 w-1.5 bg-primary rounded-l-xl" />
                <RHFTimePicker<CareSetupForm>
                  nameTime="overnightStart"
                  namePeriod="overnightStartPeriod"
                  label="Start Time"
                  error={errors.overnightStart?.message as string | undefined}
                />
                <RHFTimePicker<CareSetupForm>
                  nameTime="overnightEnd"
                  namePeriod="overnightEndPeriod"
                  label="End Time"
                  error={errors.overnightEnd?.message as string | undefined}
                />
              </div>
            ) : null}
          </div>
        )}
      />
    </div>
  );
}
