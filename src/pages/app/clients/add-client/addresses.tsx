// features/clients/components/addresses.tsx
"use client";

import { ClientFormData } from "../schemas/add-client";
import { useFormContext } from "react-hook-form";
import { TextField } from "@/components/shared/text-field";
import { AddressMapBlock } from "../components/address-map-block";
import { TextareaField } from "@/components/shared/textarea-field";
import { AddressAutocomplete } from "../components/address-autocomplete";

const Addresses = () => {
  const { register, control, formState, watch, setValue } =
    useFormContext<ClientFormData>();
  const { errors } = formState;
  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Addresses</h2>

      <div>
        <p className="font-normal">Primary address</p>
      </div>
      <AddressAutocomplete setValue={setValue} />

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
          label="Zip code"
          placeholder="e.g. SW1A 1AA"
          error={errors.zip?.message}
          {...register("zip")}
        />
        <TextField
          label="Country"
          placeholder=""
          error={errors.country?.message}
          {...register("country")}
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
