// FundingFields.tsx
import { useFormContext } from "react-hook-form";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
import { TextField } from "@/components/shared/text-field";
import { FundingSourceEnum } from "../../schemas/funding-source";
import { CareSetupForm } from "../../schemas/care-setup";

const fundingOptions = FundingSourceEnum.options.map((v) => ({
  value: v,
  label: v,
}));

export function FundingFields() {
  const { register, control, formState } = useFormContext<CareSetupForm>();
  const { errors } = formState;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <RHFSelectField
        control={control}
        name="fundingSource"
        label="Funding Source"
        placeholder="Select funding source"
        options={fundingOptions}
      />

      <TextField
        label="Funder/Council/ICB"
        placeholder="e.g. Camden Council"
        {...register("funderCouncil")}
        error={errors.funderCouncil?.message}
      />

      <TextField
        label="Authorisation/ Reference No."
        placeholder="e.g. CAM-23456"
        {...register("authorisationRef")}
        error={errors.authorisationRef?.message}
      />

      <TextField
        label="Budget Cap/Rate Plan"
        placeholder="e.g. £500/week"
        {...register("budgetCap")}
        error={errors.budgetCap?.message}
      />
    </div>
  );
}
