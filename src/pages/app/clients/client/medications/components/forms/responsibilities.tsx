import { Input } from "@/components/ui/input";
import { MedicationForm } from "../../../../schemas/medication";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const Responsibilities = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<MedicationForm>();
  return (
    <div className="space-y-4">
      {/* Medication Name */}
      <div>
        <label className="form-label">Administered By</label>
        <Select
          value={watch("administeredBy")}
          onValueChange={(value) =>
            setValue("administeredBy", value as any, { shouldValidate: true })
          }
        >
          <SelectTrigger className="bg-white w-full py-4">
            <SelectValue placeholder="Administered By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="carer">Carer</SelectItem>
            <SelectItem value="self">Self</SelectItem>
            <SelectItem value="mixed">Mixed</SelectItem>
            <SelectItem value="family">Family</SelectItem>
          </SelectContent>
        </Select>
        {errors.administeredBy && (
          <p className="form-error">{errors.administeredBy.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label>Linked Care Domain</Label>
        <Input
          placeholder="e.g., Medication Support"
          {...register("linkedCareDomain")}
          className="bg-white"
        />
        {errors.linkedCareDomain && (
          <p className="form-error">{errors.linkedCareDomain.message}</p>
        )}
      </div>
    </div>
  );
};

export default Responsibilities;
