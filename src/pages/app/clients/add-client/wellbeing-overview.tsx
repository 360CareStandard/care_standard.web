// features/clients/components/wellbeing-overview.tsx
import { TextareaField } from "@/components/shared/textarea-field";
import { useFormContext } from "react-hook-form";
import { ClientFormData } from "../schemas/add-client";
import { RHFSelectField } from "@/components/shared/rhf-select-field";

interface Props {
  attemptedNext: boolean;
}

const WellbeingOverview = ({ attemptedNext }: Props) => {
  const { control, watch, setValue } = useFormContext<ClientFormData>();

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
        label="Wellbeing details"
        placeholder="Enter wellbeing details..."
        value={watch("wellbeingDetails") ?? ""}
        onChange={(e) =>
          setValue("wellbeingDetails", e.target.value, { shouldDirty: true })
        }
        showCounter
        maxLength={400}
        autoResize
        className="h-20"
        // maxRows={6}
      />

      <RHFSelectField
        control={control}
        name="riskLevel"
        label="Risk level"
        options={[
          { value: "high", label: "High" },
          { value: "medium", label: "Medium" },
          { value: "low", label: "Low" },
        ]}
        forceShowError={attemptedNext}
      />
    </div>
  );
};

export default WellbeingOverview;
