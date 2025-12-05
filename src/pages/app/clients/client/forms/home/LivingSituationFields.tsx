// components/home/LivingSituationFields.tsx
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
import { Switch } from "@/components/ui/switch";
import { X, Plus } from "lucide-react";
import { HomeEnvironmentForm } from "../../../schemas/home-environment";

const PROPERTY_TYPES = [
  "Flat",
  "House",
  "Supported Housing",
  "Residential Care",
] as const;
const SUPPORT_TYPES = [
  "Own House",
  "Council Housing",
  "Supported Living",
  "Other",
] as const;

export function LivingSituationFields() {
  const { control, register, watch, getValues, setValue } =
    useFormContext<HomeEnvironmentForm>();

  // field array for livingSituation.householdMembers
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "livingSituation.householdMembers",
  });

  // ensure at least one blank row on mount
  React.useEffect(() => {
    if (!fields || fields.length === 0) {
      replace([{ name: "", relationship: "" }]);
    }
    // don't include replace/fields in deps intentionally (mount-only)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // livesAlone switch from form
  const livesAlone = watch("livingSituation.livesAlone");

  // when livesAlone turns on -> clear members and keep one blank
  React.useEffect(() => {
    if (livesAlone) {
      replace([{ name: "", relationship: "" }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [livesAlone]);

  const isEmpty = (m: { name?: string; relationship?: string }) =>
    !m?.name?.toString().trim() && !m?.relationship?.toString().trim();

  // compute lastIsBlank from live form values (not the static fields snapshot)
  const computeLastIsBlank = React.useCallback(() => {
    const current = getValues("livingSituation.householdMembers") as
      | { name?: string; relationship?: string }[]
      | undefined;
    if (!current || current.length === 0) return true;
    const last = current[current.length - 1];
    return isEmpty(last);
  }, [getValues]);

  // Local state so UI re-renders when inputs change — we watch the whole array for that
  const watchedMembers = watch("livingSituation.householdMembers");
  const lastIsBlank = React.useMemo(
    () => computeLastIsBlank(),
    [computeLastIsBlank, watchedMembers]
  );

  return (
    <div className="space-y-4">
      {/* Lives Alone */}
      <div className="flex items-start justify-between">
        <div>
          <Label className="font-medium mb-1">Lives Alone</Label>
          <p className="text-xs text-muted-foreground">
            Does the client live by themselves?
          </p>
        </div>
        <Controller
          control={control}
          name="livingSituation.livesAlone"
          defaultValue={false}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>

      {/* Household Members */}
      {!livesAlone && (
        <div className="space-y-2">
          <Label className="font-medium">Household Members</Label>

          <div className="space-y-2">
            {fields.map((m, idx) => (
              <div
                key={m.id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] items-center gap-2 p-2 bg-[#F7F9FC] rounded-md"
              >
                {/* Name */}
                <Input
                  placeholder="Name"
                  {...register(`livingSituation.householdMembers.${idx}.name`)}
                />

                {/* Relationship */}
                <Input
                  placeholder="Relationship"
                  {...register(
                    `livingSituation.householdMembers.${idx}.relationship` as const
                  )}
                />

                {/* Remove */}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Remove household member"
                    onClick={() => {
                      if (fields.length === 1) {
                        replace([{ name: "", relationship: "" }]);
                      } else {
                        remove(idx);
                      }
                    }}
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
            onClick={() => append({ name: "", relationship: "" })}
            disabled={lastIsBlank}
          >
            <Plus className="h-4 w-4" />
            Add Household Member
          </Button>
        </div>
      )}

      {/* Property / Support */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Property Type</Label>
          <Controller
            control={control}
            name="livingSituation.propertyType"
            defaultValue={PROPERTY_TYPES[0]}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Support Type</Label>
          <Controller
            control={control}
            name="livingSituation.supportType"
            defaultValue={SUPPORT_TYPES[0]}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORT_TYPES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </div>
  );
}
