// components/gp/GPInformationFields.tsx
import { useFormContext } from "react-hook-form";
import { StaffWorkForm } from "@/pages/app/staff/schemas/work";
import { TextField } from "@/components/shared/text-field";
import { TextareaField } from "@/components/shared/textarea-field";
export function PayAndRate() {
  const { formState, register, watch } = useFormContext<StaffWorkForm>();
  const { errors } = formState;
  return (
    <div className="space-y-4">
      <TextField
        label="Rate Card"
        type="number"
        inputMode="numeric"
        min="0"
        {...register("rateCard", {
          valueAsNumber: true,
        })}
        error={errors.rateCard?.message}
      />

      <TextField
        label="Travel Rate Card"
        type="number"
        inputMode="numeric"
        min="0"
        {...register("travelRateCard", {
          valueAsNumber: true,
        })}
        error={errors.travelRateCard?.message}
      />

      <TextareaField
        label="Notes (Optional)"
        placeholder="Additional Information"
        maxLength={500}
        autoResize
        {...register("note")}
        value={watch("note") ?? ""}
        error={errors.note?.message}
      />
    </div>
  );
}
