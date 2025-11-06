// pages/app/clients/client/forms/safety-checkin-fields.tsx
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TextField } from "@/components/shared/text-field";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
import { CareSetupForm, CheckInMethodEnum } from "../../schemas/care-setup";
import { useClientContacts } from "@/hooks/client/useClientContacts";

// shape you pass in from parent (client’s contacts)
export type EscalationOption = { id: string; label: string };

export function SafetyCheckinFields({
  contacts = [],
  clientId,
}: {
  contacts: EscalationOption[]; // e.g. [{id:'uuid', label:'Elizabeth Wilson (Daughter)'}]
  clientId: string;
}) {
  const { data } = useClientContacts(clientId);
  const contactData = Array.isArray(data) ? data : [];
  const contactOptions = contactData?.map((v) => ({
    value: v.id,
    label: v.contactName,
  }));

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
          label="Late Visit Alert (minutes)"
          {...register("lateVisitAlertThreshold", {
            valueAsNumber: true,
            setValueAs: (v) => (Number.isFinite(v) ? v : null),
          })}
          error={errors.lateVisitAlertThreshold?.message}
          placeholder="15"
          onInput={(e) =>
            (e.currentTarget.value = e.currentTarget.value.replace(
              /[^0-9]/g,
              ""
            ))
          }
        />
      </div>

      <RHFSelectField
        control={control}
        name="escalationContact"
        label="Escalation Contact"
        placeholder="No escalation contact"
        options={contactOptions}
      />

      {/* Lone worker toggle */}
      <Controller
        control={control}
        name="loneWorkerAlertEnabled"
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
