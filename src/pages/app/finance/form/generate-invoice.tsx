import { Label } from "@/components/ui/label";
import { FinanceClientSelector } from "../components/selector/client-selector";
import { FinanceFormData } from "@/pages/schemas/finance";
import { useFormContext } from "react-hook-form";
import { TextField } from "@/components/shared/text-field";

const FinanceFormField = () => {
  const { register, formState } = useFormContext<FinanceFormData>();
  const { errors } = formState;
  return (
    <div className="w-full my-2 space-y-4">
      <div className="">
        <Label>
          Client<span className="text-red-500">*</span>
        </Label>

        <FinanceClientSelector />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextField
          required
          label="Start Date"
          type="date"
          {...register("periodStart")}
          error={errors.periodStart?.message}
        />
        <TextField
          required
          label="End Date"
          type="date"
          {...register("periodEnd")}
          error={errors.periodEnd?.message}
        />
      </div>
    </div>
  );
};

export default FinanceFormField;
