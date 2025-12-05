// components/gp/OtherHealthcareProfessionalsFields.tsx
import * as React from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { GpSupportForm } from "../../../schemas/gp-support";

type Role =
  | "Therapist"
  | "District Nurse"
  | "Social Worker"
  | "Consultant"
  | "";

const ROLES: Exclude<Role, "">[] = [
  "Therapist",
  "District Nurse",
  "Social Worker",
  "Consultant",
];

const makeBlank = () => ({
  role: "" as Role,
  phone: "",
  email: "",
  organisation: "",
  notes: "",
  name: "",
});

export function OtherHealthcareProfessionalsFields() {
  const { control, register } = useFormContext<GpSupportForm>();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "otherHealthcareProfessionals",
  });

  // ensure there's at least one row
  React.useEffect(() => {
    if (!fields || fields.length === 0) {
      replace([makeBlank()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isEmptyRow = (r: any) =>
    !r.role && !r.name && !r.phone && !r.email && !r.organisation && !r.notes;

  const lastIsBlank = fields.length
    ? isEmptyRow(fields[fields.length - 1])
    : true;

  return (
    <div className="space-y-4">
      {fields.map((field, idx) => (
        <div key={field.id} className="border-b pb-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-lg font-medium">
              Healthcare Professional {idx + 1}
            </h4>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Remove professional"
              onClick={() => {
                if (fields.length === 1) {
                  // replace with blank instead of removing all
                  replace([makeBlank()]);
                } else {
                  remove(idx);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Role</Label>
              <Controller
                control={control}
                name={`otherHealthcareProfessionals.${idx}.role` as const}
                defaultValue={field.role ?? ""}
                render={({ field: ctrl }) => (
                  <Select value={ctrl.value} onValueChange={ctrl.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input
                placeholder="Professional name"
                {...register(
                  `otherHealthcareProfessionals.${idx}.name` as const
                )}
                defaultValue={field.name ?? ""}
              />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Phone Number</Label>
              <Input
                inputMode="tel"
                placeholder="+234 801 234 5678"
                {...register(
                  `otherHealthcareProfessionals.${idx}.phone` as const
                )}
                defaultValue={field.phone ?? ""}
              />
            </div>

            <div className="space-y-1">
              <Label>
                Email <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                type="email"
                inputMode="email"
                placeholder="clinician@org.com"
                {...register(
                  `otherHealthcareProfessionals.${idx}.email` as const
                )}
                defaultValue={field.email ?? ""}
              />
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <Label>Organisation</Label>
            <Input
              placeholder="Organisation name"
              {...register(
                `otherHealthcareProfessionals.${idx}.organisation` as const
              )}
              defaultValue={field.organisation ?? ""}
            />
          </div>

          <div className="mt-3 space-y-1">
            <Label>Notes</Label>
            <Textarea
              placeholder="Additional notes..."
              {...register(
                `otherHealthcareProfessionals.${idx}.notes` as const
              )}
              defaultValue={field.notes ?? ""}
              className="min-h-[84px] resize-y"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="gap-2"
        onClick={() => append(makeBlank())}
        disabled={lastIsBlank}
      >
        <Plus className="h-4 w-4" />
        Add Healthcare Professional
      </Button>
    </div>
  );
}
