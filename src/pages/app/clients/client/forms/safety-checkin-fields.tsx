// pages/app/clients/client/forms/safety-checkin-fields.tsx
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TextField } from "@/components/shared/text-field";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
import { CheckInMethodEnum } from "../../schemas/safety-checkin";
import { CareSetupForm } from "../../schemas/care-setup";

// shape you pass in from parent (client’s contacts)
export type EscalationOption = { id: string; label: string };

export function SafetyCheckinFields({
  contacts = [],
}: {
  contacts: EscalationOption[]; // e.g. [{id:'uuid', label:'Elizabeth Wilson (Daughter)'}]
}) {
  const contactList =
    contacts?.map((item) => ({
      label: item.label,
      value: item.id,
    })) || [];
  const { control, register, formState } = useFormContext<CareSetupForm>();
  const { errors } = formState;

  const methodOptions = CheckInMethodEnum.options.map((v) => ({
    value: v,
    label: v,
  }));

  return (
    <div className="space-y-6">
      {/* first row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RHFSelectField
          control={control}
          name="checkInMethod"
          label="Check-in Method"
          placeholder="Select method"
          options={methodOptions}
        />

        <TextField
          type="number"
          label="Late Visit Alert (minutes)"
          min={1}
          max={240}
          {...register("lateVisitAlertMins", { valueAsNumber: true })}
          error={errors.lateVisitAlertMins?.message}
          placeholder="15"
        />
      </div>

      <RHFSelectField
        control={control}
        name="escalationContactId"
        label="Escalation Contact"
        placeholder="No escalation contact"
        options={contactList}
      />

      {/* Lone worker toggle */}
      <Controller
        control={control}
        name="loneWorkerAlert"
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <div>
              <Label className=" font-medium mb-1">
                Lone Worker Alert (Nights)
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable safety alerts for night visits
              </p>
            </div>
            <Switch checked={!!field.value} onCheckedChange={field.onChange} />
          </div>
        )}
      />
    </div>
  );
}
