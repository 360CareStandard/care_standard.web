import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TextField } from "@/components/shared/text-field";
import { RHFSelectField } from "@/components/shared/rhf-select-field";

import { TextareaField } from "@/components/shared/textarea-field";
import { Separator } from "@/components/ui/separator";
import {
  AddStaffContactForm,
  RelationshipEnum,
} from "../../../schemas/contact";

const relationshipOptions = RelationshipEnum.options.map((v) => ({
  value: v,
  label: v,
}));

export default function AddContact() {
  const { register, control, formState, watch } =
    useFormContext<AddStaffContactForm>();
  const { errors } = formState;

  //   const familyAccessEnabled = getValues("familyAccessApp");

  return (
    <div className="grid grid-cols-1 gap-4">
      <TextField
        label="Full Name"
        placeholder="Enter full name"
        required
        {...register("nextOfKinFullName")}
        error={errors.nextOfKinFullName?.message}
      />
      <RHFSelectField
        control={control}
        {...register("gender")}
        name="gender"
        label="Gender"
        options={[
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
          { value: "Other", label: "Other" },
        ]}
      />

      <RHFSelectField
        control={control}
        name="relationship"
        label="Relationship"
        placeholder="Select relationship to client..."
        options={relationshipOptions}
      />

      <TextField
        label="Phone Number"
        placeholder="Enter phone number"
        inputMode="tel"
        {...register("phone")}
        error={errors.phone?.message}
        // hint="Digits, spaces, (), -, optional +"
      />
      <TextField
        label="Email Address"
        placeholder="Enter email address"
        inputMode="email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />

      <TextField
        label="Address"
        placeholder="Full address"
        {...register("address")}
        error={errors.address?.message}
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

      <Separator />
      {/* Toggles */}
      <div className="mt-2 space-y-4">
        <Controller
          control={control}
          name="mainPointOfContact"
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
          name="availiableForUrgentSituation"
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
      </div>
    </div>
  );
}
