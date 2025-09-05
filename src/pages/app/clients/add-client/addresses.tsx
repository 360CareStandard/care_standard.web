// features/clients/components/addresses.tsx
"use client";

import { ClientFormData } from "../schemas/add-client";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { TextField } from "@/components/shared/text-field";
import { AddressMapBlock } from "../components/address-map-block";
import { TextareaField } from "@/components/shared/textarea-field";

interface Props {
  watch: UseFormWatch<ClientFormData>;
  register: UseFormRegister<ClientFormData>;
  errors: FieldErrors<ClientFormData>;
  control: Control<ClientFormData>; // kept for consistency with other steps
  attemptedNext: boolean; // if you ever want to force-show errors here
  setValue: UseFormSetValue<ClientFormData>;
}

const Addresses = ({
  watch, // not used yet, kept for parity with other steps
  register,
  errors,
  control,
  setValue,
}: Props) => {
  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Addresses</h2>

      <div>
        <p className="font-normal">Primary address</p>
      </div>

      <TextField
        label="Address line 1"
        placeholder="Enter address line 1"
        error={errors.addressLine1?.message}
        {...register("addressLine1")}
      />

      <TextField
        label="Address line 2"
        placeholder="Enter address line 2 (optional)"
        error={errors.addressLine2?.message}
        {...register("addressLine2")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="City"
          placeholder="City"
          error={errors.city?.message}
          {...register("city")}
        />
        <TextField
          label="County"
          placeholder="County / State"
          error={errors.state?.message}
          {...register("state")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Postal code"
          placeholder="e.g. SW1A 1AA"
          error={errors.postcode?.message}
          {...register("postcode")}
        />
        <TextField
          label="Country"
          placeholder=""
          error={errors.primaryPhoneCountry?.message}
          {...register("primaryPhoneCountry")}
        />
        {/* Reserved space for future Country field if you add it to the schema */}
        <div />
      </div>
      <TextareaField
        label="Access details"
        placeholder="Enter access details..."
        value={watch("accessDetails") ?? ""}
        onChange={(e) =>
          setValue("accessDetails", e.target.value, { shouldDirty: true })
        }
        hint="Gate code, parking, pets, special instructions, etc."
        showCounter
        maxLength={200}
        autoResize
        // maxRows={6}
      />
      <AddressMapBlock
        control={control}
        watch={watch}
        setValue={setValue}
        errors={errors}
      />
    </div>
  );
};

export default Addresses;
