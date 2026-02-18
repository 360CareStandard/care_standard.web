// components/gp/GPInformationFields.tsx
import { useFormContext } from "react-hook-form";
import { TextField } from "@/components/shared/text-field";
import { AddStaffSkillForm } from "../../../schemas/skill";
import { TextareaField } from "@/components/shared/textarea-field";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SingleDocumentUploader } from "@/components/shared/single-document-uploader";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
export function SkillForm() {
  const { watch, setValue, formState, control, register } =
    useFormContext<AddStaffSkillForm>();

  const hasCertificate = watch("hasCertificate");

  const { errors } = formState;

  return (
    <div className="space-y-4">
      <RHFSelectField
        control={control}
        {...register("skillName")}
        name="skillName"
        label="Skill Name"
        options={[
          { value: "Moving & Handling", label: "Moving & Handling" },
          {
            value: "Medication Administration",
            label: "Medication Administration",
          },
          { value: "Dementia Care", label: "Dementia Care" },
          { value: "First Aid", label: "First Aid" },
          { value: "Safeguarding", label: "Safeguarding" },
          { value: "Personal Care", label: "Personal Care" },
        ]}
        showErrorWhen="touched"
      />

      {/* <TextField
        label="Skill Type"
        {...register("skillType")}
        error={errors.skillType?.message}
      /> */}

      <TextareaField
        label="Notes (Optional)"
        {...register("note")}
        value={watch("note") ?? ""}
        error={errors.note?.message}
      />

      {/* Certificate Switch */}
      <div className="flex items-start justify-between gap-4 py-2">
        <div>
          <Label className="font-medium mb-1">Skill Type</Label>
          <p className="text-sm text-muted-foreground">
            This skill has a certificate
          </p>
        </div>

        <Switch
          checked={hasCertificate}
          onCheckedChange={(checked) => {
            setValue("hasCertificate", checked, { shouldValidate: true });

            if (!checked) {
              // 🔥 Clear dependent fields
              setValue("expiredAt", undefined, { shouldValidate: true });
              setValue("certificateDocument", undefined, {
                shouldValidate: true,
              });
              setValue("certificateDocumentUrl", undefined, {
                shouldValidate: false,
              });
            }
          }}
        />
      </div>

      {hasCertificate && (
        <div className="space-y-4">
          <SingleDocumentUploader<AddStaffSkillForm>
            label="Certificate document"
            fileField="certificateDocument"
            urlField="certificateDocumentUrl"
          />

          <TextField
            type="date"
            label="Expiry Date"
            {...register("expiredAt")}
            error={errors.expiredAt?.message}
          />
        </div>
      )}
    </div>
  );
}
