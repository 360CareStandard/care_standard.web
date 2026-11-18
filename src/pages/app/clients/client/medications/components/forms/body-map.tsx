import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MedicationForm } from "../../../../schemas/medication";
import BodyMap from "../body-map-display";

// List of standard body parts aligned strictly with the front-view BodyMap component
const BODY_PARTS = [
  "Head",
  "Neck",
  "Chest",
  "Abdomen",
  "Pelvic area",
  "Right Shoulder",
  "Left Shoulder",
  "Right Upper Arm",
  "Left Upper Arm",
  "Right Forearm",
  "Left Forearm",
  "Right Hand",
  "Left Hand",
  "Right Thigh",
  "Left Thigh",
  "Right Knee",
  "Left Knee",
  "Right Lower Leg",
  "Left Lower Leg",
  "Right Foot",
  "Left Foot",
] as const;

export function BodyMapSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<MedicationForm>();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Body Map</h3>
        <p className="text-xs text-muted-foreground">
          Specify and visually confirm where the medication should be applied.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Column: Form Fields & Shadcn Select */}
        <div className="space-y-4">
          <div>
            <label className="form-label">Body Part</label>
            <Controller
              name="bodyMap.bodyPart"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select body part..." />
                  </SelectTrigger>
                  <SelectContent>
                    {BODY_PARTS.map((part) => (
                      <SelectItem key={part} value={part}>
                        {part}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.bodyMap?.bodyPart && (
              <p className="form-error">{errors.bodyMap.bodyPart.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Application Instruction</label>
            <Input
              placeholder="e.g. Apply to affected area"
              {...register("bodyMap.instruction")}
            />
            {errors.bodyMap?.instruction && (
              <p className="form-error">{errors.bodyMap.instruction.message}</p>
            )}
          </div>
        </div>

        {/* Right Column: Visual Interactive Body Map Component */}
        <div className="flex justify-center bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <Controller
            name="bodyMap.bodyPart"
            control={control}
            render={({ field }) => (
              <BodyMap
                bodyPart={field.value}
                interactive={true}
                onBodyPartChange={(selectedPart) =>
                  field.onChange(selectedPart)
                }
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
