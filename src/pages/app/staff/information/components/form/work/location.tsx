// components/gp/GPInformationFields.tsx
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { StaffWorkForm } from "@/pages/app/staff/schemas/work";
import { AddressAutocomplete } from "../../address-autocomplete";
import { StaffAddressMapBlock } from "../../address-map-block";
import { RHFSelectField } from "@/components/shared/rhf-select-field";
export function LocationAndTransport() {
  const { setValue, control } = useFormContext<StaffWorkForm>();

  return (
    <div className="space-y-4">
      <div className="relative z-20 space-y-3">
        <Label className="mb-1">Address</Label>
        <AddressAutocomplete control={control} setValue={setValue} />
      </div>

      <div className="relative z-10">
        <StaffAddressMapBlock />
      </div>

      <RHFSelectField
        control={control}
        name="modeOfTransport"
        label="Mode of transport"
        placeholder="Select mode of transport"
        options={[
          { value: "Own car", label: "Own car" },
          { value: "Bike", label: "Bike" },
          { value: "Public transport", label: "Public transport" },
        ]}
      />
    </div>
  );
}
