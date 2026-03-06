import { useFormContext } from "react-hook-form";

import { TextField } from "@/components/shared/text-field";
import { RHFSelectField } from "@/components/shared/rhf-select-field";

import { AccessSettingsForm } from "../../../schemas/access-settings";

export default function AccessFormField() {
  const { register, control, formState } = useFormContext<AccessSettingsForm>();
  const { errors } = formState;

  //   const familyAccessEnabled = getValues("familyAccessApp");

  return (
    <div className="grid grid-cols-1 gap-4">
      <TextField
        label="Name"
        placeholder="Enter full name"
        required
        {...register("fullName")}
        error={errors.fullName?.message}
      />

      <TextField
        label="Phone"
        placeholder="Enter phone number"
        inputMode="tel"
        {...register("phone")}
        error={errors.phone?.message}
        // hint="Digits, spaces, (), -, optional +"
      />
      <TextField
        label="Email"
        required
        placeholder="Enter email address"
        inputMode="email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />

      <RHFSelectField
        control={control}
        name="relationshipToClient"
        label="Relationship"
        placeholder="Select relationship to client..."
        options={[
          { value: "daughter", label: "Daughter" },
          { value: "son", label: "Son" },
          { value: "spouse", label: "Spouse" },
          { value: "partner", label: "Partner" },
          { value: "sibling", label: "Sibling" },
          { value: "friend", label: "Friend" },
          { value: "other", label: "Other" },
        ]}
      />

      <RHFSelectField
        control={control}
        {...register("accessLevel")}
        name="accessLevel"
        label="Access Level"
        options={[{ value: "read_only", label: "Read-only" }]}
      />
    </div>
  );
}
