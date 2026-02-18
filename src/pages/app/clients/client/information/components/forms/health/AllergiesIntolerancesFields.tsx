// components/health/AllergiesIntolerancesFields.tsx
import * as React from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import type { MedicalForm } from "../../../../../schemas/health";

const CATEGORIES = ["Drug", "Food", "Environment"] as const;
const SEVERITIES = ["Mild", "Moderate", "Severe"] as const;

export function AllergiesIntolerancesFields() {
  const { control, register } = useFormContext<MedicalForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "knownAllergies",
  });

  React.useEffect(() => {
    if (fields.length === 0) {
      append({
        type: "",
        allergen: "",
        severity: "Mild",
        notes: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="font-medium">Known Allergies</Label>

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-wrap items-center gap-2 p-2 bg-[#F7F9FC] rounded-md"
            >
              {/* Category (controlled via Controller) */}
              <Controller
                control={control}
                name={`knownAllergies.${index}.type` as const}
                defaultValue={field.type ?? ""}
                render={({ field: selField }) => (
                  <Select
                    value={selField.value}
                    onValueChange={(v) => selField.onChange(v)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {/* Allergen (uncontrolled via register) */}
              <Input
                placeholder="Allergen (e.g., Penicillin)"
                {...register(`knownAllergies.${index}.allergen` as const)}
                defaultValue={field.allergen ?? ""}
                className="flex-1"
              />

              {/* Severity (controlled via Controller) */}
              <Controller
                control={control}
                name={`knownAllergies.${index}.severity` as const}
                defaultValue={field.severity ?? "Mild"}
                render={({ field: sevField }) => (
                  <Select
                    value={sevField.value}
                    onValueChange={(v) => sevField.onChange(v)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEVERITIES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {/* Notes */}
              <Input
                placeholder="Notes"
                {...register(`knownAllergies.${index}.notes` as const)}
                defaultValue={field.notes ?? ""}
                className="flex-1"
              />

              {/* Remove */}
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Remove allergy"
                  onClick={() => remove(index)}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-1 gap-2"
          onClick={() =>
            append({
              type: "",
              allergen: "",
              severity: "Mild",
              notes: "",
            })
          }
        >
          <Plus className="h-4 w-4" />
          Add Allergy
        </Button>
      </div>
    </div>
  );
}
