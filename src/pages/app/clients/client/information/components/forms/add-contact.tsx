import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TextField } from "@/components/shared/text-field";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
import {
  RelationshipEnum,
  type AddContactForm,
} from "../../../../schemas/contact";
import { TextareaField } from "@/components/shared/textarea-field";
import { Separator } from "@/components/ui/separator";

const relationshipOptions = RelationshipEnum.options.map((v) => ({
  value: v,
  label: v,
}));

export default function AddContact() {
  const { register, control, formState, watch } =
    useFormContext<AddContactForm>();
  const { errors } = formState;

  //   const familyAccessEnabled = getValues("familyAccessApp");

  return (
    <div className="grid grid-cols-1 gap-4">
      <TextField
        label="Full Name"
        placeholder="Enter full name"
        required
        {...register("contactName")}
        error={errors.contactName?.message}
      />

      <RHFSelectField
        control={control}
        name="relationshipToClient"
        label="Relationship"
        placeholder="Select relationship to client..."
        options={relationshipOptions}
      />

      <TextField
        label="Phone Number"
        placeholder="Enter phone number"
        inputMode="tel"
        {...register("contactPhone")}
        error={errors.contactPhone?.message}
        // hint="Digits, spaces, (), -, optional +"
      />
      <TextField
        label="Email Address"
        placeholder="Enter email address"
        inputMode="email"
        type="email"
        {...register("contactEmail")}
        error={errors.contactEmail?.message}
      />

      <TextField
        label="Address"
        placeholder="Full address"
        {...register("contactAddress")}
        error={errors.contactAddress?.message}
      />
      <TextareaField
        label="Notes"
        placeholder="Additional Information"
        maxLength={500}
        autoResize
        {...register("notes")}
        value={watch("notes") ?? ""}
        error={errors.notes?.message}
      />
      <RHFSelectField
        control={control}
        {...register("status")}
        name="status"
        label="Status"
        options={[
          { value: "active", label: "Active" },
          { value: "paused", label: "Paused" },
          { value: "inactive", label: "Inactive" },
        ]}
      />
      <Separator />
      {/* Toggles */}
      <div className="mt-2 space-y-4">
        <Controller
          control={control}
          name="isPrimaryContact"
          render={({ field }) => (
            <div className="flex items-start justify-between gap-4 py-2">
              <div>
                <Label className="font-medium mb-1">Primary Contact</Label>
                <p className="text-sm text-muted-foreground">
                  Main point of contact for care decisions
                </p>
              </div>
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />

        <Controller
          control={control}
          name="isEmergencyContact"
          render={({ field }) => (
            <div className="flex items-start justify-between gap-4 py-2">
              <div>
                <Label className="font-medium mb-1"> Emergency Contact</Label>
                <p className="text-sm text-muted-foreground">
                  Available for urgent situations
                </p>
              </div>
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />

        <Controller
          control={control}
          name="hasAppAccess"
          render={({ field }) => (
            <div className="flex items-start justify-between gap-4 py-2">
              <div>
                <Label className="font-medium mb-1">Family Access App</Label>
                <p className="text-sm text-muted-foreground">
                  Can view updates and information through the family app
                </p>
                {field.value && errors.contactEmail?.message ? (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contactEmail.message}
                  </p>
                ) : null}
              </div>
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
}
