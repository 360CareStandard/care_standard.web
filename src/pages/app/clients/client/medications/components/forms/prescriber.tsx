import { Input } from "@/components/ui/input";
import { MedicationForm } from "../../../../schemas/medication";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Prescriber = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<MedicationForm>();
  return (
    <div className="space-y-4">
      {/* Medication Name */}
      <div>
        <label className="form-label">Prescriber</label>
        <Input
          className="w-full"
          placeholder="e.g. Dr. Bennett"
          {...register("prescriberName")}
        />
        {errors.prescriberName && (
          <p className="form-error">{errors.prescriberName.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label>Additional Instructions</Label>
        <Textarea
          placeholder="e.g., Take with food..."
          {...register("additionalInstructions")}
          className="min-h-[80px] resize-y"
        />
        {errors.additionalInstructions && (
          <p className="form-error">{errors.additionalInstructions.message}</p>
        )}
      </div>
    </div>
  );
};

export default Prescriber;
