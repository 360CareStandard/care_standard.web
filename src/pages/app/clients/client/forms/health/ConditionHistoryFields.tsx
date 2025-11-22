// components/health/ConditionHistoryFields.tsx
import * as React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import type { MedicalForm } from "../../../schemas/health";

export function ConditionHistoryFields() {
  const { register, control } = useFormContext<MedicalForm>();

  // Manage array of diagnosedConditions from the form
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "diagnosedConditions",
  });

  // Ensure there's always at least one empty row when form is initially blank
  React.useEffect(() => {
    if (!fields || fields.length === 0) {
      append({ name: "", diagnosisDate: "", notes: "" });
    }
    // we intentionally want to run this only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="font-medium">Diagnosed Conditions</Label>

        <div className="space-y-1">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-wrap items-center gap-2 p-2 bg-[#F7F9FC] rounded-md"
            >
              {/* condition name */}
              <div className="flex-1">
                <Input
                  placeholder="Condition name"
                  {...register(`diagnosedConditions.${index}.name` as const)}
                  defaultValue={field.name ?? ""}
                />
              </div>

              {/* date */}
              <div className="relative flex-1">
                <Input
                  type="date"
                  placeholder="yyyy-mm-dd"
                  {...register(
                    `diagnosedConditions.${index}.diagnosisDate` as const
                  )}
                  defaultValue={field.diagnosisDate ?? ""}
                />
              </div>

              {/* short note */}
              <div className="flex-1">
                <Input
                  placeholder="Notes"
                  {...register(`diagnosedConditions.${index}.notes` as const)}
                  defaultValue={field.notes ?? ""}
                />
              </div>

              {/* remove */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Remove condition"
                onClick={() => remove(index)}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-1 gap-2"
          onClick={() => append({ name: "", diagnosisDate: "", notes: "" })}
        >
          <Plus className="h-4 w-4" />
          Add Condition
        </Button>
      </div>

      {/* clinical notes */}
      <div className="space-y-2">
        <Label className="font-medium">Clinical Notes</Label>
        <Textarea
          placeholder="Notes for clinical context…"
          {...register("clinicalNotes")}
          className="min-h-[76px] resize-y rounded-xl"
        />
      </div>
    </div>
  );
}
