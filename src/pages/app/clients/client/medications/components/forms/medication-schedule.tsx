import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FREQUENCY_DOSE_COUNT,
  MedicationForm,
} from "../../../../schemas/medication";

export function MedicationScheduleSection() {
  const { register, control, setValue } = useFormContext<MedicationForm>();

  const frequency = useWatch({ control, name: "frequency" });
  const doseTimes = useWatch({ control, name: "doseTimes" }) || [];

  const doseCount =
    frequency && frequency !== "As required"
      ? FREQUENCY_DOSE_COUNT[frequency] ?? 0
      : 0;

  // keep array length in sync
  if (doseCount > 0 && doseTimes.length !== doseCount) {
    setValue(
      "doseTimes",
      Array.from({ length: doseCount }, (_, i) => doseTimes[i] ?? ""),
      { shouldValidate: true }
    );
  }

  if (!doseCount) return null;

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">Schedule Medication</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F7F9FC] p-2 rounded-lg">
        {Array.from({ length: doseCount }).map((_, i) => (
          <div key={i}>
            <label className="form-label">Time of Dose {i + 1}</label>
            <Input
              type="time"
              {...register(`doseTimes.${i}` as const)}
              className="bg-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
