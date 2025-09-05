// features/clients/components/wellbeing-overview.tsx
import { TextareaField } from "@/components/shared/textarea-field";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { ClientFormData } from "../schemas/add-client";
import { RHFSelectField } from "@/components/shared/rhf-select-field";

interface Props {
  watch: UseFormWatch<ClientFormData>;
  register: UseFormRegister<ClientFormData>;
  errors: FieldErrors<ClientFormData>;
  control: Control<ClientFormData>;
  attemptedNext: boolean;
  setValue: UseFormSetValue<ClientFormData>;
}

const WellbeingOverview = ({
  control,
  attemptedNext,
  setValue,
  watch,
}: Props) => {
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Wellbeing Overview</h2>
        <p className="text-sm text-muted-foreground">
          A short introduction to help carers understand the person and their
          current health status behind the profile.
        </p>
      </div>

      <TextareaField
        label="Access details"
        placeholder="Enter access details..."
        value={watch("wellbeing") ?? ""}
        onChange={(e) =>
          setValue("wellbeing", e.target.value, { shouldDirty: true })
        }
        showCounter
        maxLength={400}
        autoResize
        // maxRows={6}
      />

      <RHFSelectField
        control={control}
        name="riskLevel"
        label="Risk level"
        options={[
          { value: "H", label: "High" },
          { value: "M", label: "Medium" },
          { value: "L", label: "Low" },
        ]}
        forceShowError={attemptedNext}
      />
    </div>
  );
};

export default WellbeingOverview;
