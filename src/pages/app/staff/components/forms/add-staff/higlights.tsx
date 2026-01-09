// features/clients/components/wellbeing-overview.tsx
import { TextareaField } from "@/components/shared/textarea-field";
import { useFormContext } from "react-hook-form";
import { StaffFormData } from "../../../schemas/add-staff";

const Highlights = () => {
  const { watch, setValue } = useFormContext<StaffFormData>();
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Highlights</h2>
        <p className="text-sm text-muted-foreground">
          A short introduction to help understand the person behind the profile.
        </p>
      </div>

      <TextareaField
        label="Highlights"
        placeholder="Enter a description of an outstanding part  you want to share about staff..."
        value={watch("highlights") ?? ""}
        onChange={(e) =>
          setValue("highlights", e.target.value, { shouldDirty: true })
        }
        showCounter
        maxLength={400}
        autoResize
        className="h-20"
        // maxRows={6}
      />
    </div>
  );
};

export default Highlights;
