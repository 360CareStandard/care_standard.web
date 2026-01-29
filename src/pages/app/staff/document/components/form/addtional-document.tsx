import { TextField } from "@/components/shared/text-field";
import { Controller, useFormContext } from "react-hook-form";
import { StaffDocumentForm } from "../../../schemas/document";
import { SingleDocumentUploader } from "@/components/shared/single-document-uploader";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { useEffect } from "react";

export const AdditionalDocumentForm = () => {
  const { formState, register, watch } = useFormContext<StaffDocumentForm>();

  const expires = watch("expired");
  const { errors } = formState;

  return (
    <div className="space-y-4">
      {errors.root?.message && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {errors.root.message}
        </div>
      )}
      <TextField
        label="Document type"
        {...register("documentType")}
        error={errors.documentType?.message}
        className="disabled:bg-gray-100"
      />
      <div>
        <SingleDocumentUploader<StaffDocumentForm>
          fileField="documentFile"
          urlField="documentUrl"
        />
        {typeof errors.documentFile?.message === "string" && (
          <p className="text-xs text-red-500 mt-1">
            {errors.documentFile.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Does this document expire?</Label>

        <Controller
          name="expired"
          defaultValue={false} // ✅ IMPORTANT
          render={({ field }) => (
            <RadioGroup
              value={field.value ? "yes" : "no"}
              onValueChange={(value) => field.onChange(value === "yes")}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="expires-yes" />
                <Label htmlFor="expires-yes">Yes</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="expires-no" />
                <Label htmlFor="expires-no">No</Label>
              </div>
            </RadioGroup>
          )}
        />
      </div>
      {expires && (
        <TextField
          type="date"
          label="Expiry Date"
          {...register("expiryDate")}
          error={errors.expiryDate?.message}
        />
      )}
      <div className="space-y-4">
        <span className="text-xs text-muted-foreground">
          An action will be created automatically to confirm renewal of this
          document 3 months before expiry
        </span>
      </div>
    </div>
  );
};
