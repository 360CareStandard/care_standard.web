import { TextField } from "@/components/shared/text-field";
import { EmploymentForm } from "../../../schemas/employment";
import { useFormContext } from "react-hook-form";

export const EmploymentField = () => {
  const { formState, register } = useFormContext<EmploymentForm>();

  const { errors } = formState;
  return (
    <div className="space-y-4">
      <TextField
        label="Employment Start Date"
        type="date"
        {...register("startDate")}
        error={errors.startDate?.message}
      />

      <TextField
        label="Employment Type"
        {...register("employmentType")}
        error={errors.employmentType?.message}
      />
      <TextField
        label="Weekly Contracted Hours"
        type="number"
        {...register("weeklyContractedHours")}
        error={errors.weeklyContractedHours?.message}
      />
    </div>
  );
};
