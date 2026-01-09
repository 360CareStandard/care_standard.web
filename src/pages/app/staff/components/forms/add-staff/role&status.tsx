import { useFormContext, Controller } from "react-hook-form";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
import { StaffFormData } from "../../../schemas/add-staff";
import { Radio } from "@/components/ui/form-controls";
import { Label } from "@/components/ui/label";

interface Props {
  attemptedNext: boolean;
}

const RoleAndStatus = ({ attemptedNext }: Props) => {
  const { control, watch } = useFormContext<StaffFormData>();

  const role = watch("staffRole");

  return (
    <div className="grid gap-4">
      <RHFSelectField
        control={control}
        name="staffRole"
        label="Staff Role"
        options={[
          { value: "Carer", label: "Carer" },
          { value: "Admin", label: "Admin" },
        ]}
        forceShowError={attemptedNext}
      />

      <RHFSelectField
        control={control}
        name="status"
        label="Status"
        options={[
          { value: "active", label: "Active" },
          { value: "paused", label: "Paused" },
          { value: "inactive", label: "Inactive" },
        ]}
        forceShowError={attemptedNext}
      />

      {role === "Admin" && (
        <Controller
          control={control}
          name="adminAccessLevel"
          render={({ field, fieldState }) => (
            <div className="space-y-3">
              <h4>Access Level - ADMIN</h4>
              <Label>Admin Access</Label>

              <div className="flex gap-6">
                <Radio
                  label="Yes"
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                  className="accent-primary"
                />

                <Radio
                  label="No"
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                  className="accent-primary"
                />
              </div>

              {fieldState.error && (
                <p className="text-sm text-red-500">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      )}
    </div>
  );
};

export default RoleAndStatus;
