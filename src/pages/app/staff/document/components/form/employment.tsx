import { TextField } from "@/components/shared/text-field";
import { EmploymentForm } from "../../../schemas/employment";
import { useFormContext } from "react-hook-form";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
import { TextareaField } from "@/components/shared/textarea-field";
import { useEffect } from "react";

export const EmploymentField = () => {
  const { formState, register, control, watch, setValue } =
    useFormContext<EmploymentForm>();

  const { errors } = formState;

  const status = watch("status");

  useEffect(() => {
    if (status !== "terminated") {
      setValue("terminatedDate", undefined);
      setValue("reason", undefined);
    }
  }, [status, setValue]);

  return (
    <div className="space-y-4">
      <TextField
        label="Employment start date"
        type="date"
        {...register("startDate")}
        error={errors.startDate?.message}
      />
      <RHFSelectField
        control={control}
        name="employmentType"
        label="Employment type"
        placeholder="Select employment type"
        options={[
          { value: "Full-time", label: "Full-time" },
          { value: "Part-time", label: "Part-time" },
          { value: "Contractor", label: "Contractor" },
          { value: "Temporary", label: "Temporary" },
          { value: "Internship", label: "Internship" },
        ]}
      />

      <TextField
        label="Weekly contracted hours"
        type="number"
        inputMode="numeric"
        min="1"
        {...register("weeklyContractedHours", {
          valueAsNumber: true,
        })}
        error={errors.weeklyContractedHours?.message}
      />
      <RHFSelectField
        control={control}
        name="status"
        label="Employment status"
        placeholder="Select employment status"
        options={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "terminated", label: "Terminated" },
        ]}
      />
      {status === "terminated" && (
        <>
          <TextField
            label="Termination date"
            type="date"
            {...register("terminatedDate")}
            error={errors.terminatedDate?.message}
          />

          <TextareaField
            label="Reason (Optional)"
            placeholder="Enter reason for termination"
            maxLength={500}
            autoResize
            {...register("reason")}
            value={watch("reason") ?? ""}
            error={errors.reason?.message}
          />
        </>
      )}
    </div>
  );
};
