import { useFormContext } from "react-hook-form";
import { StaffBookAbsenceForm } from "../../../schemas/book-absence";
import { TextField } from "@/components/shared/text-field";
import { Label } from "@/components/ui/label";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
import { TextareaField } from "@/components/shared/textarea-field";

const absenceTypeOptions = [
  { value: "annual-leave", label: "Annual leave" },
  { value: "sick-leave", label: "Sick leave" },
  { value: "unpaid-leave", label: "Unpaid leave" },
  { value: "maternity-leave", label: "Maternity leave" },
  { value: "paternity-leave", label: "Paternity leave" },
  { value: "personal-leave", label: "Personal leave" },
  { value: "compassionate-leave", label: "Compassionate leave" },
  { value: "emergency-leave", label: "Emergency leave" },
  { value: "other", label: "Other" },
];
const AbsenceForm = () => {
  const { watch, formState, register, control } =
    useFormContext<StaffBookAbsenceForm>();
  const { errors } = formState;

  return (
    <div className="space-y-6">
      {/* Starting */}
      <div className="space-y-2 ">
        <Label>Starting *</Label>
        <div className="flex gap-4 items-center">
          <TextField
            type="date"
            {...register("startDate")}
            error={errors.startDate?.message}
          />
          <TextField
            type="time"
            {...register("startTime")}
            error={errors.startTime?.message}
          />
        </div>
      </div>
      {/* Ending */}
      <div className="space-y-2 ">
        <Label>Ending *</Label>
        <div className="flex gap-4 items-center">
          <TextField
            type="date"
            {...register("endDate")}
            error={errors.endTime?.message}
          />
          <TextField
            type="time"
            {...register("endTime")}
            error={errors.endTime?.message}
          />
        </div>
      </div>
      <div className="space-y-2 ">
        <Label>Absence type *</Label>
        <RHFSelectField
          control={control}
          name="absenceType"
          placeholder="select.."
          options={absenceTypeOptions}
        />
      </div>
      <div className="space-y-2 ">
        <Label>Reason *</Label>
        <TextareaField
          placeholder="Enter reason "
          maxLength={500}
          autoResize
          {...register("reason")}
          value={watch("reason") ?? ""}
          error={errors.reason?.message}
        />
      </div>
    </div>
  )
}

export default AbsenceForm